import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';

import { updateOperation } from './actions/submit';
import { resetScanAll } from './actions/scan';
import LayerPrism from './layer_prism';

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
    const oldFeat = prevProps.entity.features[0];
    const { entity } = this.props;
    const newFeat = entity.features[0];

    if (oldFeat !== newFeat) {
      this.execReset();
    }
  }

  execReset() {
    const { entity, resetScanAllAct } = this.props;
    const baseFeat = entity.features[0];
    resetScanAllAct(baseFeat);
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
    updateOperationAct: updateOperation,
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
  updateOperationAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(LayerInit));
