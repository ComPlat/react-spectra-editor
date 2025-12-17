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
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, react/function-component-definition */

const styles = () => Object.assign({}, _common.commonStyle);
const Viewer = ({
  classes,
  isfocusSpectrumSt,
  isfocusAnalysisSt,
  hideCmdAnaViewerSt,
  disableCmdAnaViewerSt,
  setUiViewerTypeAct
}) => {
  const onViewSpectrum = () => setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.SPECTRUM);
  const onViewAnalysis = () => setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.group,
    "data-testid": "Viewer",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Spectrum Viewer"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
        className: (0, _classnames.default)((0, _common.focusStyle)(isfocusSpectrumSt, classes), 'btn-sv-bar-spctrum'),
        onClick: onViewSpectrum,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_TimelineOutlined.default, {
          className: classes.icon
        })
      })
    }), hideCmdAnaViewerSt ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Analysis Viewer"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
        className: (0, _classnames.default)((0, _common.focusStyle)(isfocusAnalysisSt, classes), 'btn-sv-bar-analysis'),
        disabled: disableCmdAnaViewerSt,
        onClick: onViewAnalysis,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SpellcheckOutlined.default, {
          className: classes.icon
        })
      })
    })]
  });
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