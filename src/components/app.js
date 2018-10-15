import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { Spectrum2Seed, Spectrum2Peak } from '../helpers/chem';
import { updateBorder, resetBorder } from '../actions/border';
import D3Canvas from './d3_canvas';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.canvas = new D3Canvas();
    this.d3Ref = React.createRef();

    this.seSeedChange = this.seSeedChange.bind(this);
  }

  componentDidMount() {
    const {
      seed, peak, cLabel, xLabel, yLabel, borderSt, updateBorderAct,
    } = this.props;

    const { filterSeed, filterPeak } = this.brushFilter(borderSt, seed, peak);
    const node = this.d3Ref.current;
    this.chart = this.canvas.create(
      node,
      seed,
      peak,
      filterSeed,
      filterPeak,
      cLabel,
      xLabel,
      yLabel,
      updateBorderAct,
    );
  }

  componentDidUpdate(prevProps) {
    const {
      seed, peak, cLabel, xLabel, yLabel, borderSt,
    } = this.props;

    this.seSeedChange(prevProps);

    const { filterSeed, filterPeak } = this.brushFilter(borderSt, seed, peak);
    const node = this.d3Ref.current;
    this.canvas.update(
      node,
      seed,
      peak,
      filterSeed,
      filterPeak,
      cLabel,
      xLabel,
      yLabel,
    );
  }

  componentWillUnmount() {
    const node = this.d3Ref.current;
    this.canvas.destroy(node);
  }

  seSeedChange(prevProps) {
    const { seed, resetBorderAct } = this.props;
    const oldSeed = prevProps.seed;
    if (oldSeed !== seed) {
      resetBorderAct();
    }
  }

  brushFilter(border, seed, peak) {
    const xL = border[0];
    const xU = border[1];
    let fltSeed = [...seed];
    if (xL && xU) {
      fltSeed = fltSeed.filter(
        d => xL <= d.x && d.x <= xU,
      );
    }
    let fltPeak = [...peak];
    if (xL && xU) {
      fltPeak = fltPeak.filter(
        d => xL <= d.x && d.x <= xU,
      );
    }
    return { filterSeed: fltSeed, filterPeak: fltPeak };
  }

  render() {
    return (
      <div
        className="d3-container"
        ref={this.d3Ref}
      />
    );
  }
}

const mapStateToProps = (state, props) => (
  {
    borderSt: state.border,
    seed: Spectrum2Seed(state, props),
    peak: Spectrum2Peak(state, props),
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateBorderAct: updateBorder,
    resetBorderAct: resetBorder,
  }, dispatch)
);

App.propTypes = {
  input: PropTypes.object.isRequired,
  seed: PropTypes.array.isRequired,
  peak: PropTypes.array.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObj: PropTypes.object.isRequired,
  borderSt: PropTypes.array.isRequired,
  updateBorderAct: PropTypes.func.isRequired,
  resetBorderAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
