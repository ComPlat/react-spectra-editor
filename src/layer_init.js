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
import { isLcMsGroup } from './helpers/extractEntityLCMS';
import MultiJcampsViewer from './components/multi_jcamps_viewer';
import HPLCViewer from './components/hplc_viewer';
import { setAllCurves } from './actions/curve';

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
    const { entity } = this.props;
    if (prevProps.entity !== entity) {
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
    const isMultiSpectra = Array.isArray(multiEntities) && multiEntities.length > 1;
    if (isMultiSpectra) {
      setAllCurvesAct(multiEntities);
      return;
    }

    if (Format.isLCMsLayout(entity.layout)) {
      const payload = (Array.isArray(multiEntities) && multiEntities.length > 0)
        ? multiEntities
        : [entity];
      setAllCurvesAct(payload);
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
      multiEntities, entityFileNames, userManualLink,
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
  setAllCurvesAct: PropTypes.func.isRequired,
  userManualLink: PropTypes.object, // eslint-disable-line
  resetDetectorAct: PropTypes.func.isRequired,
  resetMultiplicityAct: PropTypes.func.isRequired,
  updateDSCMetaDataAct: PropTypes.func.isRequired,
};

export default connect( // eslint-disable-line
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(LayerInit)); // eslint-disable-line
