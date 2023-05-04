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
var _line_focus = _interopRequireDefault(require("./line_focus"));
var _draw = require("../common/draw");
var _list_ui = require("../../constants/list_ui");
var _cyclic_voltammetry = require("../../actions/cyclic_voltammetry");
/* eslint-disable no-mixed-operators */

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

class ViewerLine extends _react.default.Component {
  constructor(props) {
    super(props);
    const {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
    } = props;
    this.rootKlass = '.d3Line';
    this.focus = new _line_focus.default({
      W,
      H,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
    });
    this.normChange = this.normChange.bind(this);
  }
  componentDidMount() {
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
      integationSt,
      mtplySt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      isHidden,
      wavelength,
      resetAllAct
    } = this.props;
    (0, _draw.drawDestroy)(this.rootKlass);
    resetAllAct(feature);
    const filterSeed = seed;
    const filterPeak = peak;
    (0, _draw.drawMain)(this.rootKlass, W, H);
    this.focus.create({
      filterSeed,
      filterPeak,
      freq,
      comparisons,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      layoutSt,
      integationSt,
      mtplySt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      wavelength
    });
    (0, _draw.drawLabel)(this.rootKlass, cLabel, xLabel, yLabel);
    (0, _draw.drawDisplay)(this.rootKlass, isHidden);
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
      integationSt,
      mtplySt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      isHidden,
      wavelength
    } = this.props;
    this.normChange(prevProps);
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
      integationSt,
      mtplySt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      wavelength
    });
    (0, _draw.drawLabel)(this.rootKlass, cLabel, xLabel, yLabel);
    (0, _draw.drawDisplay)(this.rootKlass, isHidden);
  }
  componentWillUnmount() {
    (0, _draw.drawDestroy)(this.rootKlass);
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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "d3Line"
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
  integationSt: state.integration.present,
  mtplySt: state.multiplicity.present,
  sweepExtentSt: state.ui.sweepExtent,
  isUiAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
  wavelength: state.wavelength
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
ViewerLine.propTypes = {
  seed: _propTypes.default.array.isRequired,
  peak: _propTypes.default.array.isRequired,
  freq: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.number]).isRequired,
  comparisons: _propTypes.default.array.isRequired,
  cLabel: _propTypes.default.string.isRequired,
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
  isUiAddIntgSt: _propTypes.default.bool.isRequired,
  isUiNoBrushSt: _propTypes.default.bool.isRequired,
  resetAllAct: _propTypes.default.func.isRequired,
  clickUiTargetAct: _propTypes.default.func.isRequired,
  selectUiSweepAct: _propTypes.default.func.isRequired,
  scrollUiWheelAct: _propTypes.default.func.isRequired,
  isHidden: _propTypes.default.bool.isRequired,
  wavelength: _propTypes.default.object.isRequired
};
var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ViewerLine);
exports.default = _default;