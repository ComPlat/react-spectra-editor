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
import ContainerSize from '../../helpers/container_size';
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
// ContainerSize. 9/12 matches the `xs={9}` chart column of MultiJcampsViewer, the only
// host of this viewer.
const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
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
    this.syncFocusActions = this.syncFocusActions.bind(this);
    this.size = new ContainerSize(
      () => this.containerRef.current,
      { width: W, height: H },
      this.handleResize,
    );
  }

  componentDidMount() {
    this.size.observe();
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
    this.size.disconnect();
  }

  handleResize() {
    if (this.size.hasChanged()) this.mountChart(this.props, false);
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

    const width = this.size.measureWidth();
    drawDestroy(this.rootKlass);
    const size = this.size.target(width);

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
