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
import {
  drawMain, drawLabel, drawDisplay, drawDestroy,
} from '../common/draw';

const W = Math.round(window.innerWidth * 0.90 * 9 / 12);
const H = Math.round(window.innerHeight * 0.66); // 71vh @ panel/index.js

class ViewerRect extends React.Component {
  constructor(props) {
    super(props);

    const { clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct } = props;
    this.rootKlass = '.d3Rect';
    this.focus = new RectFocus({
      W, H, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    });

    this.normChange = this.normChange.bind(this);
  }

  componentDidMount() {
    const {
      seed, peak, cLabel, xLabel, yLabel, feature,
      tTrEndPts, tSfPeaks, uiSt, isHidden,
      resetAllAct,
    } = this.props;
    drawDestroy(this.rootKlass);
    resetAllAct(feature);

    const filterSeed = seed;
    const filterPeak = peak;

    drawMain(this.rootKlass, W, H);
    this.focus.create({
      filterSeed,
      filterPeak,
      tTrEndPts,
      tSfPeaks,
      uiSt,
    });
    drawLabel(this.rootKlass, cLabel, xLabel, yLabel);
    drawDisplay(this.rootKlass, isHidden);
  }

  componentDidUpdate(prevProps) {
    const {
      seed, peak,
      tTrEndPts, tSfPeaks, uiSt, isHidden,
    } = this.props;
    this.normChange(prevProps);

    const filterSeed = seed;
    const filterPeak = peak;

    this.focus.update({
      filterSeed,
      filterPeak,
      tTrEndPts,
      tSfPeaks,
      uiSt,
    });
    drawDisplay(this.rootKlass, isHidden);
  }

  componentWillUnmount() {
    drawDestroy(this.rootKlass);
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
      <div className="d3Rect" />
    );
  }
}

const mapStateToProps = (state, props) => (
  {
    seed: Topic2Seed(state, props),
    peak: Feature2Peak(state, props),
    tTrEndPts: ToThresEndPts(state, props),
    tSfPeaks: ToShiftPeaks(state, props),
    uiSt: state.ui,
  }
);

const mapDispatchToProps = dispatch => (
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
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  feature: PropTypes.object.isRequired,
  tTrEndPts: PropTypes.array.isRequired,
  tSfPeaks: PropTypes.array.isRequired,
  uiSt: PropTypes.object.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  clickUiTargetAct: PropTypes.func.isRequired,
  selectUiSweepAct: PropTypes.func.isRequired,
  scrollUiWheelAct: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewerRect);
