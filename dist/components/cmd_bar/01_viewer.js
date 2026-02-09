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
var _SpellcheckOutlined = _interopRequireDefault(require("@mui/icons-material/SpellcheckOutlined"));
var _TimelineOutlined = _interopRequireDefault(require("@mui/icons-material/TimelineOutlined"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _ui = require("../../actions/ui");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _common = require("./common");
var _list_ui = require("../../constants/list_ui");
/* eslint-disable prefer-object-spread, react/function-component-definition */

const styles = () => Object.assign({}, _common.commonStyle);
const Viewer = _ref => {
  let {
    classes,
    isfocusSpectrumSt,
    isfocusAnalysisSt,
    hideCmdAnaViewerSt,
    disableCmdAnaViewerSt,
    setUiViewerTypeAct
  } = _ref;
  const onViewSpectrum = () => setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.SPECTRUM);
  const onViewAnalysis = () => setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS);
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.group,
    "data-testid": "Viewer"
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Spectrum Viewer")
  }, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isfocusSpectrumSt, classes), 'btn-sv-bar-spctrum'),
    onClick: onViewSpectrum
  }, /*#__PURE__*/_react.default.createElement(_TimelineOutlined.default, {
    className: classes.icon
  }))), hideCmdAnaViewerSt ? null : /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Analysis Viewer")
  }, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isfocusAnalysisSt, classes), 'btn-sv-bar-analysis'),
    disabled: disableCmdAnaViewerSt,
    onClick: onViewAnalysis
  }, /*#__PURE__*/_react.default.createElement(_SpellcheckOutlined.default, {
    className: classes.icon
  }))));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  isfocusSpectrumSt: state.ui.viewer === _list_ui.LIST_UI_VIEWER_TYPE.SPECTRUM,
  isfocusAnalysisSt: state.ui.viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS,
  hideCmdAnaViewerSt: _cfg.default.hideCmdAnaViewer(state.layout) || props.editorOnly,
  disableCmdAnaViewerSt: _cfg.default.btnCmdAnaViewer(state.layout)
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiViewerTypeAct: _ui.setUiViewerType
}, dispatch);
Viewer.propTypes = {
  classes: _propTypes.default.object.isRequired,
  isfocusSpectrumSt: _propTypes.default.bool.isRequired,
  isfocusAnalysisSt: _propTypes.default.bool.isRequired,
  hideCmdAnaViewerSt: _propTypes.default.bool.isRequired,
  disableCmdAnaViewerSt: _propTypes.default.bool.isRequired,
  setUiViewerTypeAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(Viewer);