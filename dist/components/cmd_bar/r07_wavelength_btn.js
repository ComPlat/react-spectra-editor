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
var _core = require("@material-ui/core");
var _styles = require("@material-ui/core/styles");
var _wavelength = require("../../actions/wavelength");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _common = require("./common");
var _list_wavelength = require("../../constants/list_wavelength");
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
    return /*#__PURE__*/_react.default.createElement("i", null);
  }
  const onChange = e => updateWaveLengthAct(e.target.value);
  return /*#__PURE__*/_react.default.createElement(_core.FormControl, {
    className: (0, _classnames.default)(classes.fieldLayout),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_core.InputLabel, {
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Wavelength"), /*#__PURE__*/_react.default.createElement(_core.Select, {
    value: waveLengthSt,
    onChange: onChange,
    input: /*#__PURE__*/_react.default.createElement(_core.OutlinedInput, {
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout'),
      labelWidth: 60
    })
  }, _list_wavelength.LIST_WAVE_LENGTH.map(item => {
    // eslint-disable-line
    return /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      value: item
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
    }, item.label, " (", item.value, " ", item.unit, ")"));
  })));
};
const Wavelength = _ref => {
  let {
    classes,
    waveLengthSt,
    layoutSt,
    updateWaveLengthAct
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.groupRight
  }, wavelengthSelect(classes, waveLengthSt, layoutSt, updateWaveLengthAct));
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
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(Wavelength));