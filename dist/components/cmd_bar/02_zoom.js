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
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, react/function-component-definition */

const styles = () => Object.assign({}, _common.commonStyle);
const Zoom = _ref => {
  let {
    classes,
    isfocusZoomSt,
    setUiSweepTypeAct
  } = _ref;
  const onSweepZoomIn = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN);
  const onSweepZoomReset = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.group,
    "data-testid": "Zoom",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Zoom In"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isfocusZoomSt, classes), 'btn-sv-bar-zoomin'),
          onClick: onSweepZoomIn,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ZoomInOutlined.default, {
            className: (0, _classnames.default)(classes.icon, classes.iconWp)
          })
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Reset Zoom"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)('btn-sv-bar-zoomreset'),
          onClick: onSweepZoomReset,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_FindReplaceOutlined.default, {
            className: classes.icon
          })
        })
      })
    })]
  });
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