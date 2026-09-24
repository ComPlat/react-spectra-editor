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
var _rect_focus = _interopRequireDefault(require("./rect_focus"));
var _container_size = _interopRequireDefault(require("../../helpers/container_size"));
var _draw = require("../common/draw");
var _list_ui = require("../../constants/list_ui");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-mixed-operators */

// Fallback size, and the aspect used when the host leaves the height open - see
// ContainerSize.
const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

class ViewerRect extends _react.default.Component {
  constructor(props) {
    super(props);
    this.rootKlass = '.d3Rect';
    this.containerRef = /*#__PURE__*/_react.default.createRef();
    this.focus = this.createFocus({
      width: W,
      height: H
    });
    this.normChange = this.normChange.bind(this);
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
      tTrEndPts,
      tSfPeaks,
      isHidden,
      decimalSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt
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
      isUiNoBrushSt
    });
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
      scrollUiWheelAct
    } = this.props;
    return new _rect_focus.default({
      W: size.width,
      H: size.height,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
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
      tTrEndPts,
      tSfPeaks,
      isHidden,
      decimalSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      resetAllAct
    } = this.props;
    const width = this.size.measureWidth();
    (0, _draw.drawDestroy)(this.rootKlass);
    const size = this.size.target(width);
    if (shouldReset) resetAllAct(feature);
    this.focus = this.createFocus(size);
    (0, _draw.drawMain)(this.rootKlass, size.width, size.height);
    this.focus.create({
      filterSeed: seed,
      filterPeak: peak,
      tTrEndPts,
      tSfPeaks,
      decimal: decimalSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt
    });
    (0, _draw.drawLabel)(this.rootKlass, cLabel, xLabel, yLabel);
    (0, _draw.drawDisplay)(this.rootKlass, isHidden);
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
      className: "d3Rect",
      ref: this.containerRef
    });
  }
}
const mapStateToProps = (state, props) => ({
  seed: (0, _chem.Topic2Seed)(state, props),
  peak: (0, _chem.Feature2Peak)(state, props),
  decimalSt: state.submit.decimal,
  tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
  tSfPeaks: (0, _chem.ToShiftPeaks)(state, props),
  sweepExtentSt: state.ui.sweepExtent,
  isUiAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  resetAllAct: _manager.resetAll,
  clickUiTargetAct: _ui.clickUiTarget,
  selectUiSweepAct: _ui.selectUiSweep,
  scrollUiWheelAct: _ui.scrollUiWheel
}, dispatch);
ViewerRect.propTypes = {
  seed: _propTypes.default.array.isRequired,
  peak: _propTypes.default.array.isRequired,
  decimalSt: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  cLabel: _propTypes.default.string.isRequired,
  xLabel: _propTypes.default.string.isRequired,
  yLabel: _propTypes.default.string.isRequired,
  feature: _propTypes.default.object.isRequired,
  tTrEndPts: _propTypes.default.array.isRequired,
  tSfPeaks: _propTypes.default.array.isRequired,
  sweepExtentSt: _propTypes.default.object.isRequired,
  isUiAddIntgSt: _propTypes.default.bool.isRequired,
  isUiNoBrushSt: _propTypes.default.bool.isRequired,
  resetAllAct: _propTypes.default.func.isRequired,
  clickUiTargetAct: _propTypes.default.func.isRequired,
  selectUiSweepAct: _propTypes.default.func.isRequired,
  scrollUiWheelAct: _propTypes.default.func.isRequired,
  isHidden: _propTypes.default.bool.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ViewerRect);