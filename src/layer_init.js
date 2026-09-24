/* eslint-disable prefer-object-spread, default-param-last */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@mui/styles';

import { updateOperation } from './actions/submit';
import { updateLayout } from './actions/layout';
import {
  resetInitCommon, resetInitNmr, resetInitMs, resetInitCommonWithIntergation, resetDetector,
  resetMultiplicity,
} from './actions/manager';
import { updateMetaPeaks, updateDSCMetaData } from './actions/meta';
import { addOthers } from './actions/jcamp';
import LayerPrism from './layer_prism';
import Format from './helpers/format';
import { entitySignature, multiEntitiesSignature } from './helpers/entity_signature';
import { getLcMsInfo, isLcMsGroup } from './helpers/extractEntityLCMS';
import { reconcileLcMsTimeAxes } from './features/lc-ms/entities/timeAxis';
import MultiJcampsViewer from './components/multi_jcamps_viewer';
import HPLCViewer from './components/hplc_viewer';
import { setAllCurves } from './actions/curve';
import { clearHplcMsState } from './actions/hplc_ms';
import { LIST_LAYOUT } from './constants/list_layout';

const styles = () => ({
});

class LayerInit extends React.Component {
  constructor(props) {
    super(props);

    this.normChange = this.normChange.bind(this);
    this.execReset = this.execReset.bind(this);
    this.initReducer = this.initReducer.bind(this);
    this.updateOthers = this.updateOthers.bind(this);
    this.updateMultiEntities = this.updateMultiEntities.bind(this);
    // Review finding S5 (PR #336): a layout the user picks by hand (the dropdown
    // dispatches updateLayoutAct directly, bypassing execReset) for an
    // unrecognized-datatype entity, keyed to that entity's dataset id. See
    // componentDidUpdate and execReset for why this can't just be read back from
    // Redux state.layout at the point execReset needs it.
    this.manualLayoutOverride = null;
  }

  componentDidMount() {
    this.execReset();
    this.initReducer();
    this.updateOthers();
    this.updateMultiEntities();
  }

  componentDidUpdate(prevProps) {
    const {
      others, multiEntities, entity, operations, layoutSt,
    } = this.props;
    const entityChanged = entitySignature(prevProps.entity)
      !== entitySignature(entity);
    // Review finding S5 (PR #336): state.layout changing to something other than
    // PLAIN while the entity itself did not is the user picking a layout by hand
    // (the dropdown dispatches updateLayoutAct directly -- the only other place
    // that happens for an entity execReset would otherwise force to PLAIN).
    // Remember it against this dataset so a later refresh of the SAME dataset can
    // restore it -- see execReset for why reading state.layout back live at that
    // point doesn't work. Excluding a transition *to* PLAIN here is deliberate: a
    // child's RESETALL (dispatched on its own mount, independent of any entity
    // change -- see the ForecastViewer-swap note in the S5 test file) carries this
    // still-unrecognized entity's own static PLAIN classification and can clobber
    // a just-recorded pick back to PLAIN in the very same tick; that must not
    // overwrite the real pick this override exists to remember.
    const entityIsUnrecognized = !entity?.layout || Format.isPlainLayout(entity.layout);
    if (
      !entityChanged && prevProps.layoutSt !== layoutSt
      && entityIsUnrecognized && layoutSt !== LIST_LAYOUT.PLAIN
    ) {
      const datasetId = entity?.idDt ?? entity?.id ?? entity?.datasetId;
      if (datasetId != null) {
        this.manualLayoutOverride = { datasetId, layout: layoutSt };
      }
    }
    this.normChange(prevProps, entityChanged);
    if (prevProps.operations !== operations || entityChanged) {
      this.initReducer();
    }
    if (prevProps.others !== others) {
      this.updateOthers();
    }
    if (multiEntitiesSignature(prevProps.multiEntities)
      !== multiEntitiesSignature(multiEntities)
      || entityChanged) {
      this.updateMultiEntities();
    }
  }

  normChange(prevProps, entityChanged) {
    const { entity, multiEntities, clearHplcMsStateAct } = this.props;
    if (entityChanged) {
      const prevIsLcms = Format.isLCMsLayout(prevProps.entity?.layout);
      const nextIsLcms = Format.isLCMsLayout(entity?.layout);
      const lcmsSessionActive = prevIsLcms && nextIsLcms
        && Array.isArray(multiEntities)
        && isLcMsGroup(multiEntities);
      if ((prevIsLcms || nextIsLcms) && !lcmsSessionActive) {
        const prevSig = entitySignature(prevProps.entity);
        const nextSig = entitySignature(entity);
        if (prevSig !== nextSig) {
          clearHplcMsStateAct();
        }
      }
      this.execReset();
    }
  }

  execReset() {
    const {
      entity, updateMetaPeaksAct,
      resetInitCommonAct, resetInitMsAct, resetInitNmrAct, resetInitCommonWithIntergationAct,
      resetDetectorAct, updateDSCMetaDataAct, resetMultiplicityAct, updateLayoutAct,
    } = this.props;
    if (!entity) return;
    resetInitCommonAct();
    resetDetectorAct();
    const { layout: rawLayout, features = {} } = entity;
    // helpers/chem.js's readLayout() itself now returns PLAIN (not a falsy
    // value) for a datatype it does not recognise, so entity.layout is
    // already normalized for anything built via FN.ExtractJcamp. This is
    // belt-and-suspenders for a host-constructed entity that skips that
    // classifier and hands us a falsy layout directly -- it must not inherit
    // whatever layout was previously in the Redux state slice either.
    //
    // Review finding S5 (PR #336): that normalization must not clobber a layout
    // the user picked by hand for THIS SAME dataset. A host that keys the editor
    // by dataset (chemotion_ELN does) can pass a refreshed entity for an
    // unrecognized datatype without remounting -- entitySignature still changes
    // (new content), execReset still runs, and naively PLAIN would land back over
    // that manual choice on every such refresh.
    //
    // This can't be answered by reading this.props.layoutSt here: ViewerLine (a
    // descendant, whose componentDidUpdate fires before this one) independently
    // dispatches RESETALL whenever the `feature` prop it's handed changes
    // reference -- which a refreshed entity's new content digest also does --
    // carrying that entity's own (still PLAIN) operation.layout. That RESETALL
    // already overwrote state.layout back to PLAIN by the time this line runs, so
    // this.props.layoutSt is exactly the value being raced, not a usable source
    // of truth. manualLayoutOverride is written only from componentDidUpdate's own
    // observation of a *prior*, separate commit where layoutSt changed with no
    // entity change -- immune to this commit's race -- and is what restores the
    // choice after that RESETALL clobbers it.
    const datasetId = entity.idDt ?? entity.id ?? entity.datasetId;
    const override = (datasetId != null && this.manualLayoutOverride?.datasetId === datasetId)
      ? this.manualLayoutOverride.layout
      : null;
    // rawLayout is 'PLAIN', not falsy, for anything built via readLayout -- so
    // `rawLayout || ...` alone never reaches the override or host-constructed-entity
    // fallback below. Both must be treated as "unrecognized, override-eligible".
    const isUnrecognized = !rawLayout || Format.isPlainLayout(rawLayout);
    const layout = isUnrecognized ? (override || LIST_LAYOUT.PLAIN) : rawLayout;
    updateLayoutAct(layout);
    if (Format.isMsLayout(layout)) {
      // const { autoPeak, editPeak } = features; // TBD
      const autoPeak = features.autoPeak || features[0];
      const editPeak = features.editPeak || features[0];
      const baseFeat = editPeak || autoPeak;
      resetInitMsAct(baseFeat);
    } else if (Format.isNmrLayout(layout)) {
      const { integration, multiplicity, simulation } = features;
      updateMetaPeaksAct(entity);
      resetInitNmrAct({
        integration, multiplicity, simulation,
      });
    } else if (Format.isHplcUvVisLayout(layout)) {
      const { integration } = features;
      updateMetaPeaksAct(entity);
      resetInitCommonWithIntergationAct({
        integration,
      });
    } else if (Format.isDSCLayout(layout)) {
      const { dscMetaData } = features;
      updateDSCMetaDataAct(dscMetaData);
    } else if (Format.isPlainLayout(layout)) {
      // Review finding S3 (PR #336): this used to fall into the generic `else`
      // below, which only resets multiplicity. buildIntegFeature/buildMpyFeature/
      // buildSimFeature always return a truthy object (with empty stacks) even for
      // a PLAIN entity, so integration/multiplicity/simulation from whatever was
      // PREVIOUSLY open at this curveIdx survived untouched -- invisible in the UI
      // (which hides integrals for PLAIN) but still read by the host's
      // submit/export path and saved against the PLAIN spectrum. Reset the same
      // per-curve slices the NMR branch above does, plus DSC metadata, which is
      // equally stale-prone and equally invisible here.
      const { integration, multiplicity, simulation } = features;
      updateMetaPeaksAct(entity);
      resetInitNmrAct({
        integration, multiplicity, simulation,
      });
      updateDSCMetaDataAct(undefined);
    } else {
      resetMultiplicityAct();
    }
  }

  initReducer() {
    const { operations, updateOperationAct } = this.props;
    if (Array.isArray(operations) && operations.length > 0) {
      updateOperationAct(operations[0]);
    }
  }

  updateOthers() {
    const { others, addOthersAct } = this.props;
    if (others) {
      addOthersAct(others);
    }
  }

  updateMultiEntities() {
    const { multiEntities, setAllCurvesAct, entity } = this.props;
    if (!entity) return;
    const lcmsCurveMeta = () => {
      const uvvisFromMulti = Array.isArray(multiEntities)
        ? multiEntities.find((e) => getLcMsInfo(e).kind === 'uvvis')
        : null;
      const mzFromMulti = Array.isArray(multiEntities)
        ? multiEntities.find((e) => getLcMsInfo(e).kind === 'mz')
        : null;
      const idDt = uvvisFromMulti?.idDt ?? uvvisFromMulti?.id ?? uvvisFromMulti?.datasetId
        ?? entity?.idDt ?? entity?.id ?? entity?.datasetId ?? null;
      const lcmsUvvisWavelength = entity?.lcms_uvvis_wavelength ?? entity?.lcmsUvvisWavelength
        ?? uvvisFromMulti?.lcms_uvvis_wavelength ?? uvvisFromMulti?.lcmsUvvisWavelength;
      const lcmsMzPage = entity?.lcms_mz_page ?? entity?.lcmsMzPage
        ?? mzFromMulti?.lcms_mz_page ?? mzFromMulti?.lcmsMzPage
        ?? uvvisFromMulti?.lcms_mz_page ?? uvvisFromMulti?.lcmsMzPage;
      const mzInfo = mzFromMulti ? getLcMsInfo(mzFromMulti) : null;
      const lcmsPolarity = entity?.lcms_polarity ?? entity?.lcmsPolarity ?? entity?.ticPolarity
        ?? mzFromMulti?.lcms_polarity ?? mzFromMulti?.lcmsPolarity
        ?? (mzInfo?.kind === 'mz' ? mzInfo.polarity : null);
      const out = {};
      if (idDt != null) out.idDt = idDt;
      if (lcmsUvvisWavelength != null && lcmsUvvisWavelength !== '') {
        out.lcmsUvvisWavelength = lcmsUvvisWavelength;
      }
      if (lcmsMzPage != null && lcmsMzPage !== '') {
        out.lcmsMzPage = lcmsMzPage;
      }
      if (lcmsPolarity != null && lcmsPolarity !== '') {
        out.lcmsPolarity = lcmsPolarity;
      }
      return Object.keys(out).length ? out : undefined;
    };
    const isMultiSpectra = Array.isArray(multiEntities) && multiEntities.length > 1;
    if (isMultiSpectra) {
      const meta = Format.isLCMsLayout(entity.layout) ? lcmsCurveMeta() : undefined;
      setAllCurvesAct(reconcileLcMsTimeAxes(multiEntities), meta);
      return;
    }

    if (Format.isLCMsLayout(entity.layout)) {
      const payload = (Array.isArray(multiEntities) && multiEntities.length > 0)
        ? multiEntities
        : [entity];
      setAllCurvesAct(reconcileLcMsTimeAxes(payload), lcmsCurveMeta());
      return;
    }

    if (Format.isCyclicVoltaLayout(entity.layout)) {
      const payload = (Array.isArray(multiEntities) && multiEntities.length > 0)
        ? multiEntities
        : [entity];
      setAllCurvesAct(payload);
      return;
    }

    setAllCurvesAct(false);
  }

  render() {
    const {
      entity, cLabel, xLabel, yLabel, forecast, operations,
      descriptions, molSvg, editorOnly, exactMass,
      canChangeDescription, onDescriptionChanged,
      multiEntities, entityFileNames, userManualLink, onLcmsPageRequest,
    } = this.props;
    const { layout } = entity;
    const hasMultiEntities = Array.isArray(multiEntities) && multiEntities.length > 0;
    const hasLcmsEntity = hasMultiEntities
      && multiEntities.some((multiEntity) => Format.isLCMsLayout(multiEntity?.layout));
    const isDetectedLcmsGroup = hasLcmsEntity && isLcMsGroup(multiEntities);
    // For multi mode, trust multiEntities over single entity to avoid mixed-layout misrouting.
    const isLcms = hasMultiEntities
      ? isDetectedLcmsGroup
      : Format.isLCMsLayout(layout);
    const target = isLcms
      ? null
      : (entity.spectra && Array.isArray(entity.spectra) && entity.spectra[0]) || null;

    const xxLabel = (!xLabel && xLabel === '' && target && target.xUnit) ? `X (${target.xUnit})` : xLabel;
    const yyLabel = (!yLabel && yLabel === '' && target && target.yUnit) ? `Y (${target.yUnit})` : yLabel;
    const isMultiSpectra = Array.isArray(multiEntities) && multiEntities.length > 1;
    if (isLcms) {
      return (
        <HPLCViewer
          entityFileNames={entityFileNames}
          userManualLink={userManualLink}
          molSvg={molSvg}
          forecast={forecast}
          operations={operations}
          descriptions={descriptions}
          canChangeDescription={canChangeDescription}
          onDescriptionChanged={onDescriptionChanged}
          editorOnly={editorOnly}
          onLcmsPageRequest={onLcmsPageRequest}
        />
      );
    }
    if (isMultiSpectra) {
      return (
        <MultiJcampsViewer
          multiEntities={multiEntities}
          entityFileNames={entityFileNames}
          userManualLink={userManualLink}
          molSvg={molSvg}
          exactMass={exactMass}
          forecast={forecast}
          editorOnly={editorOnly}
          operations={operations}
          descriptions={descriptions}
          canChangeDescription={canChangeDescription}
          onDescriptionChanged={onDescriptionChanged}
        />
      );
    } else if (Format.isCyclicVoltaLayout(layout)) {  // eslint-disable-line
      return (
        <MultiJcampsViewer
          multiEntities={[entity]}
          entityFileNames={entityFileNames}
          userManualLink={userManualLink}
          molSvg={molSvg}
          exactMass={exactMass}
          forecast={forecast}
          editorOnly={editorOnly}
          operations={operations}
          descriptions={descriptions}
          canChangeDescription={canChangeDescription}
          onDescriptionChanged={onDescriptionChanged}
        />
      );
    }

    return (
      <LayerPrism
        entity={entity}
        cLabel={cLabel}
        xLabel={xxLabel}
        yLabel={yyLabel}
        forecast={forecast}
        operations={operations}
        descriptions={descriptions}
        molSvg={molSvg}
        editorOnly={editorOnly}
        exactMass={exactMass}
        entityFileNames={entityFileNames}
        userManualLink={userManualLink}
        canChangeDescription={canChangeDescription}
        onDescriptionChanged={onDescriptionChanged}
      />
    );
  }
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    resetInitCommonAct: resetInitCommon,
    resetInitNmrAct: resetInitNmr,
    resetInitMsAct: resetInitMs,
    resetInitCommonWithIntergationAct: resetInitCommonWithIntergation,
    resetDetectorAct: resetDetector,
    resetMultiplicityAct: resetMultiplicity,
    updateOperationAct: updateOperation,
    updateLayoutAct: updateLayout,
    updateMetaPeaksAct: updateMetaPeaks,
    addOthersAct: addOthers,
    setAllCurvesAct: setAllCurves,
    updateDSCMetaDataAct: updateDSCMetaData,
    clearHplcMsStateAct: clearHplcMsState,
  }, dispatch)
);

LayerInit.propTypes = {
  entity: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  multiEntities: PropTypes.array, // eslint-disable-line
  entityFileNames: PropTypes.array, // eslint-disable-line
  others: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  molSvg: PropTypes.string.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  exactMass: PropTypes.string.isRequired,
  forecast: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  descriptions: PropTypes.array.isRequired,
  resetInitCommonAct: PropTypes.func.isRequired,
  resetInitNmrAct: PropTypes.func.isRequired,
  resetInitMsAct: PropTypes.func.isRequired,
  resetInitCommonWithIntergationAct: PropTypes.func.isRequired,
  updateOperationAct: PropTypes.func.isRequired,
  updateLayoutAct: PropTypes.func.isRequired,
  updateMetaPeaksAct: PropTypes.func.isRequired,
  addOthersAct: PropTypes.func.isRequired,
  canChangeDescription: PropTypes.bool.isRequired,
  onDescriptionChanged: PropTypes.func, // eslint-disable-line
  onLcmsPageRequest: PropTypes.func,
  setAllCurvesAct: PropTypes.func.isRequired,
  userManualLink: PropTypes.object, // eslint-disable-line
  resetDetectorAct: PropTypes.func.isRequired,
  resetMultiplicityAct: PropTypes.func.isRequired,
  updateDSCMetaDataAct: PropTypes.func.isRequired,
  clearHplcMsStateAct: PropTypes.func.isRequired,
};

LayerInit.defaultProps = {
  onLcmsPageRequest: null,
};

export default connect( // eslint-disable-line
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(LayerInit)); // eslint-disable-line
