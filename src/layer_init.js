import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';

import { updateOperation } from './actions/submit';
import { resetInitCommon, resetInitNmr, resetInitMs, resetInitCommonWithIntergation } from './actions/manager';
import { updateMetaPeaks } from './actions/meta';
import { addOthers } from './actions/jcamp';
import LayerPrism from './layer_prism';
import Format from './helpers/format';

const styles = () => ({
});

class LayerInit extends React.Component {
  constructor(props) {
    super(props);

    this.normChange = this.normChange.bind(this);
    this.execReset = this.execReset.bind(this);
    this.initReducer = this.initReducer.bind(this);
    this.updateOthers = this.updateOthers.bind(this);
  }

  componentDidMount() {
    this.execReset();
    this.initReducer();
    this.updateOthers();
  }

  componentDidUpdate(prevProps) {
    this.normChange(prevProps);
    this.updateOthers();
  }

  normChange(prevProps) {
    const prevFeatures = prevProps.entity.features;
    const prevPeak = prevFeatures.editPeak || prevFeatures.autoPeak;
    const { entity } = this.props;
    const nextFeatures = entity.features;
    const nextPeak = nextFeatures.editPeak || nextFeatures.autoPeak;

    if (prevPeak !== nextPeak) {
      this.execReset();
    }
  }

  execReset() {
    const {
      entity, updateMetaPeaksAct,
      resetInitCommonAct, resetInitMsAct, resetInitNmrAct, resetInitCommonWithIntergationAct
    } = this.props;
    resetInitCommonAct();
    const { layout, features } = entity;
    if (Format.isMsLayout(layout)) {
      // const { autoPeak, editPeak } = features; // TBD
      const autoPeak = features.autoPeak || features[0];
      const editPeak = features.editPeak || features[0];
      const baseFeat = editPeak || autoPeak;
      resetInitMsAct(baseFeat);
    }
    if (Format.isNmrLayout(layout)) {
      const { integration, multiplicity, simulation } = features;
      updateMetaPeaksAct(entity);
      resetInitNmrAct({
        integration, multiplicity, simulation,
      });
    }
    else if (Format.isHplcUvVisLayout(layout)) {
      const { integration } = features;
      updateMetaPeaksAct(entity);
      resetInitCommonWithIntergationAct({
        integration
      });
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

  render() {
    const {
      entity, cLabel, xLabel, yLabel, xUnit, yUnit, forecast, operations,
      descriptions, molSvg, editorOnly,
      canChangeDescription, onDescriptionChanged
    } = this.props;
    const target = entity.spectra[0];

    const xxLabel = !xLabel && xLabel === '' ? `X (${target.xUnit})` : xLabel;
    const yyLabel = !yLabel && yLabel === '' ? `Y (${target.yUnit})` : yLabel;
    const xxUnit = !yUnit && xUnit === '' ? target.xUnit.toLowerCase() : xUnit;
    const yyUnit = !yUnit && yUnit === '' ? target.yUnit.toLowerCase() : yUnit;

    return (
      <LayerPrism
        entity={entity}
        cLabel={cLabel}
        xLabel={xxLabel}
        yLabel={yyLabel}
        xUnit={xxUnit}
        yUnit={yyUnit}
        forecast={forecast}
        operations={operations}
        descriptions={descriptions}
        molSvg={molSvg}
        editorOnly={editorOnly}
        canChangeDescription={canChangeDescription}
        onDescriptionChanged={onDescriptionChanged}
      />
    );
  }
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {}
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    resetInitCommonAct: resetInitCommon,
    resetInitNmrAct: resetInitNmr,
    resetInitMsAct: resetInitMs,
    resetInitCommonWithIntergationAct: resetInitCommonWithIntergation,
    updateOperationAct: updateOperation,
    updateMetaPeaksAct: updateMetaPeaks,
    addOthersAct: addOthers,
  }, dispatch)
);

LayerInit.propTypes = {
  entity: PropTypes.object.isRequired,
  others: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  xUnit: PropTypes.string.isRequired,
  yUnit: PropTypes.string.isRequired,
  molSvg: PropTypes.string.isRequired,
  editorOnly: PropTypes.bool.isRequired,
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
  onDescriptionChanged: PropTypes.func
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(LayerInit));
