/* eslint-disable prefer-object-spread, default-param-last */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@mui/styles';

import { updateOperation } from './actions/submit';
import {
  resetInitCommon, resetInitNmr, resetInitMs, resetInitCommonWithIntergation, resetDetector,
  resetMultiplicity,
} from './actions/manager';
import { updateMetaPeaks, updateDSCMetaData } from './actions/meta';
import { addOthers } from './actions/jcamp';
import LayerPrism from './layer_prism';
import Format from './helpers/format';
import MultiJcampsViewer from './components/multi_jcamps_viewer';
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
    this.hasSameMultiEntities = this.hasSameMultiEntities.bind(this);
  }

  componentDidMount() {
    this.execReset();
    this.initReducer();
    this.updateOthers();
    this.updateMultiEntities();
  }

  componentDidUpdate(prevProps) {
    this.normChange(prevProps);
    this.updateOthers();
    const { entity, multiEntities } = this.props;
    const multiEntitiesChanged = !this.hasSameMultiEntities(prevProps.multiEntities, multiEntities);
    const entityChanged = prevProps.entity !== entity;
    if (multiEntitiesChanged || entityChanged) {
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
      resetDetectorAct, updateDSCMetaDataAct, resetMultiplicityAct,
    } = this.props;
    resetInitCommonAct();
    resetDetectorAct();
    const { layout, features } = entity;
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
    updateOperationAct(operations[0]);
  }

  updateOthers() {
    const { others, addOthersAct } = this.props;
    addOthersAct(others);
  }

  hasSameMultiEntities(prevMultiEntities, nextMultiEntities) {
    if (prevMultiEntities === nextMultiEntities) return true;
    const prevArray = Array.isArray(prevMultiEntities) ? prevMultiEntities : null;
    const nextArray = Array.isArray(nextMultiEntities) ? nextMultiEntities : null;
    if (!prevArray && !nextArray) return true;
    if (!prevArray || !nextArray) return false;
    if (prevArray.length !== nextArray.length) return false;
    for (let idx = 0; idx < prevArray.length; idx += 1) {
      if (prevArray[idx] !== nextArray[idx]) return false;
    }
    return true;
  }

  updateMultiEntities() {
    const { multiEntities, setAllCurvesAct, entity } = this.props;
    const isMultiSpectra = Array.isArray(multiEntities) && multiEntities.length > 1;
    if (isMultiSpectra) {
      setAllCurvesAct(multiEntities);
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
    const target = entity.spectra[0];

    const { layout } = entity;

    const xxLabel = !xLabel && xLabel === '' ? `X (${target.xUnit})` : xLabel;
    const yyLabel = !yLabel && yLabel === '' ? `Y (${target.yUnit})` : yLabel;

    const isMultiSpectra = Array.isArray(multiEntities) && multiEntities.length > 1;
    if (isMultiSpectra) {
      return (
        <MultiJcampsViewer
          multiEntities={multiEntities}
          entityFileNames={entityFileNames}
          userManualLink={userManualLink}
          molSvg={molSvg}
          exactMass={exactMass}
          operations={operations}
          forecast={forecast}
          cLabel={cLabel}
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
          operations={operations}
          forecast={forecast}
          cLabel={cLabel}
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
