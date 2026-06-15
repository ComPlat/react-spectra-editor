"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _material = require("@mui/material");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/function-component-definition */

const renderWavelengthSelect = (classes, hplcMsSt, updateWavelengthAct, options = {}) => {
  const {
    labelId = 'select-decimal-label',
    label = 'Decimal',
    width = '140px'
  } = options;
  const uvvis = hplcMsSt && hplcMsSt.uvvis || {};
  const {
    listWaveLength = null,
    selectedWaveLength
  } = uvvis;
  const items = listWaveLength ? listWaveLength.map(d => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
    value: d,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-decimal'),
      children: d
    })
  }, d)) : [];
  const hasSelectedWaveLength = listWaveLength && listWaveLength.includes(selectedWaveLength);
  const resolvedSelectedWaveLength = hasSelectedWaveLength ? selectedWaveLength : listWaveLength && listWaveLength[0];
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldDecimal),
    variant: "outlined",
    style: {
      width
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: labelId,
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Wavelength (nm)"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: labelId,
      label: label,
      value: resolvedSelectedWaveLength,
      onChange: updateWavelengthAct,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-decimal'),
      children: items
    })]
  });
};
var _default = exports.default = renderWavelengthSelect;