'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _index = require('./components/d3_line/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./components/d3_rect/index');

var _index4 = _interopRequireDefault(_index3);

var _forecast_viewer = require('./components/forecast_viewer');

var _forecast_viewer2 = _interopRequireDefault(_forecast_viewer);

var _format = require('./helpers/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extractLayout = function extractLayout(forecast, layoutSt) {
  var isEmpty = Object.keys(forecast).length === 0 && forecast.constructor === Object;
  var isNmr = _format2.default.isNmrLayout(layoutSt);
  var isMs = _format2.default.isMsLayout(layoutSt);
  var isIr = _format2.default.isIrLayout(layoutSt);
  var isUvvis = _format2.default.isUvVisLayout(layoutSt) || _format2.default.isHplcUvVisLayout(layoutSt);
  var isXRD = _format2.default.isXRDLayout(layoutSt);
  var showForecast = !isEmpty && (isNmr || isIr || isUvvis || isXRD);
  return {
    showForecast: showForecast, isNmr: isNmr, isIr: isIr, isMs: isMs, isUvvis: isUvvis, isXRD: isXRD
  };
};

var Content = function Content(_ref) {
  var topic = _ref.topic,
      feature = _ref.feature,
      cLabel = _ref.cLabel,
      xLabel = _ref.xLabel,
      yLabel = _ref.yLabel,
      forecast = _ref.forecast,
      operations = _ref.operations,
      layoutSt = _ref.layoutSt;

  var _extractLayout = extractLayout(forecast, layoutSt),
      showForecast = _extractLayout.showForecast,
      isNmr = _extractLayout.isNmr,
      isIr = _extractLayout.isIr,
      isMs = _extractLayout.isMs,
      isUvvis = _extractLayout.isUvvis,
      isXRD = _extractLayout.isXRD;

  if (showForecast) {
    return _react2.default.createElement(_forecast_viewer2.default, {
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
    return _react2.default.createElement(_index4.default, {
      topic: topic,
      cLabel: cLabel,
      xLabel: xLabel,
      yLabel: yLabel,
      feature: feature,
      isHidden: false
    });
  }

  return _react2.default.createElement(_index2.default, {
    topic: topic,
    cLabel: cLabel,
    xLabel: xLabel,
    yLabel: yLabel,
    feature: feature,
    isHidden: false
  });
};

var mapStateToProps = function mapStateToProps(state, _) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({}, dispatch);
};

Content.propTypes = {
  topic: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  cLabel: _propTypes2.default.string.isRequired,
  xLabel: _propTypes2.default.string.isRequired,
  yLabel: _propTypes2.default.string.isRequired,
  forecast: _propTypes2.default.object.isRequired,
  operations: _propTypes2.default.array.isRequired,
  layoutSt: _propTypes2.default.string.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(Content);