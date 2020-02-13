import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';

import { updateOperation } from './actions/submit';
import { resetScanAll } from './actions/scan';
import { resetParamsAll } from './actions/manager';
import { updateMetaPeaks } from './actions/meta';
import LayerPrism from './layer_prism';
import { GetFeature } from './helpers/chem';

const styles = () => ({
});

class LayerInit extends React.Component {
  constructor(props) {
    super(props);

    this.normChange = this.normChange.bind(this);
    this.execReset = this.execReset.bind(this);
    this.initReducer = this.initReducer.bind(this);
  }

  componentDidMount() {
    this.execReset();
    this.initReducer();
  }

  componentDidUpdate(prevProps) {
    this.normChange(prevProps);
  }

  normChange(prevProps) {
    const oldFeat = GetFeature(prevProps.entity);
    const { entity } = this.props;
    const newFeat = GetFeature(entity);

    if (oldFeat !== newFeat) {
      this.execReset();
    }
  }

  execReset() {
    const {
      entity, resetScanAllAct, resetParamsAllAct, updateMetaPeaksAct,
    } = this.props;
    const isEnMs = entity.spectrum.sTyp === 'MS';
    if (isEnMs) {
      const baseFeat = entity.features[0];
      resetScanAllAct(baseFeat);
    }
    const isEnNmr = entity.spectrum.sTyp === 'NMR';
    if (isEnNmr) {
      const { integration, multiplicity } = entity.features;
      updateMetaPeaksAct(entity);
      resetParamsAllAct({
        integration, multiplicity,
      });
    }
  }

  initReducer() {
    const { operations, updateOperationAct } = this.props;
    updateOperationAct(operations[0]);
  }

  render() {
    const {
      entity, cLabel, xLabel, yLabel, operations, forecast,
    } = this.props;

    const xxLabel = xLabel === '' ? `X (${entity.spectrum.xUnit})` : xLabel;
    const yyLabel = yLabel === '' ? `Y (${entity.spectrum.yUnit})` : yLabel;

    return (
      <LayerPrism
        entity={entity}
        cLabel={cLabel}
        xLabel={xxLabel}
        yLabel={yyLabel}
        forecast={forecast}
        operations={operations}
      />
    );
  }
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {}
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    resetScanAllAct: resetScanAll,
    resetParamsAllAct: resetParamsAll,
    updateOperationAct: updateOperation,
    updateMetaPeaksAct: updateMetaPeaks,
  }, dispatch)
);

LayerInit.propTypes = {
  entity: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  forecast: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  resetScanAllAct: PropTypes.func.isRequired,
  resetParamsAllAct: PropTypes.func.isRequired,
  updateOperationAct: PropTypes.func.isRequired,
  updateMetaPeaksAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(LayerInit));
