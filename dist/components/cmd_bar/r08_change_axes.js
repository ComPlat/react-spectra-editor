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
var _jsxRuntime = require("react/jsx-runtime");
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
const axisX = (classes, layoutSt, axesUnitsSt, updateXAxisAct, curveSt) => {
  const optionsAxisX = _list_axes.LIST_AXES.x;
  const options = optionsAxisX[layoutSt];
  const {
    curveIdx
  } = curveSt;
  const onChange = e => updateXAxisAct({
    value: e.target.value,
    curveIndex: curveIdx
  });
  const {
    axes
  } = axesUnitsSt;
  let selectedAxes = axes[curveIdx];
  if (!selectedAxes) {
    selectedAxes = {
      xUnit: '',
      yUnit: ''
    };
  }
  const {
    xUnit
  } = selectedAxes;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldLayout),
    variant: "outlined",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: "select-x-axis-label",
      label: "x-Axis",
      value: xUnit,
      onChange: onChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout'),
      children: options.map(item => {
        // eslint-disable-line
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
          value: item,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
            children: item === '' ? 'Default' : item
          })
        }, item);
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-x-axis-label",
      className: (0, _classnames.default)(classes.txtLabelTopInput),
      children: "x-Axis"
    })]
  });
};
const axisY = (classes, layoutSt, axesUnitsSt, updateYAxisAct, curveSt) => {
  const optionsAxisX = _list_axes.LIST_AXES.y;
  const options = optionsAxisX[layoutSt];
  const {
    curveIdx
  } = curveSt;
  const onChange = e => updateYAxisAct({
    value: e.target.value,
    curveIndex: curveIdx
  });
  const {
    axes
  } = axesUnitsSt;
  let selectedAxes = axes[curveIdx];
  if (!selectedAxes) {
    selectedAxes = {
      xUnit: '',
      yUnit: ''
    };
  }
  const {
    yUnit
  } = selectedAxes;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldLayout),
    variant: "outlined",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: "select-y-axis-label",
      label: "y-Axis",
      value: yUnit,
      onChange: onChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout'),
      children: options.map(item => {
        // eslint-disable-line
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
          value: item,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
            children: item === '' ? 'Default' : item
          })
        }, item);
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-y-axis-label",
      className: (0, _classnames.default)(classes.txtLabelTopInput),
      children: "y-Axis"
    })]
  });
};
const showSelect = (classes, layoutSt, curveSt, axesUnitsSt, updateXAxisAct, updateYAxisAct) => {
  if (!listLayoutToShow.includes(layoutSt)) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {});
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    children: [axisX(classes, layoutSt, axesUnitsSt, updateXAxisAct, curveSt), axisY(classes, layoutSt, axesUnitsSt, updateYAxisAct, curveSt)]
  });
};
const ChangeAxes = ({
  classes,
  layoutSt,
  curveSt,
  axesUnitsSt,
  updateXAxisAct,
  updateYAxisAct
}) => /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
  className: classes.groupRight,
  "data-testid": "ChangeAxes",
  children: showSelect(classes, layoutSt, curveSt, axesUnitsSt, updateXAxisAct, updateYAxisAct)
});
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
  curveSt: _propTypes.default.object.isRequired,
  axesUnitsSt: _propTypes.default.object.isRequired,
  updateXAxisAct: _propTypes.default.func.isRequired,
  updateYAxisAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(ChangeAxes));