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
var _scan = require("../../actions/scan");
var _common = require("./common");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */

const styles = () => Object.assign({
  fieldScan: {
    width: 90
  }
}, _common.commonStyle);
const restoreIcon = (classes, hasEdit, isEdit) => hasEdit && isEdit ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_HowToRegOutlined.default, {
  className: classes.icon
}) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_CloudDoneOutlined.default, {
  className: classes.icon
});
const restoreTp = (hasEdit, isEdit) => hasEdit && isEdit ? 'User Defined Scan' : 'Auto Picked Scan';
const btnRestore = (classes, hasEdit, isEdit, toggleEditAct) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
  title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: "txt-sv-tp",
    children: restoreTp(hasEdit, isEdit)
  }),
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
    className: (0, _classnames.default)('btn-sv-bar-scanrst'),
    disabled: !hasEdit,
    onClick: toggleEditAct,
    children: restoreIcon(classes, hasEdit, isEdit)
  })
});
const btnRrfresh = (classes, disabled, refreshAct) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
  title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: "txt-sv-tp",
    children: "Refresh Scan"
  }),
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
    className: (0, _classnames.default)('btn-sv-bar-scanrfs'),
    disabled: disabled,
    onClick: refreshAct,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_RefreshOutlined.default, {
      className: classes.icon
    })
  })
});
const scanSelect = (classes, feature, layoutSt, scanSt, onChange) => {
  const {
    target,
    count
  } = scanSt;
  if (!count) return null;
  const range = [...Array(count + 1).keys()].slice(1);
  const content = range.map(num => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
    value: num,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-scan'),
      children: `scan ${num}`
    })
  }, num));
  const defaultValue = scanSt.isAuto || !feature.scanEditTarget ? feature.scanAutoTarget : feature.scanEditTarget;
  const selValue = target || defaultValue || 1;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldScan),
    variant: "outlined",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-scan-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Current Scan"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: "select-scan-label",
      label: "Current Scan",
      value: selValue,
      onChange: onChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-scan'),
      children: content
    })]
  });
};
const Scan = ({
  classes,
  feature,
  hasEdit,
  layoutSt,
  scanSt,
  setScanTargetAct,
  resetScanTargetAct,
  toggleScanIsAutoAct
}) => {
  const isMs = ['MS'].indexOf(layoutSt) >= 0;
  if (!isMs) return null;
  const onChange = e => setScanTargetAct(e.target.value);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    children: [scanSelect(classes, feature, layoutSt, scanSt, onChange), btnRrfresh(classes, false, resetScanTargetAct), btnRestore(classes, hasEdit, !scanSt.isAuto, toggleScanIsAutoAct)]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  scanSt: state.scan
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setScanTargetAct: _scan.setScanTarget,
  resetScanTargetAct: _scan.resetScanTarget,
  toggleScanIsAutoAct: _scan.toggleScanIsAuto
}, dispatch);
Scan.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  hasEdit: _propTypes.default.bool.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  scanSt: _propTypes.default.object.isRequired,
  setScanTargetAct: _propTypes.default.func.isRequired,
  resetScanTargetAct: _propTypes.default.func.isRequired,
  toggleScanIsAutoAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Scan);