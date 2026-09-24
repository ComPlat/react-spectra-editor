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
import ContainerSize from '../../helpers/container_size';
import {
  drawMain, drawLabel, drawDisplay, drawDestroy,
} from '../common/draw';
import { LIST_UI_SWEEP_TYPE, LIST_NON_BRUSH_TYPES } from '../../constants/list_ui';
import { LIST_ROOT_SVG_GRAPH } from '../../constants/list_graph';
import Cfg from '../../helpers/cfg';
import { addNewCylicVoltaPairPeak, addCylicVoltaMaxPeak, addCylicVoltaMinPeak } from '../../actions/cyclic_voltammetry';

// Fallback size, and the aspect used when the host leaves the height open - see
// ContainerSize.
const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

class ViewerLine extends React.Component {
  constructor(props) {
    super(props);

    this.rootKlass = `.${LIST_ROOT_SVG_GRAPH.LINE}`;
    this.containerRef = React.createRef();
    this.focus = this.createFocus({ width: W, height: H });

    this.normChange = this.normChange.bind(this);
    this.syncFocusActions = this.syncFocusActions.bind(this);
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
      seed, peak, cLabel, xLabel, yLabel, freq, comparisons,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt, integrationSt, mtplySt,
      sweepExtentSt, isUiAddIntgSt, isUiSplitIntgSt, isUiVisualSplitIntgSt, isUiNoBrushSt,
      isHidden, wavelength, axesUnitsSt, uiSt,
    } = this.props;
    this.syncFocusActions();
    this.normChange(prevProps);
    this.handleResize();

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
    this.size.disconnect();
  }

  handleResize() {
    if (this.size.hasChanged()) this.mountChart(false);
  }

  // The focus lays its scales out once, from the size it is built with: a new size needs a
  // new focus.
  createFocus(size) {
    const {
      clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct, splitIntegrationAct,
      addVisualSplitLineAct, removeVisualSplitLineAct,
    } = this.props;
    return new LineFocus({
      W: size.width,
      H: size.height,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct,
    });
  }

  // Draws the chart from scratch at its container's size: on mount (resetting the feature's
  // edit state, as the first draw always has) and whenever the container is resized.
  mountChart(shouldReset) {
    const {
      seed, peak, cLabel, xLabel, yLabel, feature, freq, comparisons,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt, integrationSt, mtplySt,
      sweepExtentSt, isUiAddIntgSt, isUiSplitIntgSt, isUiVisualSplitIntgSt, isUiNoBrushSt,
      isHidden, wavelength, axesUnitsSt,
      resetAllAct, uiSt,
    } = this.props;
    const width = this.size.measureWidth();
    drawDestroy(this.rootKlass);
    const size = this.size.target(width);
    if (shouldReset) resetAllAct(feature);

    this.focus = this.createFocus(size);
    this.syncFocusActions();

    let xxLabel = xLabel;
    let yyLabel = yLabel;

    if (axesUnitsSt) {
      const { axes } = axesUnitsSt;
      const { xUnit, yUnit } = axes[0];
      xxLabel = xUnit === '' ? xLabel : xUnit;
      yyLabel = yUnit === '' ? yLabel : yUnit;
    }

    drawMain(this.rootKlass, size.width, size.height);
    this.focus.create({
      filterSeed: seed,
      filterPeak: peak,
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
      <div className={LIST_ROOT_SVG_GRAPH.LINE} ref={this.containerRef} />
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
