"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _index = _interopRequireDefault(require("./components/d3_line/index"));
var _index2 = _interopRequireDefault(require("./components/d3_rect/index"));
var _forecast_viewer = _interopRequireDefault(require("./components/forecast_viewer"));
var _format = _interopRequireDefault(require("./helpers/format"));
/* eslint-disable prefer-object-spread, default-param-last, react/function-component-definition */

const extractLayout = (forecast, layoutSt) => {
  const isEmpty = Object.keys(forecast).length === 0 && forecast.constructor === Object;
  const isNmr = _format.default.isNmrLayout(layoutSt);
  const isMs = _format.default.isMsLayout(layoutSt);
  const isIr = _format.default.isIrLayout(layoutSt);
  const isUvvis = _format.default.isUvVisLayout(layoutSt) || _format.default.isHplcUvVisLayout(layoutSt);
  const isXRD = _format.default.isXRDLayout(layoutSt);
  const showForecast = !isEmpty && (isNmr || isIr || isUvvis || isXRD);
  return {
    showForecast,
    isNmr,
    isIr,
    isMs,
    isUvvis,
    isXRD
  };
};
const Content = _ref => {
  let {
    topic,
    feature,
    cLabel,
    xLabel,
    yLabel,
    forecast,
    operations,
    layoutSt
  } = _ref;
  const {
    showForecast,
    isNmr,
    isIr,
    isMs,
    isUvvis,
    isXRD
  } = extractLayout(forecast, layoutSt);
  if (showForecast) {
    return /*#__PURE__*/_react.default.createElement(_forecast_viewer.default, {
      topic: topic,
      cLabel: cLabel,
      xLabel: xLabel,
      yLabel: yLabel,
      feature: feature,
      forecast: forecast,
      isNmr: isNmr,
      isIr: isIr,
      isUvvis: isUvvis,
      isXRD: isXRD,
      operations: operations
    });
  }
  if (isMs) {
    return /*#__PURE__*/_react.default.createElement(_index2.default, {
      topic: topic,
      cLabel: cLabel,
      xLabel: xLabel,
      yLabel: yLabel,
      feature: feature,
      isHidden: false
    });
  }
  return /*#__PURE__*/_react.default.createElement(_index.default, {
    topic: topic,
    cLabel: cLabel,
    xLabel: xLabel,
    yLabel: yLabel,
    feature: feature,
    isHidden: false
  });
};
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  layoutSt: state.layout
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
Content.propTypes = {
  topic: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  cLabel: _propTypes.default.string.isRequired,
  xLabel: _propTypes.default.string.isRequired,
  yLabel: _propTypes.default.string.isRequired,
  forecast: _propTypes.default.object.isRequired,
  operations: _propTypes.default.array.isRequired,
  layoutSt: _propTypes.default.string.isRequired
};
var _default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(Content);
exports.default = _default;