'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _styles = require('@material-ui/core/styles');

var _index = require('./d3_line/index');

var _index2 = _interopRequireDefault(_index);

var _nmr_viewer = require('./forecast/nmr_viewer');

var _nmr_viewer2 = _interopRequireDefault(_nmr_viewer);

var _ir_viewer = require('./forecast/ir_viewer');

var _ir_viewer2 = _interopRequireDefault(_ir_viewer);

var _forecast = require('../actions/forecast');

var _ui = require('../actions/ui');

var _list_ui = require('../constants/list_ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = function styles() {
  return {
    root: {
      flexGrow: 1
    },
    appBar: {
      backgroundColor: '#fff',
      boxShadow: 'none'
    },
    tabLabel: {
      fontSize: '14px'
    }
  };
};

var ForecastViewer = function (_React$Component) {
  _inherits(ForecastViewer, _React$Component);

  function ForecastViewer(props) {
    _classCallCheck(this, ForecastViewer);

    var _this = _possibleConstructorReturn(this, (ForecastViewer.__proto__ || Object.getPrototypeOf(ForecastViewer)).call(this, props));

    _this.initForecastReducer = _this.initForecastReducer.bind(_this);
    return _this;
  }

  _createClass(ForecastViewer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initForecastReducer();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var forecast = this.props.forecast;


      var prevForecast = forecast;
      var nextForecast = prevProps.forecast;
      if (prevForecast !== nextForecast) {
        this.initForecastReducer();
      }
    }
  }, {
    key: 'initForecastReducer',
    value: function initForecastReducer() {
      var _props = this.props,
          forecast = _props.forecast,
          initForecastStatusAct = _props.initForecastStatusAct,
          setUiViewerTypeAct = _props.setUiViewerTypeAct;

      initForecastStatusAct(forecast);
      if (forecast && forecast.predictions) {
        var _forecast$predictions = forecast.predictions,
            running = _forecast$predictions.running,
            refreshed = _forecast$predictions.refreshed;

        if (running || refreshed) setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          classes = _props2.classes,
          topic = _props2.topic,
          feature = _props2.feature,
          cLabel = _props2.cLabel,
          xLabel = _props2.xLabel,
          yLabel = _props2.yLabel,
          forecast = _props2.forecast,
          isNmr = _props2.isNmr,
          isIr = _props2.isIr,
          uiSt = _props2.uiSt,
          comparisonsSt = _props2.comparisonsSt;
      var viewer = uiSt.viewer;
      var inputCb = forecast.inputCb,
          molecule = forecast.molecule;


      return _react2.default.createElement(
        'div',
        { className: classes.root },
        _react2.default.createElement(_index2.default, {
          topic: topic,
          feature: feature,
          cLabel: cLabel,
          xLabel: xLabel,
          yLabel: yLabel,
          comparisons: comparisonsSt,
          isHidden: viewer !== _list_ui.LIST_UI_VIEWER_TYPE.SPECTRUM
        }),
        viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS && isNmr && _react2.default.createElement(_nmr_viewer2.default, {
          molecule: molecule,
          inputCb: inputCb
        }),
        viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS && isIr && _react2.default.createElement(_ir_viewer2.default, {
          molecule: molecule,
          inputCb: inputCb
        })
      );
    }
  }]);

  return ForecastViewer;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, _) {
  return (// eslint-disable-line
    {
      uiSt: state.ui,
      comparisonsSt: state.jcamp.others
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    initForecastStatusAct: _forecast.initForecastStatus,
    setUiViewerTypeAct: _ui.setUiViewerType
  }, dispatch);
};

ForecastViewer.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  topic: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  cLabel: _propTypes2.default.string.isRequired,
  xLabel: _propTypes2.default.string.isRequired,
  yLabel: _propTypes2.default.string.isRequired,
  forecast: _propTypes2.default.object.isRequired,
  isNmr: _propTypes2.default.bool.isRequired,
  isIr: _propTypes2.default.bool.isRequired,
  isUvvis: _propTypes2.default.bool.isRequired,
  uiSt: _propTypes2.default.object.isRequired,
  comparisonsSt: _propTypes2.default.array.isRequired,
  initForecastStatusAct: _propTypes2.default.func.isRequired,
  setUiViewerTypeAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(ForecastViewer);