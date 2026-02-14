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
var _wavelength = require("../../actions/wavelength");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _common = require("./common");
var _list_wavelength = require("../../constants/list_wavelength");
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
const wavelengthSelect = (classes, waveLengthSt, layoutSt, updateWaveLengthAct) => {
  if (!_format.default.isXRDLayout(layoutSt)) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {});
  }
  const onChange = e => updateWaveLengthAct(e.target.value);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldLayout),
    variant: "outlined",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-wavelength-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Wavelength"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: "select-wavelength-label",
      label: "Wavelength",
      value: waveLengthSt,
      onChange: onChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout'),
      children: _list_wavelength.LIST_WAVE_LENGTH.map(item => {
        // eslint-disable-line
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
          value: item,
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
            className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
            children: [item.label, " (", item.value, " ", item.unit, ")"]
          })
        });
      })
    })]
  });
};
const Wavelength = _ref => {
  let {
    classes,
    waveLengthSt,
    layoutSt,
    updateWaveLengthAct
  } = _ref;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: classes.groupRight,
    children: wavelengthSelect(classes, waveLengthSt, layoutSt, updateWaveLengthAct)
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  waveLengthSt: state.wavelength,
  layoutSt: state.layout
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  updateWaveLengthAct: _wavelength.updateWaveLength
}, dispatch);
Wavelength.propTypes = {
  classes: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  waveLengthSt: _propTypes.default.object.isRequired,
  updateWaveLengthAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(Wavelength));