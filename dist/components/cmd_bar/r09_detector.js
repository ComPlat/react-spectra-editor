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
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _detector = require("../../actions/detector");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _common = require("./common");
var _list_detectors = require("../../constants/list_detectors");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, react/jsx-one-expression-per-line,
react/function-component-definition */

const styles = () => Object.assign({
  fieldShift: {
    width: 160
  },
  fieldLayout: {
    width: 100
  }
}, _common.commonStyle);
const detectorSelect = (classes, detectorSt, curveSt, layoutSt, updateDetectorAct) => {
  if (!_format.default.isSECLayout(layoutSt)) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {});
  }
  const {
    curveIdx
  } = curveSt;
  const {
    curves
  } = detectorSt;
  const getSelectedDetectorForCurve = (_detectorSt, targetCurveIdx) => {
    const targetCurve = curves.find(curve => curve.curveIdx === targetCurveIdx);
    return targetCurve ? targetCurve.selectedDetector : '';
  };
  const selectedDetector = getSelectedDetectorForCurve(detectorSt, curveIdx);
  const onChange = e => updateDetectorAct({
    curveIdx,
    selectedDetector: e.target.value
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldLayout),
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-detector-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Detector"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Select, {
      labelId: "select-detector-label",
      label: "Detector",
      value: selectedDetector,
      onChange: onChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout'),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
        })
      }), _list_detectors.LIST_DETECTORS.map(item => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: item,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: item.name
        })
      }))]
    })]
  });
};
const Detector = _ref => {
  let {
    classes,
    detectorSt,
    curveSt,
    layoutSt,
    updateDetectorAct
  } = _ref;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: classes.groupRight,
    children: detectorSelect(classes, detectorSt, curveSt, layoutSt, updateDetectorAct)
  });
};
const mapStateToProps = (state, _props) => (
// eslint-disable-line
{
  detectorSt: state.detector,
  curveSt: state.curve,
  layoutSt: state.layout
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  updateDetectorAct: _detector.updateDetector
}, dispatch);
Detector.propTypes = {
  classes: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  updateDetectorAct: _propTypes.default.func.isRequired,
  detectorSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(Detector));