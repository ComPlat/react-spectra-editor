"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _classnames = _interopRequireDefault(require("classnames"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _material = require("@mui/material");
var _AddLocationOutlined = _interopRequireDefault(require("@mui/icons-material/AddLocationOutlined"));
var _ui = require("../../actions/ui");
var _common = require("./common");
var _list_ui = require("../../constants/list_ui");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _cyclic_voltammetry = require("../../actions/cyclic_voltammetry");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */

const styles = () => Object.assign({
  field: {
    width: 80
  },
  txtIcon: {}
}, _common.commonStyle);
const setRef = (classes, cyclicVotaSt, curveIdx, setCylicVoltaRefFactorAct) => {
  const {
    spectraList
  } = cyclicVotaSt;
  const spectra = spectraList[curveIdx];
  let refFactor = 0.0;
  let hasRefPeaks = false;
  if (spectra) {
    const {
      shift,
      hasRefPeak
    } = spectra;
    const {
      val
    } = shift;
    refFactor = val;
    hasRefPeaks = hasRefPeak;
  }
  const onFactorChanged = e => setCylicVoltaRefFactorAct({
    factor: e.target.value,
    curveIdx
  });
  const onEnterPress = e => {
    if (e.key === 'Enter') {
      setCylicVoltaRefFactorAct({
        factor: e.target.value,
        curveIdx
      });
    }
  };
  return /*#__PURE__*/_react.default.createElement(_material.TextField, {
    className: classes.field,
    id: "intg-factor-name",
    type: "number",
    value: refFactor,
    margin: "none",
    InputProps: {
      className: (0, _classnames.default)(classes.txtInput, 'txtfield-sv-bar-input')
    },
    label: /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txtLabel, 'txtfield-sv-bar-label')
    }, hasRefPeaks ? 'Ref Value (V)' : 'Shift'),
    variant: "outlined",
    onChange: onFactorChanged,
    onBlur: onFactorChanged,
    onKeyUp: onEnterPress
  });
};
const Pecker = ({
  classes,
  layoutSt,
  isFocusAddPeckerSt,
  isFocusRmPeckerSt,
  setUiSweepTypeAct,
  curveSt,
  cyclicVotaSt,
  setCylicVoltaRefFactorAct,
  isFocusSetRefSt,
  setCylicVoltaRefAct
}) => {
  const {
    curveIdx
  } = curveSt;
  const onSweepPeckerAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER, curveIdx);
  const onSweepPeckerDELETE = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER, curveIdx);
  const onConfirmSetRef = () => setCylicVoltaRefAct({
    jcampIdx: curveIdx
  });
  const {
    spectraList
  } = cyclicVotaSt;
  const spectra = spectraList[curveIdx];
  let hasRefPeaks = false;
  if (spectra) {
    const {
      hasRefPeak
    } = spectra;
    hasRefPeaks = hasRefPeak;
  }
  return !_cfg.default.hidePanelCyclicVolta(layoutSt) ? /*#__PURE__*/_react.default.createElement("span", {
    "data-testid": "Pecker"
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Add Pecker")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusAddPeckerSt, classes), 'btn-sv-bar-addpecker'),
    onClick: onSweepPeckerAdd
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-addpeak')
  }, "I", /*#__PURE__*/_react.default.createElement("sub", null, "\u03BB0"), "+")))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Remove Pecker")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusRmPeckerSt, classes), 'btn-sv-bar-rmpecker'),
    onClick: onSweepPeckerDELETE
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-rmpeak')
  }, "I", /*#__PURE__*/_react.default.createElement("sub", null, "\u03BB0"), "-")))), setRef(classes, cyclicVotaSt, curveIdx, setCylicVoltaRefFactorAct), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, hasRefPeaks ? 'Set Reference' : 'Set Shift')
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusSetRefSt, classes), 'btn-sv-bar-setref'),
    onClick: onConfirmSetRef
  }, /*#__PURE__*/_react.default.createElement(_AddLocationOutlined.default, {
    className: classes.icon
  }))))) : /*#__PURE__*/_react.default.createElement("span", null);
};
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  isFocusAddPeckerSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER,
  isFocusRmPeckerSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER,
  isFocusSetRefSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF,
  cyclicVotaSt: state.cyclicvolta,
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiSweepTypeAct: _ui.setUiSweepType,
  setCylicVoltaRefFactorAct: _cyclic_voltammetry.setCylicVoltaRefFactor,
  setCylicVoltaRefAct: _cyclic_voltammetry.setCylicVoltaRef
}, dispatch);
Pecker.propTypes = {
  classes: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  isFocusAddPeckerSt: _propTypes.default.bool.isRequired,
  isFocusRmPeckerSt: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  isFocusSetRefSt: _propTypes.default.bool.isRequired,
  cyclicVotaSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  setCylicVoltaRefFactorAct: _propTypes.default.func.isRequired,
  setCylicVoltaRefAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(Pecker);