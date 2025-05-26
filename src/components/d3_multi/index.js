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
import { resetAll } from '../../actions/manager';
import { selectUiSweep, scrollUiWheel, clickUiTarget } from '../../actions/ui';
import { LIST_NON_BRUSH_TYPES } from '../../constants/list_ui';
import { addNewCylicVoltaPairPeak, addCylicVoltaMaxPeak, addCylicVoltaMinPeak } from '../../actions/cyclic_voltammetry';

import MultiFocus from './multi_focus';

import {
  drawMain, drawLabel, drawDisplay, drawDestroy, drawArrowOnCurve,
} from '../common/draw';

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

class ViewerMulti extends React.Component {
  constructor(props) {
    super(props);

    const {
      entities, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    } = this.props;
    this.rootKlass = '.d3Line';
    this.containerRef = React.createRef();
    this.currentSize = null;
    this.resizeObserver = null;

    this.focus = new MultiFocus({
      W, H, entities, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    });

    this.normChange = this.normChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.renderChart(this.props, true);
    this.setupResizeObserver();
    const {
      curveSt,
      seed, peak, cLabel, xLabel, yLabel, feature,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt,
      sweepExtentSt, isUiNoBrushSt,
      isHidden, resetAllAct, cyclicvoltaSt,
      integationSt, mtplySt, axesUnitsSt, uiSt,
    } = this.props;

    drawDestroy(this.rootKlass);
    resetAllAct(feature);

    let xxLabel = xLabel;
    let yyLabel = yLabel;

    if (axesUnitsSt) {
      const { curveIdx } = curveSt;
      const { axes } = axesUnitsSt;
      let selectedAxes = axes[curveIdx];
      if (!selectedAxes) {
        selectedAxes = { xUnit: '', yUnit: '' };
      }
      const { xUnit, yUnit } = selectedAxes;
      xxLabel = xUnit === '' ? xLabel : xUnit;
      yyLabel = yUnit === '' ? yLabel : yUnit;
    }

    if (cyclicvoltaSt && cyclicvoltaSt.useCurrentDensity) {
      const areaUnit = cyclicvoltaSt.areaUnit || 'cm²';
      const baseUnit = /mA/i.test(String(yyLabel)) ? 'mA' : 'A';
      yyLabel = `Current density in ${baseUnit}/${areaUnit}`;
    }

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
      integationSt,
      mtplySt,
      uiSt,
    });
    drawLabel(this.rootKlass, cLabel, xxLabel, yyLabel);
    drawDisplay(this.rootKlass, isHidden);
    drawArrowOnCurve(this.rootKlass, isHidden);
  }

  componentDidUpdate(prevProps) {
    const {
      entities, curveSt,
      seed, peak, cLabel, xLabel, yLabel,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt,
      sweepExtentSt, isUiNoBrushSt,
      isHidden, cyclicvoltaSt,
      integationSt, mtplySt, axesUnitsSt,
      uiSt,
    } = this.props;
    this.normChange(prevProps);

    let xxLabel = xLabel;
    let yyLabel = yLabel;

    if (axesUnitsSt) {
      const { curveIdx } = curveSt;
      const { axes } = axesUnitsSt;
      let selectedAxes = axes[curveIdx];
      if (!selectedAxes) {
        selectedAxes = { xUnit: '', yUnit: '' };
      }
      const { xUnit, yUnit } = selectedAxes;
      xxLabel = xUnit === '' ? xLabel : xUnit;
      yyLabel = yUnit === '' ? yLabel : yUnit;
    }
    if (cyclicvoltaSt && cyclicvoltaSt.useCurrentDensity) {
      const areaUnit = cyclicvoltaSt.areaUnit || 'cm²';
      const baseUnit = /mA/i.test(String(yyLabel)) ? 'mA' : 'A';
      yyLabel = `Current density in ${baseUnit}/${areaUnit}`;
    }

    const filterSeed = seed;
    const filterPeak = peak;

    if (Format.isCyclicVoltaLayout(layoutSt)) {
      this.handleResize();
    }

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
      integationSt,
      mtplySt,
      uiSt,
    });
    drawLabel(this.rootKlass, cLabel, xxLabel, yyLabel);
    drawDisplay(this.rootKlass, isHidden);
    drawArrowOnCurve(this.rootKlass, isHidden);
  }

  componentWillUnmount() {
    drawDestroy(this.rootKlass);
    this.teardownResizeObserver();
  }

  handleResize() {
    const { layoutSt } = this.props;
    if (!Format.isCyclicVoltaLayout(layoutSt)) return;
    const size = this.getContainerSize();
    if (!size) return;
    if (!this.currentSize
      || size.width !== this.currentSize.width
      || size.height !== this.currentSize.height) {
      this.renderChart(this.props, false);
    }
  }

  getContainerSize() {
    const node = this.containerRef.current;
    if (!node) return null;
    const { clientWidth, clientHeight } = node;
    if (!clientWidth || !clientHeight) return null;
    return { width: clientWidth, height: clientHeight };
  }

  getTargetSize(layoutSt) {
    if (Format.isCyclicVoltaLayout(layoutSt)) {
      const size = this.getContainerSize();
      if (size) return size;
    }
    return { width: W, height: H };
  }

  setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    if (!this.containerRef.current || this.resizeObserver) return;
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.containerRef.current);
  }

  teardownResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  normChange(prevProps) {
    const { feature, resetAllAct, entities } = this.props;
    const oldEntities = prevProps.entities;
    if (oldEntities !== entities) {
      resetAllAct(feature);
    }
  }

  renderChart(props, shouldReset) {
    const {
      curveSt,
      seed, peak, cLabel, xLabel, yLabel, feature,
      tTrEndPts, tSfPeaks, editPeakSt, layoutSt,
      sweepExtentSt, isUiNoBrushSt,
      isHidden, resetAllAct, cyclicvoltaSt,
      integationSt, mtplySt, axesUnitsSt,
      entities, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    } = props;

    const size = this.getTargetSize(layoutSt);
    this.currentSize = size;

    drawDestroy(this.rootKlass);
    if (shouldReset) {
      resetAllAct(feature);
    }

    let xxLabel = xLabel;
    let yyLabel = yLabel;

    if (axesUnitsSt) {
      const { curveIdx } = curveSt;
      const { axes } = axesUnitsSt;
      let selectedAxes = axes[curveIdx];
      if (!selectedAxes) {
        selectedAxes = { xUnit: '', yUnit: '' };
      }
      const { xUnit, yUnit } = selectedAxes;
      xxLabel = xUnit === '' ? xLabel : xUnit;
      yyLabel = yUnit === '' ? yLabel : yUnit;
    }

    const filterSeed = seed;
    const filterPeak = peak;

    this.focus = new MultiFocus({
      W: size.width,
      H: size.height,
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
    });

    drawMain(this.rootKlass, size.width, size.height);
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
      integationSt,
      mtplySt,
    });
    drawLabel(this.rootKlass, cLabel, xxLabel, yyLabel);
    drawDisplay(this.rootKlass, isHidden);
    drawArrowOnCurve(this.rootKlass, isHidden);
  }

  render() {
    const { layoutSt } = this.props;
    const isCyclicVolta = Format.isCyclicVoltaLayout(layoutSt);
    return (
      <div
        className="d3Line"
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
    isUiNoBrushSt: LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
    cyclicvoltaSt: state.cyclicvolta,
    maxminPeakSt: Feature2MaxMinPeak(state, props),
    integationSt: state.integration.present,
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
  integationSt: PropTypes.object.isRequired,
  mtplySt: PropTypes.object.isRequired,
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
  cLabel: PropTypes.string,
  axesUnitsSt: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewerMulti);
