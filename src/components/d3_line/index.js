/* eslint-disable no-mixed-operators */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  Topic2Seed, Feature2Peak, ToThresEndPts, ToShiftPeaks, ToFrequency,
  GetComparisons,
} from '../../helpers/chem';
import { resetAll } from '../../actions/manager';
import { selectUiSweep, scrollUiWheel, clickUiTarget } from '../../actions/ui';
import {
  addVisualSplitLine, removeVisualSplitLine, splitIntegration,
} from '../../actions/integration';
import LineFocus from './line_focus';
import {
  drawMain, drawLabel, drawDisplay, drawDestroy,
} from '../common/draw';
import { LIST_UI_SWEEP_TYPE, LIST_NON_BRUSH_TYPES } from '../../constants/list_ui';
import { LIST_ROOT_SVG_GRAPH } from '../../constants/list_graph';
import Cfg from '../../helpers/cfg';
import { addNewCylicVoltaPairPeak, addCylicVoltaMaxPeak, addCylicVoltaMinPeak } from '../../actions/cyclic_voltammetry';

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

class ViewerLine extends React.Component {
  constructor(props) {
    super(props);

    const {
      clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct, splitIntegrationAct,
      addVisualSplitLineAct, removeVisualSplitLineAct,
    } = props;
    this.rootKlass = `.${LIST_ROOT_SVG_GRAPH.LINE}`;
    this.focus = new LineFocus({
      W,
      H,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct,
    });

    this.normChange = this.normChange.bind(this);
    this.syncFocusActions = this.syncFocusActions.bind(this);
  }

  componentDidMount() {
    const {
      seed, peak, cLabel, xLabel, yLabel, feature, freq, comparisons,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt, integrationSt, mtplySt,
      sweepExtentSt, isUiAddIntgSt, isUiSplitIntgSt, isUiVisualSplitIntgSt, isUiNoBrushSt,
      isHidden, wavelength, axesUnitsSt,
      resetAllAct, uiSt,
    } = this.props;
    this.syncFocusActions();
    drawDestroy(this.rootKlass);
    resetAllAct(feature);

    let xxLabel = xLabel;
    let yyLabel = yLabel;

    if (axesUnitsSt) {
      const { axes } = axesUnitsSt;
      const { xUnit, yUnit } = axes[0];
      xxLabel = xUnit === '' ? xLabel : xUnit;
      yyLabel = yUnit === '' ? yLabel : yUnit;
    }

    const filterSeed = seed;
    const filterPeak = peak;

    drawMain(this.rootKlass, W, H);
    this.focus.create({
      filterSeed,
      filterPeak,
      freq,
      comparisons,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      integrationSt,
      mtplySt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiSplitIntgSt,
      isUiVisualSplitIntgSt,
      isUiNoBrushSt,
      wavelength,
      uiSt,
    });
    drawLabel(this.rootKlass, cLabel, xxLabel, yyLabel);
    drawDisplay(this.rootKlass, isHidden);
  }

  componentDidUpdate(prevProps) {
    const {
      seed, peak, cLabel, xLabel, yLabel, freq, comparisons,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt, integrationSt, mtplySt,
      sweepExtentSt, isUiAddIntgSt, isUiSplitIntgSt, isUiVisualSplitIntgSt, isUiNoBrushSt,
      isHidden, wavelength, axesUnitsSt, uiSt,
    } = this.props;
    this.syncFocusActions();
    this.normChange(prevProps);

    let xxLabel = xLabel;
    let yyLabel = yLabel;

    if (axesUnitsSt) {
      const { axes } = axesUnitsSt;
      const { xUnit, yUnit } = axes[0];
      xxLabel = xUnit === '' ? xLabel : xUnit;
      yyLabel = yUnit === '' ? yLabel : yUnit;
    }

    const filterSeed = seed;
    const filterPeak = peak;

    this.focus.update({
      filterSeed,
      filterPeak,
      freq,
      comparisons,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      integrationSt,
      mtplySt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiSplitIntgSt,
      isUiVisualSplitIntgSt,
      isUiNoBrushSt,
      wavelength,
      uiSt,
    });
    drawLabel(this.rootKlass, cLabel, xxLabel, yyLabel);
    drawDisplay(this.rootKlass, isHidden);
  }

  componentWillUnmount() {
    drawDestroy(this.rootKlass);
  }

  syncFocusActions() {
    if (!this.focus) return;
    const {
      clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
      splitIntegrationAct, addVisualSplitLineAct, removeVisualSplitLineAct,
    } = this.props;
    Object.assign(this.focus, {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct,
    });
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
      <div className={LIST_ROOT_SVG_GRAPH.LINE} />
    );
  }
}

const mapStateToProps = (state, props) => (
  {
    seed: Topic2Seed(state, props),
    peak: Feature2Peak(state, props),
    freq: ToFrequency(state, props),
    comparisons: GetComparisons(state, props),
    tTrEndPts: ToThresEndPts(state, props),
    tSfPeaks: ToShiftPeaks(state, props),
    editPeakSt: state.editPeak.present,
    layoutSt: state.layout,
    integrationSt: state.integration.present,
    mtplySt: state.multiplicity.present,
    sweepExtentSt: state.ui.sweepExtent,
    isUiAddIntgSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
    isUiSplitIntgSt: Cfg.showIntegSplitTools(state.layout)
      && state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_SPLIT,
    isUiVisualSplitIntgSt: Cfg.showIntegSplitTools(state.layout)
      && state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_VISUAL_SPLIT,
    isUiNoBrushSt: LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
    wavelength: state.wavelength,
    axesUnitsSt: state.axesUnits,
    uiSt: state.ui,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    resetAllAct: resetAll,
    clickUiTargetAct: clickUiTarget,
    selectUiSweepAct: selectUiSweep,
    scrollUiWheelAct: scrollUiWheel,
    splitIntegrationAct: splitIntegration,
    addVisualSplitLineAct: addVisualSplitLine,
    removeVisualSplitLineAct: removeVisualSplitLine,
    addNewCylicVoltaPairPeakAct: addNewCylicVoltaPairPeak,
    addCylicVoltaMaxPeakAct: addCylicVoltaMaxPeak,
    addCylicVoltaMinPeakAct: addCylicVoltaMinPeak,
  }, dispatch)
);

ViewerLine.propTypes = {
  seed: PropTypes.array.isRequired,
  peak: PropTypes.array.isRequired,
  freq: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  comparisons: PropTypes.array.isRequired,
  uiSt: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  feature: PropTypes.object.isRequired,
  tTrEndPts: PropTypes.array.isRequired,
  tSfPeaks: PropTypes.array.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  integrationSt: PropTypes.object.isRequired,
  mtplySt: PropTypes.object.isRequired,
  sweepExtentSt: PropTypes.object.isRequired,
  isUiAddIntgSt: PropTypes.bool.isRequired,
  isUiSplitIntgSt: PropTypes.bool.isRequired,
  isUiVisualSplitIntgSt: PropTypes.bool.isRequired,
  isUiNoBrushSt: PropTypes.bool.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  clickUiTargetAct: PropTypes.func.isRequired,
  selectUiSweepAct: PropTypes.func.isRequired,
  scrollUiWheelAct: PropTypes.func.isRequired,
  splitIntegrationAct: PropTypes.func.isRequired,
  addVisualSplitLineAct: PropTypes.func.isRequired,
  removeVisualSplitLineAct: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
  wavelength: PropTypes.object.isRequired,
  axesUnitsSt: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewerLine);
