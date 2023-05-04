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
var _styles = require("@material-ui/core/styles");
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _ui = require("../../actions/ui");
var _common = require("./common");
var _list_ui = require("../../constants/list_ui");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */

const styles = () => Object.assign({}, _common.commonStyle);
const Pecker = _ref => {
  let {
    classes,
    layoutSt,
    isFocusAddPeckerSt,
    isFocusRmPeckerSt,
    setUiSweepTypeAct,
    jcampIdx
  } = _ref;
  const onSweepPeckerAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER, jcampIdx);
  const onSweepPeckerDELETE = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER, jcampIdx);
  return !_cfg.default.hidePanelCyclicVolta(layoutSt) ? /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Add Pecker")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusAddPeckerSt, classes), 'btn-sv-bar-addpeak'),
    onClick: onSweepPeckerAdd
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-addpeak')
  }, "Pe+")))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Remove Pecker")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusRmPeckerSt, classes), 'btn-sv-bar-rmpeak'),
    onClick: onSweepPeckerDELETE
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-rmpeak')
  }, "Pe-"))))) : /*#__PURE__*/_react.default.createElement("span", null);
};
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  isFocusAddPeckerSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER,
  isFocusRmPeckerSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER,
  cyclicVotaSt: state.cyclicvolta
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiSweepTypeAct: _ui.setUiSweepType
}, dispatch);
Pecker.propTypes = {
  classes: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  isFocusAddPeckerSt: _propTypes.default.bool.isRequired,
  isFocusRmPeckerSt: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  cyclicVotaSt: _propTypes.default.object.isRequired,
  jcampIdx: _propTypes.default.any
};
var _default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Pecker);
exports.default = _default;