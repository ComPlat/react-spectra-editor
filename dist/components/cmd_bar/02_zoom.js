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
var _ZoomInOutlined = _interopRequireDefault(require("@mui/icons-material/ZoomInOutlined"));
var _FindReplaceOutlined = _interopRequireDefault(require("@mui/icons-material/FindReplaceOutlined"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _ui = require("../../actions/ui");
var _common = require("./common");
var _list_ui = require("../../constants/list_ui");
/* eslint-disable prefer-object-spread, react/function-component-definition */

const styles = () => Object.assign({}, _common.commonStyle);
const Zoom = ({
  classes,
  isfocusZoomSt,
  setUiSweepTypeAct
}) => {
  const onSweepZoomIn = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN);
  const onSweepZoomReset = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET);
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.group,
    "data-testid": "Zoom"
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Zoom In")
  }, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isfocusZoomSt, classes), 'btn-sv-bar-zoomin'),
    onClick: onSweepZoomIn
  }, /*#__PURE__*/_react.default.createElement(_ZoomInOutlined.default, {
    className: (0, _classnames.default)(classes.icon, classes.iconWp)
  }))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Reset Zoom")
  }, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)('btn-sv-bar-zoomreset'),
    onClick: onSweepZoomReset
  }, /*#__PURE__*/_react.default.createElement(_FindReplaceOutlined.default, {
    className: classes.icon
  }))));
};
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  isfocusZoomSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiSweepTypeAct: _ui.setUiSweepType
}, dispatch);
Zoom.propTypes = {
  classes: _propTypes.default.object.isRequired,
  isfocusZoomSt: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(Zoom);