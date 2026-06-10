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
import { getLcMsInfo, isLcMsGroup } from './helpers/extractEntityLCMS';
import MultiJcampsViewer from './components/multi_jcamps_viewer';
import HPLCViewer from './components/hplc_viewer';
import { setAllCurves } from './actions/curve';
import { clearHplcMsState } from './actions/hplc_ms';

const styles = () => ({
});

class LayerInit extends React.Component {
  static entitySignature(e) {
    if (!e) return 'none';
    const id = e.idDt ?? e.id ?? e.datasetId;
    if (id != null && id !== '') return `id:${id}`;
    const firstFeature = (Array.isArray(e.features) ? e.features[0] : null)
      || (Array.isArray(e.spectra) ? e.spectra[0] : null)
      || null;
    const data0 = firstFeature?.data?.[0];
    const xs = data0?.x;
    const xLen = Array.isArray(xs) ? xs.length : 0;
    const xHead = Array.isArray(xs) && xs.length > 0 ? xs[0] : '';
    const xTail = Array.isArray(xs) && xs.length > 0 ? xs[xs.length - 1] : '';
    return `sig:${e.layout || ''}|${e.title || ''}|${xLen}|${xHead}|${xTail}`;
  }

  constructor(props) {
    super(props);

    this.normChange = this.normChange.bind(this);
    this.execReset = this.execReset.bind(this);
    this.initReducer = this.initReducer.bind(this);
    this.updateOthers = this.updateOthers.bind(this);
    this.updateMultiEntities = this.updateMultiEntities.bind(this);
  }

  componentDidMount() {
    this.execReset();
    this.initReducer();
    this.updateOthers();
    this.updateMultiEntities();
  }

  componentDidUpdate(prevProps) {
    const {
      others, multiEntities, entity, operations,
    } = this.props;
    this.normChange(prevProps);
    if (prevProps.operations !== operations || prevProps.entity !== entity) {
      this.initReducer();
    }
    if (prevProps.others !== others) {
      this.updateOthers();
    }
    if (prevProps.multiEntities !== multiEntities
      || prevProps.entity !== entity) {
      this.updateMultiEntities();
    }
  }

  normChange(prevProps) {
    const { entity, multiEntities, clearHplcMsStateAct } = this.props;
    if (prevProps.entity !== entity) {
      const prevIsLcms = Format.isLCMsLayout(prevProps.entity?.layout);
      const nextIsLcms = Format.isLCMsLayout(entity?.layout);
      const lcmsSessionActive = prevIsLcms && nextIsLcms
        && Array.isArray(multiEntities)
        && isLcMsGroup(multiEntities);
      if ((prevIsLcms || nextIsLcms) && !lcmsSessionActive) {
        const prevSig = LayerInit.entitySignature(prevProps.entity);
        const nextSig = LayerInit.entitySignature(entity);
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
    if (!entity || !entity.layout) return;
    resetInitCommonAct();
    resetDetectorAct();
    const { layout, features = {} } = entity;
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
    if (!entity || !entity.layout) return;
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
      setAllCurvesAct(multiEntities, meta);
      return;
    }

    if (Format.isLCMsLayout(entity.layout)) {
      const payload = (Array.isArray(multiEntities) && multiEntities.length > 0)
        ? multiEntities
        : [entity];
      setAllCurvesAct(payload, lcmsCurveMeta());
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
  {}
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
