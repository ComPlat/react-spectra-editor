import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  Spectrum2Seed, Spectrum2Peak, ToThresEndPts, ToShiftPeaks,
} from '../helpers/chem';
import { updateBorder } from '../actions/border';
import { resetAll } from '../actions/manager';
import { clickPoint } from '../actions/edit_peak';
import D3Canvas from './d3_canvas';

class AppViewer extends React.Component {
  constructor(props) {
    super(props);

    const { clickPointAct } = props;
    this.canvas = new D3Canvas({ clickPointAct });
    this.d3Ref = React.createRef();

    this.normChange = this.normChange.bind(this);
  }

  componentDidMount() {
    const {
      seed, peak, cLabel, xLabel, yLabel, peakObj,
      borderSt, tTrEndPts, tSfPeaks, editPeakSt, editModeSt,
      updateBorderAct, resetAllAct,
    } = this.props;

    resetAllAct(peakObj);

    const { filterSeed, filterPeak } = this.brushFilter(borderSt, seed, peak);
    const node = this.d3Ref.current;
    this.chart = this.canvas.create(
      node,
      seed,
      peak,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      editModeSt,
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
      seed, peak, cLabel, xLabel, yLabel, borderSt, tTrEndPts, tSfPeaks,
      editPeakSt, editModeSt, isHidden,
    } = this.props;

    this.normChange(prevProps);

    const { filterSeed, filterPeak } = this.brushFilter(borderSt, seed, peak);
    const node = this.d3Ref.current;
    this.canvas.update(
      node,
      seed,
      peak,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      editModeSt,
      filterSeed,
      filterPeak,
      cLabel,
      xLabel,
      yLabel,
      isHidden,
    );
  }

  componentWillUnmount() {
    const node = this.d3Ref.current;
    this.canvas.destroy(node);
  }

  normChange(prevProps) {
    const { peakObj, resetAllAct } = this.props;
    const oldPeakObj = prevProps.peakObj;
    if (oldPeakObj !== peakObj) {
      resetAllAct(peakObj);
    }
  }

  brushFilter(border, seed, peak) {
    if (border.length === 0) {
      return { filterSeed: seed, filterPeak: peak };
    }
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
    tTrEndPts: ToThresEndPts(state, props),
    tSfPeaks: ToShiftPeaks(state, props),
    editPeakSt: state.editPeak,
    editModeSt: state.mode.edit,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateBorderAct: updateBorder,
    resetAllAct: resetAll,
    clickPointAct: clickPoint,
  }, dispatch)
);

AppViewer.propTypes = {
  seed: PropTypes.array.isRequired,
  peak: PropTypes.array.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObj: PropTypes.object.isRequired,
  borderSt: PropTypes.array.isRequired,
  tTrEndPts: PropTypes.array.isRequired,
  tSfPeaks: PropTypes.array.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  editModeSt: PropTypes.string.isRequired,
  updateBorderAct: PropTypes.func.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  clickPointAct: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppViewer);
