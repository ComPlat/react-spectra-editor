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
var _manager = require("../../actions/manager");
var _ui = require("../../actions/ui");
var _integration = require("../../actions/integration");
var _line_focus = _interopRequireDefault(require("./line_focus"));
var _container_size = _interopRequireDefault(require("../../helpers/container_size"));
var _draw = require("../common/draw");
var _list_ui = require("../../constants/list_ui");
var _list_graph = require("../../constants/list_graph");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _cyclic_voltammetry = require("../../actions/cyclic_voltammetry");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-mixed-operators */

// Fallback size, and the aspect used when the host leaves the height open - see
// ContainerSize.
const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

class ViewerLine extends _react.default.Component {
  constructor(props) {
    super(props);
    this.rootKlass = `.${_list_graph.LIST_ROOT_SVG_GRAPH.LINE}`;
    this.containerRef = /*#__PURE__*/_react.default.createRef();
    this.focus = this.createFocus({
      width: W,
      height: H
    });
    this.normChange = this.normChange.bind(this);
    this.syncFocusActions = this.syncFocusActions.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.size = new _container_size.default(() => this.containerRef.current, {
      width: W,
      height: H
    }, this.handleResize);
  }
  componentDidMount() {
    this.size.observe();
    this.mountChart(true);
  }
  componentDidUpdate(prevProps) {
    const {
      seed,
      peak,
      cLabel,
      xLabel,
      yLabel,
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
      isHidden,
      wavelength,
      axesUnitsSt,
      uiSt
    } = this.props;
    this.syncFocusActions();
    this.normChange(prevProps);
    this.handleResize();
    let xxLabel = xLabel;
    let yyLabel = yLabel;
    if (axesUnitsSt) {
      const {
        axes
      } = axesUnitsSt;
      const {
        xUnit,
        yUnit
      } = axes[0];
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
      uiSt
    });
    (0, _draw.drawLabel)(this.rootKlass, cLabel, xxLabel, yyLabel);
    (0, _draw.drawDisplay)(this.rootKlass, isHidden);
  }
  componentWillUnmount() {
    (0, _draw.drawDestroy)(this.rootKlass);
    this.size.disconnect();
  }
  handleResize() {
    if (this.size.hasChanged()) this.mountChart(false);
  }

  // The focus lays its scales out once, from the size it is built with: a new size needs a
  // new focus.
  createFocus(size) {
    const {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct
    } = this.props;
    return new _line_focus.default({
      W: size.width,
      H: size.height,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      splitIntegrationAct,
      addVisualSplitLineAct,
      removeVisualSplitLineAct
    });
  }

  // Draws the chart from scratch at its container's size: on mount (resetting the feature's
  // edit state, as the first draw always has) and whenever the container is resized.
  mountChart(shouldReset) {
    const {
      seed,
      peak,
      cLabel,
      xLabel,
      yLabel,
      feature,
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
      isHidden,
      wavelength,
      axesUnitsSt,
      resetAllAct,
      uiSt
    } = this.props;
    const width = this.size.measureWidth();
    (0, _draw.drawDestroy)(this.rootKlass);
    const size = this.size.target(width);
    if (shouldReset) resetAllAct(feature);
    this.focus = this.createFocus(size);
    this.syncFocusActions();
    let xxLabel = xLabel;
    let yyLabel = yLabel;
    if (axesUnitsSt) {
      const {
        axes
      } = axesUnitsSt;
      const {
        xUnit,
        yUnit
      } = axes[0];
      xxLabel = xUnit === '' ? xLabel : xUnit;
      yyLabel = yUnit === '' ? yLabel : yUnit;
    }
    (0, _draw.drawMain)(this.rootKlass, size.width, size.height);
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
      uiSt
    });
    (0, _draw.drawLabel)(this.rootKlass, cLabel, xxLabel, yyLabel);
    (0, _draw.drawDisplay)(this.rootKlass, isHidden);
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
  normChange(prevProps) {
    const {
      feature,
      resetAllAct
    } = this.props;
    const oldFeature = prevProps.feature;
    if (oldFeature !== feature) {
      resetAllAct(feature);
    }
  }
  render() {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: _list_graph.LIST_ROOT_SVG_GRAPH.LINE,
      ref: this.containerRef
    });
  }
}
const mapStateToProps = (state, props) => ({
  seed: (0, _chem.Topic2Seed)(state, props),
  peak: (0, _chem.Feature2Peak)(state, props),
  freq: (0, _chem.ToFrequency)(state, props),
  comparisons: (0, _chem.GetComparisons)(state, props),
  tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
  tSfPeaks: (0, _chem.ToShiftPeaks)(state, props),
  editPeakSt: state.editPeak.present,
  layoutSt: state.layout,
  integrationSt: state.integration.present,
  mtplySt: state.multiplicity.present,
  sweepExtentSt: state.ui.sweepExtent,
  isUiAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  isUiSplitIntgSt: _cfg.default.showIntegSplitTools(state.layout) && state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SPLIT,
  isUiVisualSplitIntgSt: _cfg.default.showIntegSplitTools(state.layout) && state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_VISUAL_SPLIT,
  isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
  wavelength: state.wavelength,
  axesUnitsSt: state.axesUnits,
  uiSt: state.ui
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
ViewerLine.propTypes = {
  seed: _propTypes.default.array.isRequired,
  peak: _propTypes.default.array.isRequired,
  freq: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.number]).isRequired,
  comparisons: _propTypes.default.array.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  cLabel: _propTypes.default.string.isRequired,
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
  isHidden: _propTypes.default.bool.isRequired,
  wavelength: _propTypes.default.object.isRequired,
  axesUnitsSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ViewerLine);