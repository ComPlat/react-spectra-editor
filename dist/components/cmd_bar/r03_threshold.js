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
var _CloudDoneOutlined = _interopRequireDefault(require("@mui/icons-material/CloudDoneOutlined"));
var _HowToRegOutlined = _interopRequireDefault(require("@mui/icons-material/HowToRegOutlined"));
var _RefreshOutlined = _interopRequireDefault(require("@mui/icons-material/RefreshOutlined"));
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _threshold = require("../../actions/threshold");
var _common = require("./common");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */

const styles = () => Object.assign({
  field: {
    width: 110
  },
  txtIcon: {}
}, _common.commonStyle);
const txtPercent = () => /*#__PURE__*/_react.default.createElement(_material.InputAdornment, {
  position: "end"
}, /*#__PURE__*/_react.default.createElement("span", {
  className: "txt-percent"
}, "%"));
const setThreshold = (classes, thresVal, updateThresholdValueAct, curveSt) => {
  const {
    curveIdx
  } = curveSt;
  const onBlur = e => updateThresholdValueAct({
    value: e.target.value,
    curveIdx
  });
  const onChange = e => updateThresholdValueAct({
    value: e.target.value,
    curveIdx
  });
  const onEnterPress = e => {
    if (e.key === 'Enter') {
      updateThresholdValueAct({
        value: e.target.value,
        curveIdx
      });
    }
  };
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_material.TextField, {
    className: classes.field,
    id: "outlined-name",
    placeholder: "N.A.",
    type: "number",
    value: thresVal || 0.01,
    margin: "none",
    InputProps: {
      endAdornment: txtPercent(),
      className: (0, _classnames.default)(classes.txtInput, 'txtfield-sv-bar-input'),
      inputProps: {
        min: 0.01
      }
    },
    onChange: onChange,
    onBlur: onBlur,
    onKeyPress: onEnterPress,
    variant: "outlined"
  }), /*#__PURE__*/_react.default.createElement(_material.InputLabel, {
    className: (0, _classnames.default)(classes.txtLabelBottomInput)
  }, "Threshold"));
};
const restoreIcon = (classes, hasEdit, isEdit) => hasEdit && isEdit ? /*#__PURE__*/_react.default.createElement(_HowToRegOutlined.default, {
  className: classes.icon
}) : /*#__PURE__*/_react.default.createElement(_CloudDoneOutlined.default, {
  className: classes.icon
});
const restoreTp = (hasEdit, isEdit) => hasEdit && isEdit ? 'User Defined Threshold' : 'Auto Picked Threshold';
const Threshold = _ref => {
  let {
    classes,
    feature,
    hasEdit,
    hideThresSt,
    thresValSt,
    isEditSt,
    curveSt,
    hplcMsSt,
    updateThresholdValueAct,
    resetThresholdValueAct,
    toggleThresholdIsEditAct
  } = _ref;
  const thresVal = thresValSt || (feature ? feature.thresRef : hplcMsSt.threshold.value);
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.groupRight
  }, setThreshold(classes, thresVal, updateThresholdValueAct, curveSt), /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Restore Threshold")
  }, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)('btn-sv-bar-thresref'),
    disabled: _cfg.default.btnCmdThres(thresVal),
    onClick: resetThresholdValueAct
  }, /*#__PURE__*/_react.default.createElement(_RefreshOutlined.default, {
    className: classes.icon
  }))), hideThresSt ? null : /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, restoreTp(hasEdit, isEditSt))
  }, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)('btn-sv-bar-thresrst'),
    disabled: _cfg.default.btnCmdThres(thresVal),
    onClick: toggleThresholdIsEditAct
  }, restoreIcon(classes, hasEdit, isEditSt))));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  hideThresSt: _cfg.default.hideCmdThres(state.layout),
  isEditSt: state.threshold.list[state.curve.curveIdx].isEdit,
  thresValSt: parseFloat(state.threshold.list[state.curve.curveIdx].value) || 0,
  curveSt: state.curve,
  hplcMsSt: state.hplcMs
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  updateThresholdValueAct: _threshold.updateThresholdValue,
  resetThresholdValueAct: _threshold.resetThresholdValue,
  toggleThresholdIsEditAct: _threshold.toggleThresholdIsEdit
}, dispatch);
Threshold.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  hasEdit: _propTypes.default.bool.isRequired,
  hideThresSt: _propTypes.default.bool.isRequired,
  isEditSt: _propTypes.default.bool.isRequired,
  thresValSt: _propTypes.default.number.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  updateThresholdValueAct: _propTypes.default.func.isRequired,
  resetThresholdValueAct: _propTypes.default.func.isRequired,
  toggleThresholdIsEditAct: _propTypes.default.func.isRequired,
  hplcMsSt: _propTypes.default.bool.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(Threshold));