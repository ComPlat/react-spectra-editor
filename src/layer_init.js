/* eslint-disable prefer-object-spread, default-param-last */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@mui/styles';

import { updateOperation } from './actions/submit';
import { updateLayout, setCurrentDataset, setManualLayoutOverride } from './actions/layout';
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
  }

  componentDidMount() {
    // Review finding B3 (PR #336): the override recorded in reducer_layout_override.js
    // must not survive past the LayerInit instance it was picked for. Most hosts
    // (chemotion_ELN included -- see execReset's own comment) key their <SpectraEditor>
    // by dataset id and never pass that id down as an entity field, so a genuine
    // switch to a different dataset remounts this component fresh rather than handing
    // it a new entity prop; a same-dataset refresh does not. Clearing here, before
    // execReset runs, is what scopes the override to "picked sometime during this
    // mount" for a host with no other identity signal to key it on.
    //
    // execReset(true) below, not just this dispatch: this.props is a snapshot from
    // before componentDidMount ran (react-redux updates it only on a subsequent
    // render, never synchronously mid-lifecycle-method), so execReset reading
    // this.props.layoutOverrideSt here would still see whatever was stored before
    // this dispatch, not after it -- the explicit flag is what actually makes this
    // one call ignore it, regardless of prop timing.
    const { setManualLayoutOverrideAct } = this.props;
    setManualLayoutOverrideAct(null);
    this.execReset(true);
    this.initReducer();
    this.updateOthers();
    this.updateMultiEntities();
  }

  componentDidUpdate(prevProps) {
    const {
      others, multiEntities, entity, operations,
    } = this.props;
    const entityChanged = entitySignature(prevProps.entity)
      !== entitySignature(entity);
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

  execReset(freshMount = false) {
    const {
      entity, layoutOverrideSt, updateMetaPeaksAct,
      resetInitCommonAct, resetInitMsAct, resetInitNmrAct, resetInitCommonWithIntergationAct,
      resetDetectorAct, updateDSCMetaDataAct, resetMultiplicityAct, updateLayoutAct,
      setCurrentDatasetAct,
    } = this.props;
    if (!entity) return;
    resetInitCommonAct();
    resetDetectorAct();
    const { layout: rawLayout, features = {} } = entity;
    const datasetId = entity.idDt ?? entity.id ?? entity.datasetId;
    setCurrentDatasetAct(datasetId ?? null);
    // helpers/chem.js's readLayout() itself now returns PLAIN (not a falsy
    // value) for a datatype it does not recognise, so entity.layout is
    // already normalized for anything built via FN.ExtractJcamp. This is
    // belt-and-suspenders for a host-constructed entity that skips that
    // classifier and hands us a falsy layout directly -- it must not inherit
    // whatever layout was previously in the Redux state slice either.
    //
    // Review finding S5 (PR #336) and a Copilot follow-up: that normalization must
    // not clobber a layout the user picked by hand for THIS SAME dataset. A host
    // that keys the editor by dataset (chemotion_ELN does) can pass a refreshed
    // entity for an unrecognized datatype without remounting -- entitySignature
    // still changes (new content), execReset still runs, and naively PLAIN would
    // land back over that manual choice on every such refresh.
    //
    // This can't be answered by inferring a pick from watching state.layout change
    // in componentDidUpdate (S5's first attempt): a child's RESETALL dispatch (e.g.
    // ForecastViewer's mount-time reset, independent of any entity change) can also
    // change that same state, in the same tick as the pick, in whichever order
    // react-redux happens to schedule the two -- so state.layout does not reliably
    // reflect "the last thing the user chose" by the time this line runs, and a
    // watcher can miss the pick, or mistake the child's own reset for one.
    // layoutOverrideSt (reducer_layout_override.js) is written only by the layout
    // dropdown's own dispatch (r01_layout.js's onChange, alongside updateLayoutAct),
    // never by RESETALL, so it cannot be raced or clobbered by it -- including an
    // explicit PLAIN selection, which is recorded the same as any other pick.
    //
    // Review finding B3 (PR #336): matching on datasetId alone left this dead for
    // chemotion_ELN specifically -- its non-LC/MS entities (FN.buildData's pass-through
    // shape, `{ spectra, features, layout }`) never carry idDt/id/datasetId at all, so
    // datasetId is always null there and no override could ever match. componentDidMount
    // clearing the override above is what makes it safe to trust *any* stored override
    // once no id is available to check: it can only have been picked during this same
    // mount, for this same entity, since a genuine switch to a different dataset either
    // remounts this component (chemotion_ELN's <SpectraEditor key={...}>, clearing it)
    // or -- for a host that both omits an id and reuses the same instance across
    // datasets -- was never distinguishable from a refresh in the first place. When an
    // id *is* available on both sides, still require it to match, for a host that
    // reuses the same instance across datasets it does identify.
    //
    // freshMount: componentDidMount dispatches setManualLayoutOverrideAct(null) and
    // calls execReset(true) in the same lifecycle call. react-redux does not update
    // this.props synchronously from that dispatch -- layoutOverrideSt here would
    // still be the pre-clear value from whatever host/instance existed before this
    // mount, not the clear that was just dispatched. A freshMount call ignores
    // layoutOverrideSt entirely rather than trust that stale snapshot; the dispatch
    // still matters for Redux hygiene, since it's what the NEXT execReset() call
    // (normChange, no freshMount) will correctly see.
    const storedOverride = freshMount ? null : layoutOverrideSt?.override;
    const idsDiffer = datasetId != null && storedOverride?.datasetId != null
      && storedOverride.datasetId !== datasetId;
    const override = (storedOverride && !idsDiffer) ? storedOverride.layout : null;
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
    layoutOverrideSt: state.layoutOverride,
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
    setCurrentDatasetAct: setCurrentDataset,
    setManualLayoutOverrideAct: setManualLayoutOverride,
    updateMetaPeaksAct: updateMetaPeaks,
    addOthersAct: addOthers,
    setAllCurvesAct: setAllCurves,
    updateDSCMetaDataAct: updateDSCMetaData,
    clearHplcMsStateAct: clearHplcMsState,
  }, dispatch)
);

LayerInit.propTypes = {
  entity: PropTypes.object.isRequired,
  layoutOverrideSt: PropTypes.object.isRequired,
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
  setCurrentDatasetAct: PropTypes.func.isRequired,
  setManualLayoutOverrideAct: PropTypes.func.isRequired,
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
