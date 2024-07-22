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
var _material = require("@mui/material");
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _r02_scan = _interopRequireDefault(require("./r02_scan"));
var _layout = require("../../actions/layout");
var _shift = require("../../actions/shift");
var _list_layout = require("../../constants/list_layout");
var _list_shift = require("../../constants/list_shift");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _common = require("./common");
var _format = _interopRequireDefault(require("../../helpers/format"));
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
const shiftSelect = (classes, layoutSt, setShiftRefAct, shiftSt, curveSt) => {
  if (_cfg.default.hideSolvent(layoutSt)) return null;
  // const onChange = (e) => setShiftRefAct(e.target.value);
  const {
    curveIdx
  } = curveSt;
  const {
    shifts
  } = shiftSt;
  const selectedShift = shifts[curveIdx];
  const shiftRef = selectedShift.ref;
  const onChange = e => {
    const payload = {
      dataToSet: e.target.value,
      curveIdx
    };
    setShiftRefAct(payload);
  };
  const listShift = (0, _list_shift.getListShift)(layoutSt);
  const content = listShift.map(ref => /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: ref,
    key: ref.name
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-shift')
  }, `${ref.name}: ${_format.default.strNumberFixedDecimal(ref.value, 2)} ppm`)));
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldShift),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_material.InputLabel, {
    id: "select-solvent-label",
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Reference"), /*#__PURE__*/_react.default.createElement(_material.Select, {
    value: shiftRef,
    labelId: "select-solvent-label",
    label: "Solvent",
    onChange: onChange,
    className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-shift')
  }, content));
};
const layoutSelect = (classes, layoutSt, updateLayoutAct) => {
  const onChange = e => updateLayoutAct(e.target.value);
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldLayout)
  }, /*#__PURE__*/_react.default.createElement(_material.InputLabel, {
    id: "select-layout-label",
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Layout"), /*#__PURE__*/_react.default.createElement(_material.Select, {
    labelId: "select-layout-label",
    label: "Layout",
    value: layoutSt,
    onChange: onChange,
    className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.PLAIN
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "plain")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.IR
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "IR")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.RAMAN
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "RAMAN")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.UVVIS
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "UV/VIS")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.HPLC_UVVIS
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "HPLC UV/VIS")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.TGA
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "TGA (THERMOGRAVIMETRIC ANALYSIS)")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.DSC
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "DSC (DIFFERENTIAL SCANNING CALORIMETRY)")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.XRD
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "XRD (X-RAY DIFFRACTION)")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.H1
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "1"), "H")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.C13
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "13"), "C")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.F19
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "19"), "F")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.P31
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "31"), "P")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.N15
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "15"), "N")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.Si29
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, /*#__PURE__*/_react.default.createElement("sup", null, "29"), "Si")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.MS
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "MS")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "CV (CYCLIC VOLTAMMETRY)")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.CDS
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "CDS (CIRCULAR DICHROISM SPECTROSCOPY)")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.SEC
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "SEC")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.AIF
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "SORPTION-DESORPTION")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.EMISSIONS
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "EMISSIONS")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.DLS_ACF
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "DLS ACF")), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: _list_layout.LIST_LAYOUT.DLS_INTENSITY
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
  }, "DLS INTENSITY"))));
};
const Layout = _ref => {
  let {
    classes,
    feature,
    hasEdit,
    layoutSt,
    setShiftRefAct,
    updateLayoutAct,
    curveSt,
    shiftSt
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.groupRight
  }, layoutSelect(classes, layoutSt, updateLayoutAct), shiftSelect(classes, layoutSt, setShiftRefAct, shiftSt, curveSt), /*#__PURE__*/_react.default.createElement(_r02_scan.default, {
    feature: feature,
    hasEdit: hasEdit
  }));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  curveSt: state.curve,
  shiftSt: state.shift
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
  setShiftRefAct: _propTypes.default.func.isRequired,
  updateLayoutAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  shiftSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(Layout));