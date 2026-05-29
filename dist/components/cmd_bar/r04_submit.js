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
var _styles = require("@mui/styles");
var _ArrowDropDownRounded = _interopRequireDefault(require("@mui/icons-material/ArrowDropDownRounded"));
var _submit = require("../../actions/submit");
var _r05_submit_btn = _interopRequireDefault(require("./r05_submit_btn"));
var _r06_predict_btn = _interopRequireDefault(require("./r06_predict_btn"));
var _common = require("./common");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _jsxRuntime = require("react/jsx-runtime");
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
  },
  splitSubmitWrap: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    margin: '0 0 0 2px',
    position: 'relative',
    verticalAlign: 'middle'
  },
  splitSubmitLabel: {
    backgroundColor: '#fff',
    color: '#66727c',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 10,
    left: 8,
    lineHeight: 1.3,
    padding: '0 4px',
    position: 'absolute',
    top: -6,
    zIndex: 1
  },
  splitSubmitMain: {
    borderRadius: '6px 0 0 6px',
    borderRight: 'none',
    justifyContent: 'space-between',
    margin: '0 !important',
    minWidth: 116,
    padding: '0 8px',
    width: 116
  },
  splitSubmitText: {
    color: '#25313b',
    display: 'block',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 12,
    overflow: 'hidden',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%'
  },
  splitSubmitArrow: {
    borderRadius: '0 6px 6px 0',
    margin: '0 !important',
    minWidth: 28,
    width: 28
  },
  splitMenuItem: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 12
  },
  splitSelected: {
    color: '#0b5cad',
    fontWeight: 700
  }
}, _common.commonStyle);
const ascendSelect = (classes, hideSwitch, isAscendSt, toggleIsAscendAct) => {
  if (hideSwitch) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldOrder),
    variant: "outlined",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-sort-peaks-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Write Peaks"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Select, {
      labelId: "select-sort-peaks-label",
      label: "Write Peaks",
      value: isAscendSt,
      onChange: toggleIsAscendAct,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-order'),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: true,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-ascend'),
          children: "Ascend"
        })
      }, "ascend"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: false,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-descend'),
          children: "Descend"
        })
      }, "descend")]
    })]
  });
};
const intensitySelect = (classes, hideSwitch, isIntensitySt, toggleIsIntensityAct) => {
  if (hideSwitch) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldIntensity),
    variant: "outlined",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-intensity-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Write Intensity"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Select, {
      labelId: "select-intensity-label",
      label: "Write Intensity",
      value: isIntensitySt,
      onChange: toggleIsIntensityAct,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-intensity')
      // input={
      //   (
      //     <OutlinedInput
      //       className={classNames(classes.selectInput, 'input-sv-bar-intensity')}
      //       labelWidth={100}
      //     />
      //   )
      // }
      ,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: true,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-show'),
          children: "Show"
        })
      }, "ascend"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: false,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-hide'),
          children: "Hide"
        })
      }, "descend")]
    })]
  });
};
const decimalSelect = (classes, hideSwitch, decimalSt, updateDecimalAct) => {
  if (hideSwitch) return null;
  const decimals = [0, 1, 2, 3, 4];
  const options = decimals.map(d => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
    value: d,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-decimal'),
      children: d
    })
  }, d));
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldDecimal),
    variant: "outlined",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-decimal-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Decimal"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: "select-decimal-label",
      label: "Decimal",
      value: decimalSt,
      onChange: updateDecimalAct,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-decimal')
      // input={
      //   (
      //     <OutlinedInput
      //       className={classNames(classes.selectInput, 'input-sv-bar-decimal')}
      //       labelWidth={60}
      //     />
      //   )
      // }
      ,
      children: options
    })]
  });
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
const currentOperation = (operations, operation) => operations.find(o => o.name === operation.name) || operations[0];
const SubmitSplitButton = ({
  classes,
  operations,
  operation,
  feature,
  isAscend,
  isIntensity,
  disabled,
  updateOperationAct
}) => {
  const [anchorEl, setAnchorEl] = _react.default.useState(null);
  const selectedOperation = currentOperation(operations, operation);
  const open = Boolean(anchorEl);
  const onOpen = event => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);
  const onSelect = name => {
    selectOperation(name, operations, updateOperationAct);
    onClose();
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.splitSubmitWrap,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.splitSubmitLabel, 'select-sv-bar-label'),
      children: "Submit"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_common.MuButton, {
      className: classes.splitSubmitMain,
      onClick: onOpen,
      disabled: operations.length < 2,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: (0, _classnames.default)(classes.splitSubmitText, 'txt-sv-bar-submit'),
        children: selectedOperation.name
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ArrowDropDownRounded.default, {
        className: classes.icon
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r05_submit_btn.default, {
      className: classes.splitSubmitArrow,
      feature: feature,
      isAscend: isAscend,
      isIntensity: isIntensity,
      operation: selectedOperation,
      disabled: disabled
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Menu, {
      anchorEl: anchorEl,
      open: open,
      onClose: onClose,
      children: operations.map(o => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        onClick: () => onSelect(o.name),
        className: (0, _classnames.default)(classes.splitMenuItem, o.name === selectedOperation.name && classes.splitSelected),
        children: o.name
      }, o.name))
    })]
  });
};
const Submit = ({
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
}) => {
  if (!operations || operations.length === 0) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.groupRightMost,
    children: [ascendSelect(classes, hideSwitch, isAscendSt, toggleIsAscendAct), intensitySelect(classes, hideSwitch || !isEmWaveSt, isIntensitySt, toggleIsIntensityAct), decimalSelect(classes, hideSwitch, decimalSt, updateDecimalAct), editorOnly ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_r06_predict_btn.default, {
      feature: feature,
      forecast: forecast
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(SubmitSplitButton, {
      classes: classes,
      operations: operations,
      operation: operationSt,
      feature: feature,
      isAscend: isAscendSt,
      isIntensity: isIntensitySt,
      disabled: disabled,
      updateOperationAct: updateOperationAct
    })]
  });
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
SubmitSplitButton.propTypes = {
  classes: _propTypes.default.object.isRequired,
  operations: _propTypes.default.array.isRequired,
  operation: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  isAscend: _propTypes.default.bool.isRequired,
  isIntensity: _propTypes.default.bool.isRequired,
  disabled: _propTypes.default.bool.isRequired,
  updateOperationAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Submit);