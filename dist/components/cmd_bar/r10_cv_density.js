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
var _list_layout = require("../../constants/list_layout");
var _common = require("./common");
var _cyclic_voltammetry = require("../../actions/cyclic_voltammetry");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/function-component-definition, react/jsx-one-expression-per-line,
react/jsx-boolean-value */

const styles = () => ({
  ..._common.commonStyle,
  fieldArea: {
    width: 100
  },
  fieldUnit: {
    width: 75
  }
});
const units = ['cm²', 'mm²'];
const CvDensityControls = ({
  classes,
  layoutSt,
  areaValue,
  areaUnit,
  useCurrentDensity,
  setAreaValueAct,
  setAreaUnitAct,
  toggleDensityAct
}) => {
  if (layoutSt !== _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY) return /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {});
  const handleAreaChange = e => {
    const raw = e.target.value;
    if (raw === '') {
      setAreaValueAct('');
      return;
    }
    const val = parseFloat(raw);
    if (Number.isNaN(val)) return;
    if (val < 0) return;
    setAreaValueAct(val);
  };
  const handleAreaBlur = e => {
    const raw = e.target.value;
    const val = parseFloat(raw);
    if (raw === '' || Number.isNaN(val) || val <= 0) {
      setAreaValueAct(1.0);
    }
  };
  const handleUnitChange = e => {
    const newUnit = e.target.value;
    const currVal = areaValue;
    if (currVal !== '' && Number.isFinite(Number(currVal))) {
      const num = Number(currVal);
      const from = areaUnit;
      const to = newUnit;
      let converted = num;
      if (from === 'cm²' && to === 'mm²') converted = num * 100.0;
      if (from === 'mm²' && to === 'cm²') converted = num / 100.0;
      setAreaValueAct(converted);
    }
    setAreaUnitAct(newUnit);
  };
  const handleToggle = (_, val) => {
    if (val === null) return;
    const shouldBeDensity = val === 'density';
    if (shouldBeDensity !== useCurrentDensity) {
      toggleDensityAct();
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.groupRight,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
      className: (0, _classnames.default)(classes.fieldArea),
      variant: "outlined",
      disabled: !useCurrentDensity,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
        htmlFor: "cv-area",
        className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
        children: "WE-ECSA"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.OutlinedInput, {
        id: "cv-area",
        label: "WE-ECSA",
        type: "number",
        inputProps: {
          step: '0.0001',
          min: '0'
        },
        value: areaValue,
        onChange: handleAreaChange,
        onBlur: handleAreaBlur,
        className: (0, _classnames.default)(classes.txtInput, 'input-sv-bar-layout'),
        disabled: !useCurrentDensity
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
      className: (0, _classnames.default)(classes.fieldUnit),
      variant: "outlined",
      disabled: !useCurrentDensity,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
        id: "cv-area-unit",
        className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
        children: "Unit"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
        value: areaUnit,
        onChange: handleUnitChange,
        labelId: "cv-area-unit",
        label: "Unit",
        className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout'),
        disabled: !useCurrentDensity,
        children: units.map(u => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
          value: u,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
            children: u
          })
        }, u))
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.ToggleButtonGroup, {
      exclusive: true,
      size: "small",
      value: useCurrentDensity ? 'density' : 'current',
      onChange: handleToggle,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout'),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.ToggleButton, {
        value: "current",
        className: (0, _classnames.default)(classes.txtOpt),
        children: "Current"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.ToggleButton, {
        value: "density",
        className: (0, _classnames.default)(classes.txtOpt),
        children: "Current / Area"
      })]
    })]
  });
};
CvDensityControls.propTypes = {
  classes: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  areaValue: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  areaUnit: _propTypes.default.string.isRequired,
  useCurrentDensity: _propTypes.default.bool.isRequired,
  setAreaValueAct: _propTypes.default.func.isRequired,
  setAreaUnitAct: _propTypes.default.func.isRequired,
  toggleDensityAct: _propTypes.default.func.isRequired
};
const mapStateToProps = state => ({
  layoutSt: state.layout,
  areaValue: state.cyclicvolta.areaValue,
  areaUnit: state.cyclicvolta.areaUnit,
  useCurrentDensity: state.cyclicvolta.useCurrentDensity
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setAreaValueAct: _cyclic_voltammetry.setCyclicVoltaAreaValue,
  setAreaUnitAct: _cyclic_voltammetry.setCyclicVoltaAreaUnit,
  toggleDensityAct: _cyclic_voltammetry.toggleCyclicVoltaDensity
}, dispatch);
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(CvDensityControls));