"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _classnames = _interopRequireDefault(require("classnames"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _AddLocationOutlined = _interopRequireDefault(require("@mui/icons-material/AddLocationOutlined"));
var _ui = require("../../actions/ui");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _common = require("./common");
var _list_ui = require("../../constants/list_ui");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */

const styles = () => Object.assign({}, _common.commonStyle);
const Peak = _ref => {
  let {
    classes,
    setUiSweepTypeAct,
    isFocusAddPeakSt,
    disableAddPeakSt,
    isFocusRmPeakSt,
    disableRmPeakSt,
    isFocusSetRefSt,
    disableSetRefSt,
    isHandleMaxAndMinPeaksSt,
    cyclicVotaSt,
    curveSt
  } = _ref;
  let onSweepPeakAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.PEAK_ADD);
  let onSweepPeakDELETE = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.PEAK_DELETE);
  let onSweepAnchorShift = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT);
  if (isHandleMaxAndMinPeaksSt) {
    const {
      curveIdx
    } = curveSt;
    const {
      spectraList
    } = cyclicVotaSt;
    const spectra = spectraList[curveIdx];
    if (spectra) {
      const {
        isWorkMaxPeak
      } = spectra;
      if (isWorkMaxPeak) {
        onSweepPeakAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK, curveIdx);
        onSweepPeakDELETE = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK, curveIdx);
      } else {
        onSweepPeakAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK, curveIdx);
        onSweepPeakDELETE = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK, curveIdx);
      }
      onSweepAnchorShift = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF, curveIdx);
    }
  }
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.group
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Add Peak")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusAddPeakSt, classes), 'btn-sv-bar-addpeak'),
    disabled: disableAddPeakSt,
    onClick: onSweepPeakAdd
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-addpeak')
  }, "P+")))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Remove Peak")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusRmPeakSt, classes), 'btn-sv-bar-rmpeak'),
    disabled: disableRmPeakSt,
    onClick: onSweepPeakDELETE
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-rmpeak')
  }, "P-")))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Set Reference")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusSetRefSt, classes), 'btn-sv-bar-setref'),
    disabled: disableSetRefSt,
    onClick: onSweepAnchorShift
  }, /*#__PURE__*/_react.default.createElement(_AddLocationOutlined.default, {
    className: classes.icon
  })))));
};
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  isFocusAddPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_ADD || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK,
  disableAddPeakSt: _cfg.default.btnCmdAddPeak(state.layout),
  isFocusRmPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_DELETE || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK,
  disableRmPeakSt: _cfg.default.btnCmdRmPeak(state.layout),
  isFocusSetRefSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT,
  disableSetRefSt: _cfg.default.btnCmdSetRef(state.layout),
  isHandleMaxAndMinPeaksSt: !_cfg.default.hidePanelCyclicVolta(state.layout),
  cyclicVotaSt: state.cyclicvolta,
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiSweepTypeAct: _ui.setUiSweepType
}, dispatch);
Peak.propTypes = {
  classes: _propTypes.default.object.isRequired,
  isFocusAddPeakSt: _propTypes.default.bool.isRequired,
  disableAddPeakSt: _propTypes.default.bool.isRequired,
  isFocusRmPeakSt: _propTypes.default.bool.isRequired,
  disableRmPeakSt: _propTypes.default.bool.isRequired,
  isFocusSetRefSt: _propTypes.default.bool.isRequired,
  disableSetRefSt: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  isHandleMaxAndMinPeaksSt: _propTypes.default.bool.isRequired,
  cyclicVotaSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(Peak);