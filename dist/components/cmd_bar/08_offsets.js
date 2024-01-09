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
var _offset = require("../../actions/offset");
var _ui = require("../../actions/ui");
var _list_ui = require("../../constants/list_ui");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _tri_btn = _interopRequireDefault(require("./tri_btn"));
var _common = require("./common");
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/function-component-definition, react/no-unused-prop-types, */

const styles = () => ({
  field: {
    width: 80
  },
  txtIcon: {},
  ..._common.commonStyle
});
const Offset = _ref => {
  let {
    classes,
    isDisableSt,
    isFocusAddOffsetSt,
    isFocusRmOffsetSt,
    setUiSweepTypeAct,
    clearOffsetAllAct,
    curveSt,
    // eslint-disable-next-line no-unused-vars
    offsetSt
  } = _ref;
  const onSweepOffsetAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.OFFSET_ADD);
  const onSweepOffsetRm = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.OFFSET_RM);
  const {
    curveIdx
  } = curveSt;
  const onClearAll = () => clearOffsetAllAct({
    curveIdx
  });
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.group
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Add On- and Offsets")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusAddOffsetSt, classes)),
    disabled: isDisableSt,
    onClick: onSweepOffsetAdd
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-addpeak')
  }, "O+")))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Remove On- and Offsets")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusRmOffsetSt, classes)),
    disabled: isDisableSt,
    onClick: onSweepOffsetRm
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-addpeak')
  }, "O-")))), /*#__PURE__*/_react.default.createElement(_tri_btn.default, {
    content: {
      tp: 'Clear All On/offsets'
    },
    cb: onClearAll
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-addpeak')
  }, "OX")));
};
const mapStateToProps = state => ({
  isDisableSt: _cfg.default.btnCmdOffset(state.layout),
  isFocusAddOffsetSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.OFFSET_ADD,
  isFocusRmOffsetSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.OFFSET_RM,
  curveSt: state.curve,
  offsetSt: state.offset.present
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiSweepTypeAct: _ui.setUiSweepType,
  clearOffsetAllAct: _offset.clearOffsetAll
}, dispatch);
Offset.propTypes = {
  classes: _propTypes.default.object.isRequired,
  isDisableSt: _propTypes.default.bool.isRequired,
  isFocusAddOffsetSt: _propTypes.default.bool.isRequired,
  isFocusRmOffsetSt: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  clearOffsetAllAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  offsetSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(Offset));