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
var _common = require("./common");
var _list_layout = require("../../constants/list_layout");
var _list_axes = require("../../constants/list_axes");
var _axes = require("../../actions/axes");
/* eslint-disable prefer-object-spread, react/jsx-one-expression-per-line,
react/function-component-definition,
max-len, no-unused-vars, no-multiple-empty-lines */

const listLayoutToShow = [_list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY];
const styles = () => Object.assign({
  fieldShift: {
    width: 160
  },
  fieldLayout: {
    width: 100
  }
}, _common.commonStyle);
const axisX = (classes, layoutSt, axesUnitsSt, updateXAxisAct) => {
  const optionsAxisX = _list_axes.LIST_AXES.x;
  const options = optionsAxisX[layoutSt];
  const onChange = e => updateXAxisAct(e.target.value);
  const {
    xUnit
  } = axesUnitsSt;
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldLayout),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_material.Select, {
    labelId: "select-x-axis-label",
    label: "x-Axis",
    value: xUnit,
    onChange: onChange,
    className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout')
  }, options.map(item => {
    // eslint-disable-line
    return /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
      value: item,
      key: item
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
    }, item === '' ? 'Default' : item));
  })), /*#__PURE__*/_react.default.createElement(_material.InputLabel, {
    id: "select-x-axis-label",
    className: (0, _classnames.default)(classes.txtLabelTopInput)
  }, "x-Axis"));
};
const axisY = (classes, layoutSt, axesUnitsSt, updateYAxisAct) => {
  const optionsAxisX = _list_axes.LIST_AXES.y;
  const options = optionsAxisX[layoutSt];
  const onChange = e => updateYAxisAct(e.target.value);
  const {
    yUnit
  } = axesUnitsSt;
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    "data-testid": "ChangeAxes",
    className: (0, _classnames.default)(classes.fieldLayout),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_material.Select, {
    labelId: "select-y-axis-label",
    label: "y-Axis",
    value: yUnit,
    onChange: onChange,
    className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout')
  }, options.map(item => {
    // eslint-disable-line
    return /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
      value: item,
      key: item
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout')
    }, item === '' ? 'Default' : item));
  })), /*#__PURE__*/_react.default.createElement(_material.InputLabel, {
    id: "select-y-axis-label",
    className: (0, _classnames.default)(classes.txtLabelTopInput)
  }, "y-Axis"));
};
const showSelect = (classes, layoutSt, curveSt, axesUnitsSt, updateXAxisAct, updateYAxisActt) => {
  if (!listLayoutToShow.includes(layoutSt)) {
    return /*#__PURE__*/_react.default.createElement("i", null);
  }
  return /*#__PURE__*/_react.default.createElement("span", null, axisX(classes, layoutSt, axesUnitsSt, updateXAxisAct), axisY(classes, layoutSt, axesUnitsSt, updateYAxisActt));
};
const ChangeAxes = _ref => {
  let {
    classes,
    layoutSt,
    curveSt,
    axesUnitsSt,
    updateXAxisAct,
    updateYAxisAct
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.groupRight,
    "data-testid": "ChangeAxes"
  }, showSelect(classes, layoutSt, curveSt, axesUnitsSt, updateXAxisAct, updateYAxisAct));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  curveSt: state.curve,
  axesUnitsSt: state.axesUnits
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  updateXAxisAct: _axes.updateXAxis,
  updateYAxisAct: _axes.updateYAxis
}, dispatch);
ChangeAxes.propTypes = {
  classes: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  curveSt: _propTypes.default.string.isRequired,
  axesUnitsSt: _propTypes.default.object.isRequired,
  updateXAxisAct: _propTypes.default.func.isRequired,
  updateYAxisAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(ChangeAxes));