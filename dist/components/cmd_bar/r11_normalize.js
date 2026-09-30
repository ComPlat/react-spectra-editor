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
var _HeightOutlined = _interopRequireDefault(require("@mui/icons-material/HeightOutlined"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _curve = require("../../actions/curve");
var _common = require("./common");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, react/function-component-definition */

const styles = () => Object.assign({}, _common.commonStyle);
const Normalize = ({
  classes,
  isNormalizedSt,
  setCurvesNormalizedAct
}) => {
  const onToggle = () => setCurvesNormalizedAct(!isNormalizedSt);
  const title = isNormalizedSt ? 'Show original intensities' : 'Normalize spectra (highest peaks = 100 %)';
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: classes.group,
    "data-testid": "Normalize",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: title
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isNormalizedSt, classes), 'btn-sv-bar-normalize'),
          onClick: onToggle,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HeightOutlined.default, {
            className: classes.icon
          })
        })
      })
    })
  });
};
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  isNormalizedSt: !!state.curve.isNormalized
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setCurvesNormalizedAct: _curve.setCurvesNormalized
}, dispatch);
Normalize.propTypes = {
  classes: _propTypes.default.object.isRequired,
  isNormalizedSt: _propTypes.default.bool.isRequired,
  setCurvesNormalizedAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(Normalize);