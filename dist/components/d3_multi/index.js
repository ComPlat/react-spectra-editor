"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _chem = require("../../helpers/chem");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _manager = require("../../actions/manager");
var _ui = require("../../actions/ui");
var _integration = require("../../actions/integration");
var _list_ui = require("../../constants/list_ui");
var _list_graph = require("../../constants/list_graph");
var _cyclic_voltammetry = require("../../actions/cyclic_voltammetry");
var _multi_focus = _interopRequireDefault(require("./multi_focus"));
var _draw = require("../common/draw");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-mixed-operators, react/require-default-props,
react/no-unused-prop-types */

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

const buildResetPayload = (feature, curveSt) => ({
  ...feature,
  curveIdx: curveSt.curveIdx
});
const hasActiveZoom = sweepExtentSt => {
  if (!sweepExtentSt) return false;
  return !!(sweepExtentSt.xExtent || sweepExtentSt.yExtent);
};
const canSkipReset = (sweepExtentSt, layoutSt, feature) => hasActiveZoom(sweepExtentSt) && layoutSt === feature?.operation?.layout;
const isSameMultiComparison = (oldEntities, newEntities) => Array.isArray(oldEntities) && Array.isArray(newEntities) && oldEntities.length > 0 && oldEntities.length === newEntities.length;
class ViewerMulti extends _react.default.Component {
  constructor(props) {
    super(props);
    const {
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct
    } = this.props;
    this.rootKlass = `.${_list_graph.LIST_ROOT_SVG_GRAPH.LINE}`;
    this.containerRef = /*#__PURE__*/_react.default.createRef();
    this.currentSize = null;
    this.resizeObserver = null;
    this.focus = new _multi_focus.default({
      W,
      H,
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct
    });
    this.normChange = this.normChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.syncFocusActions = this.syncFocusActions.bind(this);
  }
  componentDidMount() {
    this.setupResizeObserver();
    this.mountChart(this.props, true);
  }
  componentDidUpdate(prevProps) {
    const {
      entities,
      curveSt,
      seed,
      peak,
      cLabel,
      xLabel,
      yLabel,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiSplitIntgSt,
      isUiVisualSplitIntgSt,
      isUiNoBrushSt,
      isHidden,
      cyclicvoltaSt,
      shiftSt,
      integrationSt,
      mtplySt,
      axesUnitsSt,
      uiSt
    } = this.props;
    this.syncFocusActions();
    this.normChange(prevProps);
    if (_format.default.isCyclicVoltaLayout(layoutSt)) {
      this.handleResize();
    }
    const hasRelevantChange = prevProps.entities !== entities || prevProps.curveSt !== curveSt || prevProps.seed !== seed || prevProps.peak !== peak || prevProps.tTrEndPts !== tTrEndPts || prevProps.tSfPeaks !== tSfPeaks || prevProps.editPeakSt !== editPeakSt || prevProps.layoutSt !== layoutSt || prevProps.sweepExtentSt !== sweepExtentSt || prevProps.isUiNoBrushSt !== isUiNoBrushSt || prevProps.isHidden !== isHidden || prevProps.cyclicvoltaSt !== cyclicvoltaSt || prevProps.integrationSt !== integrationSt || prevProps.mtplySt !== mtplySt || prevProps.axesUnitsSt !== axesUnitsSt || prevProps.uiSt !== uiSt || prevProps.cLabel !== cLabel || prevProps.xLabel !== xLabel || prevProps.yLabel !== yLabel;
    if (!hasRelevantChange) return;
    const {
      xxLabel,
      yyLabel
    } = this.resolveAxisLabels(this.props);
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
      shiftSt,
      integrationSt,
      mtplySt,
      uiSt
    });
    (0, _draw.drawLabel)(this.rootKlass, cLabel, xxLabel, yyLabel);
    (0, _draw.drawDisplay)(this.rootKlass, isHidden);
    (0, _draw.drawArrowOnCurve)(this.rootKlass, isHidden || !_format.default.isAIFLayout(layoutSt));
  }
  componentWillUnmount() {
    (0, _draw.drawDestroy)(this.rootKlass);
    this.teardownResizeObserver();
  }
  handleResize() {
    const {
      layoutSt
    } = this.props;
    if (!_format.default.isCyclicVoltaLayout(layoutSt)) return;
    const size = this.getContainerSize();
    if (!size) return;
    if (!this.currentSize || size.width !== this.currentSize.width || size.height !== this.currentSize.height) {
      this.mountChart(this.props, false);
    }
  }
  getContainerSize() {
    const node = this.containerRef.current;
    if (!node) return null;
    const {
      clientWidth,
      clientHeight
    } = node;
    if (!clientWidth || !clientHeight) return null;
    return {
      width: clientWidth,
      height: clientHeight
    };
  }
  getTargetSize(layoutSt) {
    if (_format.default.isCyclicVoltaLayout(layoutSt)) {
      const size = this.getContainerSize();
      if (size) return size;
    }
    return {
      width: W,
      height: H
    };
  }
  setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    if (!this.containerRef.current || this.resizeObserver) return;
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.containerRef.current);
  }
  syncFocusActions() {
    if (!this.focus) return;
    const {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct
    } = this.props;
    Object.assign(this.focus, {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct
    });
  }
  teardownResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
  resolveAxisLabels(props) {
    const {
      curveSt,
      xLabel,
      yLabel,
      axesUnitsSt,
      cyclicvoltaSt
    } = props;
    let xxLabel = xLabel;
    let yyLabel = yLabel;
    if (axesUnitsSt) {
      const {
        curveIdx
      } = curveSt;
      const {
        axes
      } = axesUnitsSt;
      const selectedAxes = axes[curveIdx] || {
        xUnit: '',
        yUnit: ''
      };
      const {
        xUnit,
        yUnit
      } = selectedAxes;
      xxLabel = xUnit === '' ? xLabel : xUnit;
      yyLabel = yUnit === '' ? yLabel : yUnit;
    }
    if (cyclicvoltaSt && cyclicvoltaSt.useCurrentDensity) {
      const areaUnit = cyclicvoltaSt.areaUnit || 'cm²';
      const baseUnit = /mA/i.test(String(yyLabel)) ? 'mA' : 'A';
      yyLabel = `Current density in ${baseUnit}/${areaUnit}`;
    }
    return {
      xxLabel,
      yyLabel
    };
  }
  normChange(prevProps) {
    const {
      feature,
      resetAllAct,
      entities,
      curveSt
    } = this.props;
    const oldEntities = prevProps.entities;
    if (oldEntities !== entities && !isSameMultiComparison(oldEntities, entities)) {
      resetAllAct(buildResetPayload(feature, curveSt));
    }
  }
  createMultiFocus(size, props) {
    const {
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct
    } = props;
    return new _multi_focus.default({
      W: size.width,
      H: size.height,
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct
    });
  }
  mountChart(props, shouldReset = false) {
    const {
      curveSt,
      seed,
      peak,
      cLabel,
      feature,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiSplitIntgSt,
      isUiVisualSplitIntgSt,
      isUiNoBrushSt,
      isHidden,
      resetAllAct,
      cyclicvoltaSt,
      shiftSt,
      integrationSt,
      mtplySt,
      uiSt
    } = props;
    const size = this.getTargetSize(layoutSt);
    this.currentSize = size;
    (0, _draw.drawDestroy)(this.rootKlass);
    if (shouldReset && !canSkipReset(sweepExtentSt, layoutSt, feature)) {
      resetAllAct(buildResetPayload(feature, curveSt));
    }
    const {
      xxLabel,
      yyLabel
    } = this.resolveAxisLabels(props);
    this.focus = this.createMultiFocus(size, props);
    this.syncFocusActions();
    (0, _draw.drawMain)(this.rootKlass, size.width, size.height);
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
      shiftSt,
      integrationSt,
      mtplySt,
      uiSt
    });
    (0, _draw.drawLabel)(this.rootKlass, cLabel, xxLabel, yyLabel);
    (0, _draw.drawDisplay)(this.rootKlass, isHidden);
    (0, _draw.drawArrowOnCurve)(this.rootKlass, isHidden || !_format.default.isAIFLayout(layoutSt));
  }
  render() {
    const {
      layoutSt
    } = this.props;
    const isCyclicVolta = _format.default.isCyclicVoltaLayout(layoutSt);
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: _list_graph.LIST_ROOT_SVG_GRAPH.LINE,
      ref: this.containerRef,
      style: isCyclicVolta ? {
        height: '100%'
      } : undefined
    });
  }
}
const mapStateToProps = (state, props) => ({
  curveSt: state.curve,
  uiSt: state.ui,
  seed: (0, _chem.Topic2Seed)(state, props),
  peak: (0, _chem.Feature2Peak)(state, props),
  tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
  tSfPeaks: (0, _chem.ToShiftPeaks)(state, props),
  editPeakSt: state.editPeak.present,
  layoutSt: state.layout,
  sweepExtentSt: state.ui.sweepExtent,
  isUiAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  isUiSplitIntgSt: _cfg.default.showIntegSplitTools(state.layout) && state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SPLIT,
  isUiVisualSplitIntgSt: _cfg.default.showIntegSplitTools(state.layout) && state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_VISUAL_SPLIT,
  isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
  cyclicvoltaSt: state.cyclicvolta,
  shiftSt: state.shift,
  maxminPeakSt: (0, _chem.Feature2MaxMinPeak)(state, props),
  integrationSt: state.integration.present,
  mtplySt: state.multiplicity.present,
  axesUnitsSt: state.axesUnits
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  resetAllAct: _manager.resetAll,
  clickUiTargetAct: _ui.clickUiTarget,
  selectUiSweepAct: _ui.selectUiSweep,
  scrollUiWheelAct: _ui.scrollUiWheel,
  splitIntegrationAct: _integration.splitIntegration,
  addVisualSplitLineAct: _integration.addVisualSplitLine,
  removeVisualSplitLineAct: _integration.removeVisualSplitLine,
  addNewCylicVoltaPairPeakAct: _cyclic_voltammetry.addNewCylicVoltaPairPeak,
  addCylicVoltaMaxPeakAct: _cyclic_voltammetry.addCylicVoltaMaxPeak,
  addCylicVoltaMinPeakAct: _cyclic_voltammetry.addCylicVoltaMinPeak
}, dispatch);
ViewerMulti.propTypes = {
  curveSt: _propTypes.default.object.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  entities: _propTypes.default.array.isRequired,
  seed: _propTypes.default.array.isRequired,
  peak: _propTypes.default.array.isRequired,
  xLabel: _propTypes.default.string.isRequired,
  yLabel: _propTypes.default.string.isRequired,
  feature: _propTypes.default.object.isRequired,
  tTrEndPts: _propTypes.default.array.isRequired,
  tSfPeaks: _propTypes.default.array.isRequired,
  editPeakSt: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  integrationSt: _propTypes.default.object.isRequired,
  mtplySt: _propTypes.default.object.isRequired,
  sweepExtentSt: _propTypes.default.object.isRequired,
  isUiAddIntgSt: _propTypes.default.bool.isRequired,
  isUiSplitIntgSt: _propTypes.default.bool.isRequired,
  isUiVisualSplitIntgSt: _propTypes.default.bool.isRequired,
  isUiNoBrushSt: _propTypes.default.bool.isRequired,
  resetAllAct: _propTypes.default.func.isRequired,
  clickUiTargetAct: _propTypes.default.func.isRequired,
  selectUiSweepAct: _propTypes.default.func.isRequired,
  scrollUiWheelAct: _propTypes.default.func.isRequired,
  splitIntegrationAct: _propTypes.default.func.isRequired,
  addVisualSplitLineAct: _propTypes.default.func.isRequired,
  removeVisualSplitLineAct: _propTypes.default.func.isRequired,
  isHidden: _propTypes.default.bool,
  cyclicvoltaSt: _propTypes.default.object.isRequired,
  shiftSt: _propTypes.default.object.isRequired,
  maxminPeakSt: _propTypes.default.object,
  addNewCylicVoltaPairPeakAct: _propTypes.default.func.isRequired,
  addCylicVoltaMaxPeakAct: _propTypes.default.func.isRequired,
  addCylicVoltaMinPeakAct: _propTypes.default.func.isRequired,
  cLabel: _propTypes.default.string,
  axesUnitsSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ViewerMulti);