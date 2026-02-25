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
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _PlayCircleOutline = _interopRequireDefault(require("@mui/icons-material/PlayCircleOutline"));
var _styles = require("@mui/styles");
var _chem = require("../../helpers/chem");
var _common = require("./common");
var _extractPeaksEdit = require("../../helpers/extractPeaksEdit");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, function-call-argument-newline,
react/require-default-props */

const styles = () => Object.assign({}, _common.commonStyle);
const getAxesSelection = (axesUnitsSt, curveIdx) => {
  const axes = axesUnitsSt?.axes;
  if (!Array.isArray(axes) || axes.length === 0) return {
    xUnit: '',
    yUnit: ''
  };
  const idx = Number.isFinite(curveIdx) ? curveIdx : 0;
  return axes[idx] || axes[0] || {
    xUnit: '',
    yUnit: ''
  };
};
const resolveAxisLabels = (xLabel, yLabel, axesUnitsSt, curveIdx) => {
  const {
    xUnit,
    yUnit
  } = getAxesSelection(axesUnitsSt, curveIdx);
  return {
    xLabel: xUnit === '' ? xLabel : xUnit,
    yLabel: yUnit === '' ? yLabel : yUnit
  };
};
const getBaseCurrentUnit = label => /mA/i.test(String(label)) ? 'mA' : 'A';
const buildCvAxisYLabel = (yLabel, cyclicvoltaSt) => {
  const baseUnit = getBaseCurrentUnit(yLabel);
  const areaUnit = cyclicvoltaSt?.areaUnit || 'cm²';
  if (cyclicvoltaSt?.useCurrentDensity) {
    return `Current density in ${baseUnit}/${areaUnit}`;
  }
  return `Current in ${baseUnit}`;
};
const computeCvYScaleFactor = (feature, cyclicvoltaSt) => {
  if (!cyclicvoltaSt?.useCurrentDensity) return 1.0;
  const rawArea = (cyclicvoltaSt.areaValue === '' ? 1.0 : cyclicvoltaSt.areaValue) || 1.0;
  const areaUnit = cyclicvoltaSt.areaUnit || 'cm²';
  const safeArea = rawArea > 0 ? rawArea : 1.0;
  const areaInCm2 = areaUnit === 'mm²' ? safeArea / 100.0 : safeArea;
  let factor = 1.0 / areaInCm2;
  const baseY = feature && feature.yUnit ? String(feature.yUnit) : 'A';
  if (/mA/i.test(baseY)) {
    factor *= 1000.0;
  }
  if (areaUnit === 'mm²') {
    factor /= 100.0;
  }
  return factor;
};
const defaultThreshold = {
  isEdit: true,
  value: false,
  upper: false,
  lower: false
};
const pickFromList = (list, index, fallback = null) => Array.isArray(list) && list[index] !== undefined ? list[index] : fallback;
const buildDstPayload = ({
  feature,
  curveIdx,
  editPeakSt,
  thresList,
  shiftSt,
  layoutSt,
  scanSt,
  integrationSt,
  multiplicitySt,
  allIntegrationSt,
  aucValues,
  waveLengthSt,
  cyclicvoltaSt,
  curveSt,
  axesUnitsSt,
  detectorSt,
  dscMetaData,
  isAscend,
  isIntensity,
  analysis,
  decimalSt
}) => {
  const threshold = thresList?.[curveIdx] || thresList?.[0] || defaultThreshold;
  const editPeakAtIndex = Object.assign({}, editPeakSt, {
    selectedIdx: curveIdx
  });
  const peaksEdit = (0, _extractPeaksEdit.extractPeaksEdit)(feature, editPeakAtIndex, threshold, shiftSt, layoutSt, curveIdx);
  const scan = (0, _chem.Convert2Scan)(feature, scanSt);
  const thres = (0, _chem.Convert2Thres)(feature, threshold);
  const integration = pickFromList(integrationSt?.integrations, curveIdx, integrationSt);
  const multiplicity = pickFromList(multiplicitySt?.multiplicities, curveIdx, multiplicitySt);
  const {
    xLabel,
    yLabel
  } = resolveAxisLabels(feature?.xUnit, feature?.yUnit, axesUnitsSt, curveIdx);
  const axisYLabel = _format.default.isCyclicVoltaLayout(layoutSt) ? buildCvAxisYLabel(yLabel, cyclicvoltaSt) : yLabel;
  const axisDisplay = {
    xLabel,
    yLabel: axisYLabel
  };
  const cvDisplay = _format.default.isCyclicVoltaLayout(layoutSt) ? {
    mode: cyclicvoltaSt?.useCurrentDensity ? 'density' : 'current',
    yScaleFactor: computeCvYScaleFactor(feature, cyclicvoltaSt)
  } : null;
  const cyclicvoltaPayload = {
    ...cyclicvoltaSt,
    axisDisplay,
    cvDisplay
  };
  const perCurveSt = Object.assign({}, curveSt, {
    curveIdx
  });
  return {
    peaks: peaksEdit,
    layout: layoutSt,
    shift: shiftSt,
    scan,
    thres,
    isAscend,
    isIntensity,
    analysis,
    decimal: decimalSt,
    integration,
    multiplicity,
    allIntegration: allIntegrationSt,
    aucValues,
    waveLength: waveLengthSt,
    cyclicvoltaSt: cyclicvoltaPayload,
    curveSt: perCurveSt,
    axesUnitsSt,
    detectorSt,
    dscMetaData
  };
};
const onClickCb = (operation, peaksEdit, isAscend, isIntensity, scan, thres, layoutSt, shiftSt, analysis, decimalSt, integrationSt, multiplicitySt, allIntegrationSt, aucValues, waveLengthSt, cyclicvoltaSt, curveSt, axesUnitsSt, detectorSt, dscMetaData, curveList, editPeakSt, thresList, scanSt, feature) => () => {
  const payload = {
    peaks: peaksEdit,
    layout: layoutSt,
    shift: shiftSt,
    scan,
    thres,
    isAscend,
    isIntensity,
    analysis,
    decimal: decimalSt,
    integration: integrationSt,
    multiplicity: multiplicitySt,
    allIntegration: allIntegrationSt,
    aucValues,
    waveLength: waveLengthSt,
    cyclicvoltaSt,
    curveSt,
    axesUnitsSt,
    detectorSt,
    dscMetaData
  };
  const curves = Array.isArray(curveList) && curveList.length > 0 ? curveList : feature ? [{
    feature
  }] : [];
  const fallbackIdx = Number.isFinite(curveSt?.curveIdx) ? curveSt.curveIdx : 0;
  const indicesToSend = curves.length > 0 ? curves.map((_, index) => index) : [fallbackIdx];
  payload.dst_list = indicesToSend.map(curveIdx => {
    const curve = curves[curveIdx] || {};
    const curveFeature = curve.feature || feature;
    return buildDstPayload({
      feature: curveFeature,
      curveIdx,
      editPeakSt,
      thresList,
      shiftSt,
      layoutSt,
      scanSt,
      integrationSt,
      multiplicitySt,
      allIntegrationSt,
      aucValues,
      waveLengthSt,
      cyclicvoltaSt,
      curveSt,
      axesUnitsSt,
      detectorSt,
      dscMetaData,
      isAscend,
      isIntensity,
      analysis,
      decimalSt
    });
  });
  if (_format.default.isCyclicVoltaLayout(layoutSt)) {
    console.log('[CV submit] payload', payload);
  }
  operation(payload);
};
const BtnSubmit = ({
  classes,
  operation,
  feature,
  isAscend,
  isIntensity,
  editPeakSt,
  thresSt,
  thresList,
  layoutSt,
  shiftSt,
  scanSt,
  forecastSt,
  decimalSt,
  integrationSt,
  multiplicitySt,
  allIntegrationSt,
  waveLengthSt,
  cyclicvoltaSt,
  curveSt,
  curveList,
  axesUnitsSt,
  detectorSt,
  metaSt
}) => {
  const peaksEdit = (0, _extractPeaksEdit.extractPeaksEdit)(feature, editPeakSt, thresSt, shiftSt, layoutSt);
  // const disBtn = peaksEdit.length === 0 || statusSt.btnSubmit || disabled;
  const scan = (0, _chem.Convert2Scan)(feature, scanSt);
  const thres = (0, _chem.Convert2Thres)(feature, thresSt);
  const aucValues = (0, _extractPeaksEdit.extractAreaUnderCurve)(allIntegrationSt, integrationSt, layoutSt);
  const {
    dscMetaData
  } = metaSt;
  const isCvLayout = _format.default.isCyclicVoltaLayout(layoutSt);
  const {
    xLabel,
    yLabel
  } = resolveAxisLabels(feature?.xUnit, feature?.yUnit, axesUnitsSt, curveSt?.curveIdx);
  const axisYLabel = isCvLayout ? buildCvAxisYLabel(yLabel, cyclicvoltaSt) : yLabel;
  const axisDisplay = {
    xLabel,
    yLabel: axisYLabel
  };
  const cvDisplay = isCvLayout ? {
    mode: cyclicvoltaSt?.useCurrentDensity ? 'density' : 'current',
    yScaleFactor: computeCvYScaleFactor(feature, cyclicvoltaSt)
  } : null;
  const cyclicvoltaPayload = {
    ...cyclicvoltaSt,
    axisDisplay,
    cvDisplay
  };
  if (!operation) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
    title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: "txt-sv-tp",
      children: "Submit"
    }),
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
      className: (0, _classnames.default)('btn-sv-bar-submit'),
      color: "primary",
      onClick: onClickCb(operation.value, peaksEdit, isAscend, isIntensity, scan, thres, layoutSt, shiftSt, forecastSt.predictions, decimalSt, integrationSt, multiplicitySt, allIntegrationSt, aucValues, waveLengthSt, cyclicvoltaPayload, curveSt, axesUnitsSt, detectorSt, dscMetaData, curveList, editPeakSt, thresList, scanSt, feature),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_PlayCircleOutline.default, {
        className: classes.icon
      })
    })
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  editPeakSt: state.editPeak.present,
  thresSt: state.threshold.list[state.curve.curveIdx],
  thresList: state.threshold.list,
  layoutSt: state.layout,
  shiftSt: state.shift,
  scanSt: state.scan,
  forecastSt: state.forecast,
  decimalSt: state.submit.decimal,
  integrationSt: state.integration.present,
  multiplicitySt: state.multiplicity.present,
  allIntegrationSt: state.integration.past.concat(state.integration.present),
  waveLengthSt: state.wavelength,
  cyclicvoltaSt: state.cyclicvolta,
  curveSt: state.curve,
  curveList: state.curve.listCurves,
  axesUnitsSt: state.axesUnits,
  detectorSt: state.detector,
  metaSt: state.meta
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
BtnSubmit.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  isAscend: _propTypes.default.bool.isRequired,
  isIntensity: _propTypes.default.bool.isRequired,
  operation: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.bool]).isRequired,
  editPeakSt: _propTypes.default.object.isRequired,
  thresSt: _propTypes.default.object.isRequired,
  thresList: _propTypes.default.array.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  shiftSt: _propTypes.default.object.isRequired,
  scanSt: _propTypes.default.object.isRequired,
  forecastSt: _propTypes.default.object.isRequired,
  decimalSt: _propTypes.default.number.isRequired,
  integrationSt: _propTypes.default.object.isRequired,
  multiplicitySt: _propTypes.default.object.isRequired,
  allIntegrationSt: _propTypes.default.object.isRequired,
  waveLengthSt: _propTypes.default.object.isRequired,
  cyclicvoltaSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object,
  curveList: _propTypes.default.array.isRequired,
  axesUnitsSt: _propTypes.default.object.isRequired,
  detectorSt: _propTypes.default.object.isRequired,
  metaSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(BtnSubmit);