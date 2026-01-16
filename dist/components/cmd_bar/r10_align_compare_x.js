"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _SwapHorizOutlined = _interopRequireDefault(require("@mui/icons-material/SwapHorizOutlined"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _ui = require("../../actions/ui");
var _common = require("./common");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, react/function-component-definition */

const styles = () => Object.assign({}, _common.commonStyle);
const AlignCompareX = ({
  classes,
  alignCompareXSt,
  isMultiSpectraSt,
  setUiAlignCompareXAct,
  compact
}) => {
  if (!isMultiSpectraSt) return null;
  const onToggle = () => setUiAlignCompareXAct(!alignCompareXSt);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: compact ? undefined : classes.group,
    "data-testid": "AlignCompareX",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Align X (compare)"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
        className: (0, _classnames.default)((0, _common.focusStyle)(alignCompareXSt, classes), 'btn-sv-bar-align-compare-x'),
        onClick: onToggle,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SwapHorizOutlined.default, {
          className: classes.icon
        })
      })
    })
  });
};
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  alignCompareXSt: state.ui.alignCompareX,
  isMultiSpectraSt: (state.curve.listCurves || []).length > 1
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiAlignCompareXAct: _ui.setUiAlignCompareX
}, dispatch);
AlignCompareX.propTypes = {
  classes: _propTypes.default.object.isRequired,
  alignCompareXSt: _propTypes.default.bool.isRequired,
  isMultiSpectraSt: _propTypes.default.bool.isRequired,
  setUiAlignCompareXAct: _propTypes.default.func.isRequired,
  compact: _propTypes.default.bool
};
AlignCompareX.defaultProps = {
  compact: false
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(AlignCompareX);