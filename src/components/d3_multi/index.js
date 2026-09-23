/* eslint-disable no-mixed-operators, react/require-default-props,
react/no-unused-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  Topic2Seed, Feature2Peak, ToThresEndPts, ToShiftPeaks,
  Feature2MaxMinPeak,
} from '../../helpers/chem';
import Format from '../../helpers/format';
import Cfg from '../../helpers/cfg';
import { resetAll } from '../../actions/manager';
import { selectUiSweep, scrollUiWheel, clickUiTarget } from '../../actions/ui';
import {
  addVisualSplitLine, removeVisualSplitLine, splitIntegration,
} from '../../actions/integration';
import { LIST_UI_SWEEP_TYPE, LIST_NON_BRUSH_TYPES } from '../../constants/list_ui';
import { LIST_ROOT_SVG_GRAPH } from '../../constants/list_graph';
import { addNewCylicVoltaPairPeak, addCylicVoltaMaxPeak, addCylicVoltaMinPeak } from '../../actions/cyclic_voltammetry';

import MultiFocus from './multi_focus';

import {
  drawMain, drawLabel, drawDisplay, drawDestroy, drawArrowOnCurve,
} from '../common/draw';

// Fallback size, and the aspect used when the host leaves the height open - see
// getTargetSize. 8/12 matches the `xs={8}` chart column of MultiJcampsViewer, the only
// host of this viewer.
const W = Math.round(window.innerWidth * 0.90 * 8 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

class ViewerMulti extends React.Component {
  constructor(props) {
    super(props);

    const {
      entities, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct, splitIntegrationAct,
      addVisualSplitLineAct, removeVisualSplitLineAct,
    } = this.props;
    this.rootKlass = `.${LIST_ROOT_SVG_GRAPH.LINE}`;
    this.containerRef = React.createRef();
    this.currentSize = null;
    this.resizeObserver = null;

    this.focus = new MultiFocus({
      W,
      H,
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct,
    });

    this.normChange = this.normChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.scheduleResize = this.scheduleResize.bind(this);
    this.syncFocusActions = this.syncFocusActions.bind(this);
  }

  componentDidMount() {
    this.setupResizeObserver();
    this.mountChart(this.props, true);
  }

  componentDidUpdate(prevProps) {
    const {
      entities, curveSt,
      seed, peak, cLabel, xLabel, yLabel,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt,
      sweepExtentSt, isUiAddIntgSt, isUiSplitIntgSt, isUiVisualSplitIntgSt, isUiNoBrushSt,
      isHidden, cyclicvoltaSt,
      integrationSt, mtplySt, axesUnitsSt,
      uiSt,
    } = this.props;
    this.syncFocusActions();
    this.normChange(prevProps);

    this.handleResize();
    const hasRelevantChange = prevProps.entities !== entities
      || prevProps.curveSt !== curveSt
      || prevProps.seed !== seed
      || prevProps.peak !== peak
      || prevProps.tTrEndPts !== tTrEndPts
      || prevProps.tSfPeaks !== tSfPeaks
      || prevProps.editPeakSt !== editPeakSt
      || prevProps.layoutSt !== layoutSt
      || prevProps.sweepExtentSt !== sweepExtentSt
      || prevProps.isUiNoBrushSt !== isUiNoBrushSt
      || prevProps.isHidden !== isHidden
      || prevProps.cyclicvoltaSt !== cyclicvoltaSt
      || prevProps.integrationSt !== integrationSt
      || prevProps.mtplySt !== mtplySt
      || prevProps.axesUnitsSt !== axesUnitsSt
      || prevProps.uiSt !== uiSt
      || prevProps.cLabel !== cLabel
      || prevProps.xLabel !== xLabel
      || prevProps.yLabel !== yLabel;
    if (!hasRelevantChange) return;

    const { xxLabel, yyLabel } = this.resolveAxisLabels(this.props);

    this.focus.update({
      entities,
      curveSt,
      filterSeed: seed,
      filterPeak: peak,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiSplitIntgSt,
      isUiVisualSplitIntgSt,
      isUiNoBrushSt,
      cyclicvoltaSt,
      integrationSt,
      mtplySt,
      uiSt,
    });
    drawLabel(this.rootKlass, cLabel, xxLabel, yyLabel);
    drawDisplay(this.rootKlass, isHidden);
    drawArrowOnCurve(this.rootKlass, isHidden || !Format.isAIFLayout(layoutSt));
  }

  componentWillUnmount() {
    drawDestroy(this.rootKlass);
    this.teardownResizeObserver();
  }

  handleResize() {
    const node = this.containerRef.current;
    if (!node || !this.currentSize) return;
    const { clientWidth, clientHeight } = node;
    if (!clientWidth) return;
    // An unbounded container's height is the chart's own, so it is not an input.
    if (clientWidth !== this.currentSize.width
      || (this.isHeightBounded && clientHeight !== this.currentSize.height)) {
      this.mountChart(this.props, false);
    }
  }

  // Draw at the container's size so the viewBox matches the box the svg is laid out in:
  // with `xMinYMin meet` the chart then fills its pane and never distorts. `width` is
  // taken before the chart is removed (a page scrollbar can come and go with it); the
  // height after. A container that keeps a height while empty is bounded by its host
  // (the ELN pane, the CV column) and that height is used. One that collapses takes its
  // height from the chart, so measuring it would feed back - the old svg plus its inline
  // baseline gap - and grow a few px on every resize without end; derive it from the
  // width instead.
  getTargetSize(width) {
    const node = this.containerRef.current;
    const boundedHeight = node ? node.clientHeight : 0;
    this.isHeightBounded = boundedHeight > 0;
    if (!width) return { width: W, height: H };
    return {
      width,
      height: this.isHeightBounded ? boundedHeight : Math.round((width * H) / W),
    };
  }

  setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    if (!this.containerRef.current || this.resizeObserver) return;
    this.resizeObserver = new ResizeObserver(this.scheduleResize);
    this.resizeObserver.observe(this.containerRef.current);
  }

  // A bounded container's size does not depend on the chart, so redraw at once, before
  // the next paint. An unbounded one does: remounting inside the observer callback resizes
  // what it observes in the same frame, which the browser reports as a "ResizeObserver
  // loop" error - wait for the next frame instead.
  scheduleResize() {
    if (this.isHeightBounded) {
      this.handleResize();
      return;
    }
    if (this.resizeFrame) return;
    this.resizeFrame = window.requestAnimationFrame(() => {
      this.resizeFrame = null;
      this.handleResize();
    });
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

  teardownResizeObserver() {
    if (this.resizeFrame) {
      window.cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  resolveAxisLabels(props) {
    const {
      curveSt, xLabel, yLabel, axesUnitsSt, cyclicvoltaSt,
    } = props;
    let xxLabel = xLabel;
    let yyLabel = yLabel;

    if (axesUnitsSt) {
      const { curveIdx } = curveSt;
      const { axes } = axesUnitsSt;
      const selectedAxes = axes[curveIdx] || { xUnit: '', yUnit: '' };
      const { xUnit, yUnit } = selectedAxes;
      xxLabel = xUnit === '' ? xLabel : xUnit;
      yyLabel = yUnit === '' ? yLabel : yUnit;
    }

    if (cyclicvoltaSt && cyclicvoltaSt.useCurrentDensity) {
      const areaUnit = cyclicvoltaSt.areaUnit || 'cm²';
      const baseUnit = /mA/i.test(String(yyLabel)) ? 'mA' : 'A';
      yyLabel = `Current density in ${baseUnit}/${areaUnit}`;
    }
    return { xxLabel, yyLabel };
  }

  normChange(prevProps) {
    const { feature, resetAllAct, entities } = this.props;
    const oldEntities = prevProps.entities;
    if (oldEntities !== entities) {
      resetAllAct(feature);
    }
  }

  createMultiFocus(size, props) {
    const {
      entities, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
      splitIntegrationAct, addVisualSplitLineAct, removeVisualSplitLineAct,
    } = props;
    return new MultiFocus({
      W: size.width,
      H: size.height,
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct,
    });
  }

  mountChart(props, shouldReset = false) {
    const {
      curveSt,
      seed, peak, cLabel, feature,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt,
      sweepExtentSt, isUiAddIntgSt, isUiSplitIntgSt, isUiVisualSplitIntgSt, isUiNoBrushSt,
      isHidden, resetAllAct, cyclicvoltaSt,
      integrationSt, mtplySt, uiSt,
    } = props;

    const node = this.containerRef.current;
    const width = node ? node.clientWidth : 0;
    drawDestroy(this.rootKlass);
    const size = this.getTargetSize(width);
    this.currentSize = size;

    if (shouldReset) {
      resetAllAct(feature);
    }

    const { xxLabel, yyLabel } = this.resolveAxisLabels(props);

    this.focus = this.createMultiFocus(size, props);
    this.syncFocusActions();

    drawMain(this.rootKlass, size.width, size.height);
    this.focus.create({
      curveSt,
      filterSeed: seed,
      filterPeak: peak,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiSplitIntgSt,
      isUiVisualSplitIntgSt,
      isUiNoBrushSt,
      cyclicvoltaSt,
      integrationSt,
      mtplySt,
      uiSt,
    });
    drawLabel(this.rootKlass, cLabel, xxLabel, yyLabel);
    drawDisplay(this.rootKlass, isHidden);
    drawArrowOnCurve(this.rootKlass, isHidden || !Format.isAIFLayout(layoutSt));
  }

  render() {
    const { layoutSt } = this.props;
    const isCyclicVolta = Format.isCyclicVoltaLayout(layoutSt);
    return (
      <div
        className={LIST_ROOT_SVG_GRAPH.LINE}
        ref={this.containerRef}
        style={isCyclicVolta ? { height: '100%' } : undefined}
      />
    );
  }
}

const mapStateToProps = (state, props) => (
  {
    curveSt: state.curve,
    uiSt: state.ui,
    seed: Topic2Seed(state, props),
    peak: Feature2Peak(state, props),
    tTrEndPts: ToThresEndPts(state, props),
    tSfPeaks: ToShiftPeaks(state, props),
    editPeakSt: state.editPeak.present,
    layoutSt: state.layout,
    sweepExtentSt: state.ui.sweepExtent,
    isUiAddIntgSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
    isUiSplitIntgSt: Cfg.showIntegSplitTools(state.layout)
      && state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_SPLIT,
    isUiVisualSplitIntgSt: Cfg.showIntegSplitTools(state.layout)
      && state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_VISUAL_SPLIT,
    isUiNoBrushSt: LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
    cyclicvoltaSt: state.cyclicvolta,
    maxminPeakSt: Feature2MaxMinPeak(state, props),
    integrationSt: state.integration.present,
    mtplySt: state.multiplicity.present,
    axesUnitsSt: state.axesUnits,
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

ViewerMulti.propTypes = {
  curveSt: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
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
  isHidden: PropTypes.bool,
  cyclicvoltaSt: PropTypes.object.isRequired,
  maxminPeakSt: PropTypes.object,
  addNewCylicVoltaPairPeakAct: PropTypes.func.isRequired,
  addCylicVoltaMaxPeakAct: PropTypes.func.isRequired,
  addCylicVoltaMinPeakAct: PropTypes.func.isRequired,
  cLabel: PropTypes.string,
  axesUnitsSt: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewerMulti);
