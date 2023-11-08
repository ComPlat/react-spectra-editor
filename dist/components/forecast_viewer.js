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
var _styles = require("@material-ui/core/styles");
var _index = _interopRequireDefault(require("./d3_line/index"));
var _nmr_viewer = _interopRequireDefault(require("./forecast/nmr_viewer"));
var _ir_viewer = _interopRequireDefault(require("./forecast/ir_viewer"));
var _forecast = require("../actions/forecast");
var _ui = require("../actions/ui");
var _list_ui = require("../constants/list_ui");
/* eslint-disable react/no-unused-prop-types */

const styles = () => ({
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
});
class ForecastViewer extends _react.default.Component {
  constructor(props) {
    super(props);
    this.initForecastReducer = this.initForecastReducer.bind(this);
  }
  componentDidMount() {
    this.initForecastReducer();
  }
  componentDidUpdate(prevProps) {
    const {
      forecast
    } = this.props;
    const prevForecast = forecast;
    const nextForecast = prevProps.forecast;
    if (prevForecast !== nextForecast) {
      this.initForecastReducer();
    }
  }
  initForecastReducer() {
    const {
      forecast,
      initForecastStatusAct,
      setUiViewerTypeAct
    } = this.props;
    initForecastStatusAct(forecast);
    if (forecast && forecast.predictions) {
      const {
        running,
        refreshed
      } = forecast.predictions;
      if (running || refreshed) setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS);
    }
  }
  render() {
    const {
      classes,
      topic,
      feature,
      cLabel,
      xLabel,
      yLabel,
      forecast,
      isNmr,
      isIr,
      uiSt,
      isXRD,
      wavelength,
      curveSt,
      jcampSt
    } = this.props;
    const {
      viewer
    } = uiSt;
    const {
      inputCb,
      molecule
    } = forecast;
    const {
      curveIdx
    } = curveSt;
    const {
      jcamps
    } = jcampSt;
    const comparisons = jcamps[curveIdx].others;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.root
    }, /*#__PURE__*/_react.default.createElement(_index.default, {
      topic: topic,
      feature: feature,
      cLabel: cLabel,
      xLabel: isXRD && wavelength ? `${xLabel}, WL=${wavelength.value} ${wavelength.unit}` : xLabel,
      yLabel: yLabel,
      comparisons: comparisons,
      isHidden: viewer !== _list_ui.LIST_UI_VIEWER_TYPE.SPECTRUM
    }), viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS && isNmr && /*#__PURE__*/_react.default.createElement(_nmr_viewer.default, {
      molecule: molecule,
      inputCb: inputCb
    }), viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS && isIr && /*#__PURE__*/_react.default.createElement(_ir_viewer.default, {
      molecule: molecule,
      inputCb: inputCb
    }));
  }
}
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  uiSt: state.ui,
  jcampSt: state.jcamp,
  wavelength: state.wavelength,
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  initForecastStatusAct: _forecast.initForecastStatus,
  setUiViewerTypeAct: _ui.setUiViewerType
}, dispatch);
ForecastViewer.propTypes = {
  classes: _propTypes.default.object.isRequired,
  topic: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  cLabel: _propTypes.default.string.isRequired,
  xLabel: _propTypes.default.string.isRequired,
  yLabel: _propTypes.default.string.isRequired,
  forecast: _propTypes.default.object.isRequired,
  isNmr: _propTypes.default.bool.isRequired,
  isIr: _propTypes.default.bool.isRequired,
  isUvvis: _propTypes.default.bool.isRequired,
  isXRD: _propTypes.default.bool.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  jcampSt: _propTypes.default.object.isRequired,
  initForecastStatusAct: _propTypes.default.func.isRequired,
  setUiViewerTypeAct: _propTypes.default.func.isRequired,
  wavelength: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(ForecastViewer);