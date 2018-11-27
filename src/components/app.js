import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { Spectrum2Seed, Spectrum2Peak, ToThresEndPts } from '../helpers/chem';
import { updateBorder } from '../actions/border';
import { resetAll } from '../actions/manager';
import { addToPosList, addToNegList } from '../actions/edit_peak';
import D3Canvas from './d3_canvas';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { addToPosListAct, addToNegListAct } = props;
    this.canvas = new D3Canvas({ addToPosListAct, addToNegListAct });
    this.d3Ref = React.createRef();

    this.seSeedChange = this.seSeedChange.bind(this);
  }

  componentDidMount() {
    const {
      seed, peak, cLabel, xLabel, yLabel,
      borderSt, tEndPts, editPeakSt, updateBorderAct, resetAllAct,
    } = this.props;

    resetAllAct();

    const { filterSeed, filterPeak } = this.brushFilter(borderSt, seed, peak);
    const node = this.d3Ref.current;
    this.chart = this.canvas.create(
      node,
      seed,
      peak,
      tEndPts,
      editPeakSt,
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
      seed, peak, cLabel, xLabel, yLabel, borderSt, tEndPts, editPeakSt,
    } = this.props;

    this.seSeedChange(prevProps);

    const { filterSeed, filterPeak } = this.brushFilter(borderSt, seed, peak);
    const node = this.d3Ref.current;
    this.canvas.update(
      node,
      seed,
      peak,
      tEndPts,
      editPeakSt,
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
    const { seed, resetAllAct } = this.props;
    const oldSeed = prevProps.seed;
    if (oldSeed !== seed) {
      resetAllAct();
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
    if (peak && xL && xU) {
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
    tEndPts: ToThresEndPts(state, props),
    editPeakSt: state.editPeak,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateBorderAct: updateBorder,
    resetAllAct: resetAll,
    addToPosListAct: addToPosList,
    addToNegListAct: addToNegList,
  }, dispatch)
);

App.propTypes = {
  seed: PropTypes.array.isRequired,
  peak: PropTypes.array.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  borderSt: PropTypes.array.isRequired,
  tEndPts: PropTypes.array.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  updateBorderAct: PropTypes.func.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  addToPosListAct: PropTypes.func.isRequired,
  addToNegListAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
