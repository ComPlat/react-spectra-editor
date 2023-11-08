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
var _submit = require("../../actions/submit");
var _r05_submit_btn = _interopRequireDefault(require("./r05_submit_btn"));
var _r06_predict_btn = _interopRequireDefault(require("./r06_predict_btn"));
var _common = require("./common");
var _format = _interopRequireDefault(require("../../helpers/format"));
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */

const styles = () => Object.assign({
  fieldOrder: {
    width: 90
  },
  fieldIntensity: {
    width: 90
  },
  fieldDecimal: {
    width: 80
  },
  fieldOpertaion: {
    width: 120
  }
}, _common.commonStyle);
const ascendSelect = (classes, hideSwitch, isAscendSt, toggleIsAscendAct) => {
  if (hideSwitch) return null;
  return /*#__PURE__*/_react.default.createElement(_FormControl.default, {
    className: (0, _classnames.default)(classes.fieldOrder),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_InputLabel.default, {
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Write Peaks"), /*#__PURE__*/_react.default.createElement(_Select.default, {
    value: isAscendSt,
    onChange: toggleIsAscendAct,
    input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-order'),
      labelWidth: 90
    })
  }, /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: true,
    key: "ascend"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-ascend')
  }, "Ascend")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: false,
    key: "descend"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-descend')
  }, "Descend"))));
};
const intensitySelect = (classes, hideSwitch, isIntensitySt, toggleIsIntensityAct) => {
  if (hideSwitch) return null;
  return /*#__PURE__*/_react.default.createElement(_FormControl.default, {
    className: (0, _classnames.default)(classes.fieldIntensity),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_InputLabel.default, {
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Write Intensity"), /*#__PURE__*/_react.default.createElement(_Select.default, {
    value: isIntensitySt,
    onChange: toggleIsIntensityAct,
    input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-intensity'),
      labelWidth: 100
    })
  }, /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: true,
    key: "ascend"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-show')
  }, "Show")), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: false,
    key: "descend"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-hide')
  }, "Hide"))));
};
const decimalSelect = (classes, hideSwitch, decimalSt, updateDecimalAct) => {
  if (hideSwitch) return null;
  const decimals = [0, 1, 2, 3, 4];
  const options = decimals.map(d => /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: d,
    key: d
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-decimal')
  }, d)));
  return /*#__PURE__*/_react.default.createElement(_FormControl.default, {
    className: (0, _classnames.default)(classes.fieldDecimal),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_InputLabel.default, {
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Decimal"), /*#__PURE__*/_react.default.createElement(_Select.default, {
    value: decimalSt,
    onChange: updateDecimalAct,
    input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-decimal'),
      labelWidth: 60
    })
  }, options));
};
const operationSelect = (classes, operations, operation, onChangeSelect) => {
  const options = operations.map(o => /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: o.name,
    key: o.name
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-operation')
  }, o.name)));
  const selectedValue = operation.name || operations[0].name;
  return /*#__PURE__*/_react.default.createElement(_FormControl.default, {
    className: (0, _classnames.default)(classes.fieldOpertaion),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_InputLabel.default, {
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Submit"), /*#__PURE__*/_react.default.createElement(_Select.default, {
    value: selectedValue,
    onChange: onChangeSelect,
    input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-operation'),
      labelWidth: 50
    })
  }, options));
};
const selectOperation = (name, operations, updateOperationAct) => {
  let operation = false;
  operations.forEach(o => {
    if (o.name === name) {
      operation = o;
    }
  });
  updateOperationAct(operation);
};
const Submit = _ref => {
  let {
    operations,
    classes,
    feature,
    forecast,
    editorOnly,
    hideSwitch,
    disabled,
    isAscendSt,
    isIntensitySt,
    operationSt,
    decimalSt,
    isEmWaveSt,
    toggleIsAscendAct,
    toggleIsIntensityAct,
    updateOperationAct,
    updateDecimalAct
  } = _ref;
  const onChangeSelect = e => selectOperation(e.target.value, operations, updateOperationAct);
  if (!operations || operations.length === 0) return null;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.groupRightMost
  }, ascendSelect(classes, hideSwitch, isAscendSt, toggleIsAscendAct), intensitySelect(classes, hideSwitch || !isEmWaveSt, isIntensitySt, toggleIsIntensityAct), decimalSelect(classes, hideSwitch, decimalSt, updateDecimalAct), editorOnly ? null : /*#__PURE__*/_react.default.createElement(_r06_predict_btn.default, {
    feature: feature,
    forecast: forecast
  }), operationSelect(classes, operations, operationSt, onChangeSelect), /*#__PURE__*/_react.default.createElement(_r05_submit_btn.default, {
    feature: feature,
    isAscend: isAscendSt,
    isIntensity: isIntensitySt,
    operation: operationSt,
    disabled: disabled
  }));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  isEmWaveSt: _format.default.isEmWaveLayout(state.layout),
  isAscendSt: state.submit.isAscend,
  isIntensitySt: state.submit.isIntensity,
  decimalSt: state.submit.decimal,
  operationSt: state.submit.operation
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  toggleIsAscendAct: _submit.toggleIsAscend,
  toggleIsIntensityAct: _submit.toggleIsIntensity,
  updateOperationAct: _submit.updateOperation,
  updateDecimalAct: _submit.updateDecimal
}, dispatch);
Submit.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  forecast: _propTypes.default.object.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  operations: _propTypes.default.array.isRequired,
  operationSt: _propTypes.default.object.isRequired,
  hideSwitch: _propTypes.default.bool.isRequired,
  disabled: _propTypes.default.bool.isRequired,
  isAscendSt: _propTypes.default.bool.isRequired,
  isIntensitySt: _propTypes.default.bool.isRequired,
  isEmWaveSt: _propTypes.default.bool.isRequired,
  decimalSt: _propTypes.default.number.isRequired,
  toggleIsAscendAct: _propTypes.default.func.isRequired,
  toggleIsIntensityAct: _propTypes.default.func.isRequired,
  updateOperationAct: _propTypes.default.func.isRequired,
  updateDecimalAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Submit);