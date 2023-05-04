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
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _PlayCircleOutline = _interopRequireDefault(require("@material-ui/icons/PlayCircleOutline"));
var _styles = require("@material-ui/core/styles");
var _chem = require("../../helpers/chem");
var _common = require("./common");
var _extractPeaksEdit = require("../../helpers/extractPeaksEdit");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, function-call-argument-newline,
react/require-default-props */

const styles = () => Object.assign({}, _common.commonStyle);
const onClickCb = (operation, peaksEdit, isAscend, isIntensity, scan, thres, layoutSt, shiftSt, analysis, decimalSt, integrationSt, multiplicitySt, allIntegrationSt, aucValues, waveLengthSt, cyclicvoltaSt, curveSt) => () => {
  operation({
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
    curveSt
  });
};
const BtnSubmit = _ref => {
  let {
    classes,
    operation,
    feature,
    isAscend,
    isIntensity,
    editPeakSt,
    thresSt,
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
    curveSt
  } = _ref;
  const peaksEdit = (0, _extractPeaksEdit.extractPeaksEdit)(feature, editPeakSt, thresSt, shiftSt, layoutSt);
  // const disBtn = peaksEdit.length === 0 || statusSt.btnSubmit || disabled;
  const scan = (0, _chem.Convert2Scan)(feature, scanSt);
  const thres = (0, _chem.Convert2Thres)(feature, thresSt);
  const aucValues = (0, _extractPeaksEdit.extractAreaUnderCurve)(allIntegrationSt, integrationSt, layoutSt);
  if (!operation) return null;
  return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Submit")
  }, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)('btn-sv-bar-submit'),
    color: "primary",
    onClick: onClickCb(operation.value, peaksEdit, isAscend, isIntensity, scan, thres, layoutSt, shiftSt, forecastSt.predictions, decimalSt, integrationSt, multiplicitySt, allIntegrationSt, aucValues, waveLengthSt, cyclicvoltaSt, curveSt)
  }, /*#__PURE__*/_react.default.createElement(_PlayCircleOutline.default, {
    className: classes.icon
  })));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  editPeakSt: state.editPeak.present,
  thresSt: state.threshold,
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
  curveSt: state.curve
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
  curveSt: _propTypes.default.object
};
var _default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(BtnSubmit);
exports.default = _default;