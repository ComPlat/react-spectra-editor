"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _classnames = _interopRequireDefault(require("classnames"));
var _redux = require("redux");
var _material = require("@mui/material");
var _GpsFixedOutlined = _interopRequireDefault(require("@mui/icons-material/GpsFixedOutlined"));
var _HelpOutlineOutlined = _interopRequireDefault(require("@mui/icons-material/HelpOutlineOutlined"));
var _styles = require("@mui/styles");
var _common = require("./common");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _carbonFeatures = require("../../helpers/carbonFeatures");
var _extractPeaksEdit = require("../../helpers/extractPeaksEdit");
var _ui = require("../../actions/ui");
var _list_ui = require("../../constants/list_ui");
var _chem = require("../../helpers/chem");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, function-paren-newline,
max-len, react/function-component-definition,
function-call-argument-newline, react/require-default-props */

const styles = () => Object.assign({}, _common.commonStyle, {
  tTxt: {
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    marginRight: 5
  },
  btnWidthUnknown: {
    minWidth: 30,
    width: 30
  },
  btnWidthIr: {
    minWidth: 30,
    width: 30
  },
  btnWidthNmr: {
    minWidth: 80,
    width: 80
  }
});
const MuPredictButton = (0, _styles.withStyles)({
  root: {
    border: '1px solid #ccc',
    borderRadius: 4,
    fontFamily: 'Helvetica',
    fontSize: 20,
    height: 30,
    lineHeight: '20px',
    padding: 0
  }
})(_material.Button);
const onClickFail = (layoutSt, simuCount, realCount) => {
  const feature = _format.default.is13CLayout(layoutSt) ? 'peak' : 'multiplet';
  return () => alert(`Selected ${feature} count (${realCount}) must be larger than 0, and must be eqal or less than simulated count (${simuCount}).`); // eslint-disable-line
};
const onClickReady = (forecast, peaksEdit, layoutSt, scan, shiftSt, thres, analysis, integrationSt, multiplicitySt, setUiViewerTypeAct, curveSt) => {
  const {
    btnCb
  } = forecast;
  if (!btnCb) {
    return () => alert('[Developer Warning] You need to implement btnCb in forecast!'); // eslint-disable-line
  }
  return () => {
    setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS);
    return btnCb({
      peaks: peaksEdit,
      layout: layoutSt,
      scan,
      thres,
      analysis,
      integration: integrationSt,
      multiplicity: multiplicitySt,
      shift: shiftSt,
      curveSt
    });
  };
};
const onClicUnknown = (feature, forecast, peaksEdit, layoutSt, scan, shiftSt, thres, analysis, integrationSt, multiplicitySt, curveSt) => {
  const {
    refreshCb
  } = forecast;
  if (!refreshCb) {
    return () => alert('[Developer Warning] You need to implement refreshCb in forecast!'); // eslint-disable-line
  }
  return () => refreshCb({
    peaks: peaksEdit,
    layout: layoutSt,
    scan,
    shift: shiftSt,
    thres,
    analysis,
    integration: integrationSt,
    multiplicity: multiplicitySt,
    curveSt
  });
};
const counterText = (classes, isIr, realCount, uniqCount, simuCount) => isIr ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
  className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
  children: `${realCount}/${uniqCount}/${simuCount}`
});
const renderBtnPredict = (classes, isIr, realCount, uniqCount, simuCount, color, btnWidthCls, onClick) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
  title: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: "txt-sv-tp",
      children: "Predict"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: "txt-sv-tp",
      children: "- Selected features must be eqal or less than simulated features."
    })]
  }),
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(MuPredictButton, {
    className: (0, _classnames.default)('btn-sv-bar-submit', btnWidthCls),
    style: {
      color
    },
    onClick: onClick,
    children: [counterText(classes, isIr, realCount, uniqCount, simuCount), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GpsFixedOutlined.default, {
      className: classes.icon
    })]
  })
});
const renderBtnUnknown = (classes, onClick) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
  title: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: "txt-sv-tp",
      children: "Refresh Simulation"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: "txt-sv-tp",
      children: "- Simulation must be refreshed before making a prediction."
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: "txt-sv-tp",
      children: "- If you continue to see this button after clicking it, the server is not ready. Please wait for a while."
    })]
  }),
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(MuPredictButton, {
    className: (0, _classnames.default)('btn-sv-bar-submit', classes.btnWidthUnknown),
    style: {
      color: 'orange'
    },
    onClick: onClick,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HelpOutlineOutlined.default, {
      className: classes.icon
    })
  })
});
const BtnPredict = _ref => {
  let {
    classes,
    feature,
    forecast,
    layoutSt,
    simulationSt,
    editPeakSt,
    scanSt,
    shiftSt,
    thresSt,
    integrationSt,
    multiplicitySt,
    forecastSt,
    setUiViewerTypeAct,
    curveSt
  } = _ref;
  const is13Cor1H = _format.default.is13CLayout(layoutSt) || _format.default.is1HLayout(layoutSt);
  const isIr = _format.default.isIrLayout(layoutSt);
  if (!(is13Cor1H || isIr)) return null;
  const oriPeaksEdit = (0, _extractPeaksEdit.extractPeaksEdit)(feature, editPeakSt, thresSt, shiftSt, layoutSt);
  const peaksEdit = _format.default.rmShiftFromPeaks(oriPeaksEdit, shiftSt);
  const scan = (0, _chem.Convert2Scan)(feature, scanSt);
  const thres = (0, _chem.Convert2Thres)(feature, thresSt);
  const simuCount = simulationSt.nmrSimPeaks.length;
  const uniqCount = [...new Set(simulationSt.nmrSimPeaks)].length;
  const {
    curveIdx
  } = curveSt;
  const predictionsByCurve = forecastSt && forecastSt.predictionsByCurve || {};
  const hasCurvePredictions = Object.prototype.hasOwnProperty.call(predictionsByCurve, curveIdx);
  const hasAnyCurvePredictions = Object.keys(predictionsByCurve).length > 0;
  const emptyPredictions = {
    outline: {},
    output: {
      result: []
    }
  };
  let analysisPredictions = forecastSt && forecastSt.predictions || forecast.predictions;
  if (hasCurvePredictions) {
    analysisPredictions = predictionsByCurve[curveIdx];
  } else if (hasAnyCurvePredictions) {
    analysisPredictions = emptyPredictions;
  }
  let realCount = 0;
  if (_format.default.is13CLayout(layoutSt)) {
    realCount = (0, _carbonFeatures.carbonFeatures)(peaksEdit, multiplicitySt).length;
  } else {
    const {
      multiplicities
    } = multiplicitySt;
    const selectedMultiplicity = multiplicities[curveIdx];
    const {
      stack
    } = selectedMultiplicity;
    realCount = stack.length;
  }
  if (is13Cor1H && simuCount === 0) {
    const onClickUnknownCb = onClicUnknown(feature, forecast, peaksEdit, layoutSt, scan, shiftSt, thres, analysisPredictions, integrationSt, multiplicitySt, curveSt);
    return renderBtnUnknown(classes, onClickUnknownCb);
  }
  const predictable = isIr || simuCount >= realCount && realCount > 0;
  const color = predictable ? 'green' : 'red';
  const onClick = predictable ? onClickReady(forecast, peaksEdit, layoutSt, scan, shiftSt, thres, analysisPredictions, integrationSt, multiplicitySt, setUiViewerTypeAct, curveSt) : onClickFail(layoutSt, simuCount, realCount);
  const btnWidthCls = isIr ? classes.btnWidthIr : classes.btnWidthNmr;
  return renderBtnPredict(classes, isIr, realCount, uniqCount, simuCount, color, btnWidthCls, onClick);
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  simulationSt: state.simulation,
  editPeakSt: state.editPeak.present,
  scanSt: state.scan,
  shiftSt: state.shift,
  thresSt: state.threshold.list[state.curve.curveIdx],
  integrationSt: state.integration.present,
  multiplicitySt: state.multiplicity.present,
  curveSt: state.curve,
  forecastSt: state.forecast
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiViewerTypeAct: _ui.setUiViewerType
}, dispatch);
BtnPredict.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  forecast: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  simulationSt: _propTypes.default.array.isRequired,
  editPeakSt: _propTypes.default.object.isRequired,
  scanSt: _propTypes.default.object.isRequired,
  shiftSt: _propTypes.default.object.isRequired,
  thresSt: _propTypes.default.object.isRequired,
  integrationSt: _propTypes.default.object.isRequired,
  multiplicitySt: _propTypes.default.object.isRequired,
  forecastSt: _propTypes.default.object.isRequired,
  setUiViewerTypeAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(BtnPredict);