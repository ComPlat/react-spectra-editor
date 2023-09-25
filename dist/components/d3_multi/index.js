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
var _list_ui = require("../../constants/list_ui");
var _cyclic_voltammetry = require("../../actions/cyclic_voltammetry");
var _multi_focus = _interopRequireDefault(require("./multi_focus"));
var _draw = require("../common/draw");
/* eslint-disable no-mixed-operators, react/require-default-props,
react/no-unused-prop-types */

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

class ViewerMulti extends _react.default.Component {
  constructor(props) {
    super(props);
    const {
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
    } = this.props;
    this.rootKlass = '.d3Line';
    this.focus = new _multi_focus.default({
      W,
      H,
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
    });
    this.normChange = this.normChange.bind(this);
  }
  componentDidMount() {
    const {
      curveSt,
      seed,
      peak,
      cLabel,
      xLabel,
      yLabel,
      feature,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      sweepExtentSt,
      isUiNoBrushSt,
      isHidden,
      resetAllAct,
      cyclicvoltaSt,
      integationSt,
      mtplySt
    } = this.props;
    (0, _draw.drawDestroy)(this.rootKlass);
    resetAllAct(feature);
    const filterSeed = seed;
    const filterPeak = peak;
    (0, _draw.drawMain)(this.rootKlass, W, H);
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
      mtplySt
    });
    (0, _draw.drawLabel)(this.rootKlass, cLabel, xLabel, yLabel);
    (0, _draw.drawDisplay)(this.rootKlass, isHidden);
    (0, _draw.drawArrowOnCurve)(this.rootKlass, isHidden);
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
      isUiNoBrushSt,
      isHidden,
      cyclicvoltaSt,
      integationSt,
      mtplySt
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
      integationSt,
      mtplySt
    });
    (0, _draw.drawLabel)(this.rootKlass, cLabel, xLabel, yLabel);
    (0, _draw.drawDisplay)(this.rootKlass, isHidden);
    (0, _draw.drawArrowOnCurve)(this.rootKlass, isHidden);
  }
  componentWillUnmount() {
    (0, _draw.drawDestroy)(this.rootKlass);
  }
  normChange(prevProps) {
    const {
      feature,
      resetAllAct,
      entities
    } = this.props;
    const oldEntities = prevProps.entities;
    if (oldEntities !== entities) {
      resetAllAct(feature);
    }
  }
  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "d3Line"
    });
  }
}
const mapStateToProps = (state, props) => ({
  curveSt: state.curve,
  seed: (0, _chem.Topic2Seed)(state, props),
  peak: (0, _chem.Feature2Peak)(state, props),
  tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
  tSfPeaks: (0, _chem.ToShiftPeaks)(state, props),
  editPeakSt: state.editPeak.present,
  layoutSt: state.layout,
  sweepExtentSt: state.ui.sweepExtent,
  isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
  cyclicvoltaSt: state.cyclicvolta,
  maxminPeakSt: (0, _chem.Feature2MaxMinPeak)(state, props),
  integationSt: state.integration.present,
  mtplySt: state.multiplicity.present
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  resetAllAct: _manager.resetAll,
  clickUiTargetAct: _ui.clickUiTarget,
  selectUiSweepAct: _ui.selectUiSweep,
  scrollUiWheelAct: _ui.scrollUiWheel,
  addNewCylicVoltaPairPeakAct: _cyclic_voltammetry.addNewCylicVoltaPairPeak,
  addCylicVoltaMaxPeakAct: _cyclic_voltammetry.addCylicVoltaMaxPeak,
  addCylicVoltaMinPeakAct: _cyclic_voltammetry.addCylicVoltaMinPeak
}, dispatch);
ViewerMulti.propTypes = {
  curveSt: _propTypes.default.object.isRequired,
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
  integationSt: _propTypes.default.object.isRequired,
  mtplySt: _propTypes.default.object.isRequired,
  sweepExtentSt: _propTypes.default.object.isRequired,
  isUiNoBrushSt: _propTypes.default.bool.isRequired,
  resetAllAct: _propTypes.default.func.isRequired,
  clickUiTargetAct: _propTypes.default.func.isRequired,
  selectUiSweepAct: _propTypes.default.func.isRequired,
  scrollUiWheelAct: _propTypes.default.func.isRequired,
  isHidden: _propTypes.default.bool,
  cyclicvoltaSt: _propTypes.default.object.isRequired,
  maxminPeakSt: _propTypes.default.object,
  addNewCylicVoltaPairPeakAct: _propTypes.default.func.isRequired,
  addCylicVoltaMaxPeakAct: _propTypes.default.func.isRequired,
  addCylicVoltaMinPeakAct: _propTypes.default.func.isRequired,
  cLabel: _propTypes.default.string
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ViewerMulti);