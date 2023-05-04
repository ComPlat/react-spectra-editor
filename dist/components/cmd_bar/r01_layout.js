"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _Select = _interopRequireDefault(require("@material-ui/core/Select"));
var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));
var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));
var _OutlinedInput = _interopRequireDefault(require("@material-ui/core/OutlinedInput"));
var _InputLabel = _interopRequireDefault(require("@material-ui/core/InputLabel"));
var _styles = require("@material-ui/core/styles");
var _r02_scan = _interopRequireDefault(require("./r02_scan"));
var _layout = require("../../actions/layout");
var _shift = require("../../actions/shift");
var _list_layout = require("../../constants/list_layout");
var _list_shift = require("../../constants/list_shift");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _common = require("./common");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */

const styles = () => Object.assign({
  fieldShift: {
    width: 160
  },
  fieldLayout: {
    width: 100
  }
}, _common.commonStyle);
const shiftSelect = (classes, layoutSt, shiftRefSt, setShiftRefAct) => {
  if (_cfg.default.hideSolvent(layoutSt)) return null;
  const onChange = e => setShiftRefAct(e.target.value);
  const listShift = (0, _list_shift.getListShift)(layoutSt);
  const content = listShift.map(ref => /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: ref,
    key: ref.name
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-shift')
  }, `${ref.name}: ${ref.value} ppm`)));
  return /*#__PURE__*/_react.default.createElement(_FormControl.default, {
    className: (0, _classnames.default)(classes.fieldShift),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_InputLabel.default, {
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Solvent"), /*#__PURE__*/_react.default.createElement(_Select.default, {
    value: shiftRefSt,
    onChange: onChange,
    input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-shift'),
      labelWidth: 60
    })
  }, content));
};
const layoutSelect = (classes, layoutSt, updateLayoutAct) => {
  const onChange = e => updateLayoutAct(e.target.value);
  return /*#__PURE__*/_react.default.createElement(_FormControl.default, {
    className: (0, _classnames.default)(classes.fieldLayout),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_InputLabel.default, {
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Layout"), /*#__PURE__*/_react.default.createElement(_Select.default, {
    value: layoutSt,
    onChange: onChange,
    input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout'),
      labelWidth: 60
    })
  }, /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.PLAIN
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "plain")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.IR
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "IR")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.RAMAN
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "RAMAN")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.UVVIS
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "UV/VIS")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.HPLC_UVVIS
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "HPLC UV/VIS")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.TGA
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "TGA (THERMOGRAVIMETRIC ANALYSIS)")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.XRD
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "XRD (X-RAY DIFFRACTION)")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.H1
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "1"), "H")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.C13
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "13"), "C")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.F19
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "19"), "F")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.P31
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "31"), "P")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.N15
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "15"), "N")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.Si29
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "29"), "Si")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.MS
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "MS")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "CV (CYCLIC VOLTAMMETRY)")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.CDS
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "CDS (CIRCULAR DICHROISM SPECTROSCOPY)")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: _list_layout.LIST_LAYOUT.SEC
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "SEC"))));
};
const Layout = _ref => {
  let {
    classes,
    feature,
    hasEdit,
    layoutSt,
    shiftRefSt,
    setShiftRefAct,
    updateLayoutAct
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.groupRight
  }, layoutSelect(classes, layoutSt, updateLayoutAct), shiftSelect(classes, layoutSt, shiftRefSt, setShiftRefAct), /*#__PURE__*/_react.default.createElement(_r02_scan.default, {
    feature: feature,
    hasEdit: hasEdit
  }));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  shiftRefSt: state.shift.ref
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setShiftRefAct: _shift.setShiftRef,
  updateLayoutAct: _layout.updateLayout
}, dispatch);
Layout.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  hasEdit: _propTypes.default.bool.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  shiftRefSt: _propTypes.default.object.isRequired,
  setShiftRefAct: _propTypes.default.func.isRequired,
  updateLayoutAct: _propTypes.default.func.isRequired
};
var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(Layout));
exports.default = _default;