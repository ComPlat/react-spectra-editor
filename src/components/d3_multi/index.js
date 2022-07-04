import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  Topic2Seed, Feature2Peak, ToThresEndPts, ToShiftPeaks,
  Feature2MaxMinPeak
} from '../../helpers/chem';
import { resetAll } from '../../actions/manager';
import { selectUiSweep, scrollUiWheel, clickUiTarget } from '../../actions/ui';
import { LIST_NON_BRUSH_TYPES } from '../../constants/list_ui';
import { addNewCylicVoltaPairPeak, addCylicVoltaMaxPeak, addCylicVoltaMinPeak } from '../../actions/cyclic_voltammetry';

import MultiFocus from './multi_focus';

import {
  drawMain, drawLabel, drawDisplay, drawDestroy,
} from '../common/draw';

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI



class ViewerMulti extends React.Component {
  constructor(props) {
    super(props);

    const { entities, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct } = this.props;
    this.rootKlass = ".d3Line";

    this.focus = new MultiFocus({
      W, H, entities, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    });

    this.normChange = this.normChange.bind(this);
  }

  componentDidMount() {
    const {
      curveSt,
      seed, peak, cLabel, xLabel, yLabel, feature,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt,
      sweepExtentSt, isUiNoBrushSt,
      isHidden,resetAllAct, cyclicvoltaSt
    } = this.props;

    drawDestroy(this.rootKlass);
    resetAllAct(feature);

    const filterSeed = seed;
    const filterPeak = peak;

    drawMain(this.rootKlass, W, H);
    this.focus.create({
      curveSt,
      filterSeed,
      filterPeak,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      sweepExtentSt,
      isUiNoBrushSt,
      cyclicvoltaSt,
    });
    drawLabel(this.rootKlass, cLabel, xLabel, yLabel);
    drawDisplay(this.rootKlass, isHidden);
  }

  componentDidUpdate(prevProps) {
    const {
      entities, curveSt,
      seed, peak, cLabel, xLabel, yLabel,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt,
      sweepExtentSt, isUiNoBrushSt,
      isHidden, cyclicvoltaSt,
    } = this.props;
    this.normChange(prevProps);

    const filterSeed = seed;
    const filterPeak = peak;

    this.focus.update({
      entities,
      curveSt,
      filterSeed,
      filterPeak,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      sweepExtentSt,
      isUiNoBrushSt,
      cyclicvoltaSt,
    });
    drawLabel(this.rootKlass, cLabel, xLabel, yLabel);
    drawDisplay(this.rootKlass, isHidden);
  }

  componentWillUnmount() {
    drawDestroy(this.rootKlass);
  }

  normChange(prevProps) {
    const { feature, resetAllAct, entities } = this.props;
    const oldEntities = prevProps.entities;
    if (oldEntities !== entities) {
      resetAllAct(feature);
    }
  }

  render() {
    return (
      <div className="d3Line" />
    )
  }
}

const mapStateToProps = (state, props) => (
  {
    curveSt: state.curve,
    seed: Topic2Seed(state, props),
    peak: Feature2Peak(state, props),
    tTrEndPts: ToThresEndPts(state, props),
    tSfPeaks: ToShiftPeaks(state, props),
    editPeakSt: state.editPeak.present,
    layoutSt: state.layout,
    sweepExtentSt: state.ui.sweepExtent,
    isUiNoBrushSt: LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
    cyclicvoltaSt: state.cyclicvolta,
    maxminPeakSt: Feature2MaxMinPeak(state, props),
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    resetAllAct: resetAll,
    clickUiTargetAct: clickUiTarget,
    selectUiSweepAct: selectUiSweep,
    scrollUiWheelAct: scrollUiWheel,
    addNewCylicVoltaPairPeakAct: addNewCylicVoltaPairPeak,
    addCylicVoltaMaxPeakAct: addCylicVoltaMaxPeak,
    addCylicVoltaMinPeakAct: addCylicVoltaMinPeak,
  }, dispatch)
);


ViewerMulti.propTypes = {
  curveSt: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  seed: PropTypes.array.isRequired,
  peak: PropTypes.array.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  feature: PropTypes.object.isRequired,
  tTrEndPts: PropTypes.array.isRequired,
  tSfPeaks: PropTypes.array.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  sweepExtentSt: PropTypes.object.isRequired,
  isUiNoBrushSt: PropTypes.bool.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  clickUiTargetAct: PropTypes.func.isRequired,
  selectUiSweepAct: PropTypes.func.isRequired,
  scrollUiWheelAct: PropTypes.func.isRequired,
  isHidden: PropTypes.bool,
  cyclicvoltaSt: PropTypes.object.isRequired,
  maxminPeakSt: PropTypes.object,
  addNewCylicVoltaPairPeakAct: PropTypes.func.isRequired,
  addCylicVoltaMaxPeakAct: PropTypes.func.isRequired,
  addCylicVoltaMinPeakAct: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewerMulti);