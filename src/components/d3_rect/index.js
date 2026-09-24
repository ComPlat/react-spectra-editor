/* eslint-disable no-mixed-operators */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  Topic2Seed, Feature2Peak, ToThresEndPts, ToShiftPeaks,
} from '../../helpers/chem';
import { resetAll } from '../../actions/manager';
import { selectUiSweep, scrollUiWheel, clickUiTarget } from '../../actions/ui';
import RectFocus from './rect_focus';
import ContainerSize from '../../helpers/container_size';
import {
  drawMain, drawLabel, drawDisplay, drawDestroy,
} from '../common/draw';
import { LIST_UI_SWEEP_TYPE, LIST_NON_BRUSH_TYPES } from '../../constants/list_ui';

// Fallback size, and the aspect used when the host leaves the height open - see
// ContainerSize.
const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

class ViewerRect extends React.Component {
  constructor(props) {
    super(props);

    this.rootKlass = '.d3Rect';
    this.containerRef = React.createRef();
    this.focus = this.createFocus({ width: W, height: H });

    this.normChange = this.normChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.size = new ContainerSize(
      () => this.containerRef.current,
      { width: W, height: H },
      this.handleResize,
    );
  }

  componentDidMount() {
    this.size.observe();
    this.mountChart(true);
  }

  componentDidUpdate(prevProps) {
    const {
      seed, peak,
      tTrEndPts, tSfPeaks, isHidden, decimalSt,
      sweepExtentSt, isUiAddIntgSt, isUiNoBrushSt,
    } = this.props;
    this.normChange(prevProps);
    this.handleResize();

    const filterSeed = seed;
    const filterPeak = peak;

    this.focus.update({
      filterSeed,
      filterPeak,
      tTrEndPts,
      tSfPeaks,
      decimal: decimalSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
    });
    drawDisplay(this.rootKlass, isHidden);
  }

  componentWillUnmount() {
    drawDestroy(this.rootKlass);
    this.size.disconnect();
  }

  handleResize() {
    if (this.size.hasChanged()) this.mountChart(false);
  }

  // The focus lays its scales out once, from the size it is built with: a new size needs a
  // new focus.
  createFocus(size) {
    const { clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct } = this.props;
    return new RectFocus({
      W: size.width, H: size.height, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    });
  }

  // Draws the chart from scratch at its container's size: on mount (resetting the feature's
  // edit state, as the first draw always has) and whenever the container is resized.
  mountChart(shouldReset) {
    const {
      seed, peak, cLabel, xLabel, yLabel, feature,
      tTrEndPts, tSfPeaks, isHidden, decimalSt,
      sweepExtentSt, isUiAddIntgSt, isUiNoBrushSt,
      resetAllAct,
    } = this.props;
    const width = this.size.measureWidth();
    drawDestroy(this.rootKlass);
    const size = this.size.target(width);
    if (shouldReset) resetAllAct(feature);

    this.focus = this.createFocus(size);
    drawMain(this.rootKlass, size.width, size.height);
    this.focus.create({
      filterSeed: seed,
      filterPeak: peak,
      tTrEndPts,
      tSfPeaks,
      decimal: decimalSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
    });
    drawLabel(this.rootKlass, cLabel, xLabel, yLabel);
    drawDisplay(this.rootKlass, isHidden);
  }

  normChange(prevProps) {
    const { feature, resetAllAct } = this.props;
    const oldFeature = prevProps.feature;
    if (oldFeature !== feature) {
      resetAllAct(feature);
    }
  }

  render() {
    return (
      <div className="d3Rect" ref={this.containerRef} />
    );
  }
}

const mapStateToProps = (state, props) => (
  {
    seed: Topic2Seed(state, props),
    peak: Feature2Peak(state, props),
    decimalSt: state.submit.decimal,
    tTrEndPts: ToThresEndPts(state, props),
    tSfPeaks: ToShiftPeaks(state, props),
    sweepExtentSt: state.ui.sweepExtent,
    isUiAddIntgSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
    isUiNoBrushSt: LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    resetAllAct: resetAll,
    clickUiTargetAct: clickUiTarget,
    selectUiSweepAct: selectUiSweep,
    scrollUiWheelAct: scrollUiWheel,
  }, dispatch)
);

ViewerRect.propTypes = {
  seed: PropTypes.array.isRequired,
  peak: PropTypes.array.isRequired,
  decimalSt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  feature: PropTypes.object.isRequired,
  tTrEndPts: PropTypes.array.isRequired,
  tSfPeaks: PropTypes.array.isRequired,
  sweepExtentSt: PropTypes.object.isRequired,
  isUiAddIntgSt: PropTypes.bool.isRequired,
  isUiNoBrushSt: PropTypes.bool.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  clickUiTargetAct: PropTypes.func.isRequired,
  selectUiSweepAct: PropTypes.func.isRequired,
  scrollUiWheelAct: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewerRect);
