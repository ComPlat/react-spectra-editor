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
var _TextField = _interopRequireDefault(require("@mui/material/TextField"));
var _react2 = _interopRequireDefault(require("@mdi/react"));
var _js = require("@mdi/js");
var _integration = require("../../actions/integration");
var _hplc_ms = require("../../actions/hplc_ms");
var _ui = require("../../actions/ui");
var _list_ui = require("../../constants/list_ui");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _tri_btn = _interopRequireDefault(require("./tri_btn"));
var _common = require("./common");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _list_layout = require("../../constants/list_layout");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */

const styles = () => Object.assign({
  field: {
    width: 80
  },
  txtIcon: {}
}, _common.commonStyle);
const iconSize = '16px';
const setFactor = (classes, isDisable, integrationSt, setIntegrationFkrAct, curveIdx) => {
  const onFactorChanged = e => {
    e.target.blur();
    setIntegrationFkrAct({
      factor: e.target.value,
      curveIdx
    });
  };
  const onEnterPress = e => {
    if (e.key === 'Enter') {
      setIntegrationFkrAct({
        factor: e.target.value,
        curveIdx
      });
    }
  };
  let refFactor = 1.00;
  const {
    integrations
  } = integrationSt;
  if (integrations && curveIdx < integrations.length) {
    const selectedIntegration = integrations[curveIdx];
    refFactor = selectedIntegration.refFactor || 1.00;
  }
  return /*#__PURE__*/_react.default.createElement(_TextField.default, {
    className: classes.field,
    disabled: isDisable,
    id: "intg-factor-name",
    type: "number",
    value: refFactor,
    margin: "none",
    InputProps: {
      className: (0, _classnames.default)(classes.txtInput, 'txtfield-sv-bar-input')
    },
    label: /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txtLabel, 'txtfield-sv-bar-label')
    }, "Ref Area"),
    onChange: onFactorChanged,
    onBlur: onFactorChanged,
    onKeyUp: onEnterPress,
    variant: "outlined"
  });
};
const iconColor = criteria => criteria ? '#fff' : '#000';
const Integration = ({
  classes,
  ignoreRef,
  isDisableSt,
  isFocusAddIntgSt,
  isFocusRmIntgSt,
  isFocusSetRefSt,
  setUiSweepTypeAct,
  setIntegrationFkrAct,
  clearIntegrationAllAct,
  curveSt,
  integrationSt,
  clearIntegrationAllHplcMsAct,
  layoutSt
}) => {
  const onSweepIntegtAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD);
  const onSweepIntegtRm = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_RM);
  const onSweepIntegtSR = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF);
  const {
    curveIdx
  } = curveSt;
  const onClearAll = () => {
    if (layoutSt === _list_layout.LIST_LAYOUT.LC_MS) {
      clearIntegrationAllHplcMsAct();
    } else {
      clearIntegrationAllAct({
        curveIdx
      });
    }
  };
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.group
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Add Integration")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusAddIntgSt, classes), 'btn-add-inter'),
    disabled: isDisableSt,
    onClick: onSweepIntegtAdd
  }, /*#__PURE__*/_react.default.createElement(_react2.default, {
    path: _js.mdiMathIntegral,
    size: iconSize,
    color: iconColor(isFocusAddIntgSt || isDisableSt),
    className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-addint')
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-addint')
  }, "+")))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Remove Integration")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusRmIntgSt, classes), 'btn-remove-inter'),
    disabled: isDisableSt,
    onClick: onSweepIntegtRm
  }, /*#__PURE__*/_react.default.createElement(_react2.default, {
    path: _js.mdiMathIntegral,
    size: iconSize,
    color: iconColor(isFocusRmIntgSt || isDisableSt),
    className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-rmint')
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-rmint')
  }, "-")))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Set Integration Reference")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isFocusSetRefSt, classes), 'btn-set-inter-ref'),
    disabled: isDisableSt,
    onClick: onSweepIntegtSR
  }, /*#__PURE__*/_react.default.createElement(_react2.default, {
    path: _js.mdiReflectVertical,
    size: iconSize,
    color: iconColor(isFocusSetRefSt || isDisableSt),
    className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-refint')
  })))), !ignoreRef ? setFactor(classes, isDisableSt, integrationSt, setIntegrationFkrAct, curveIdx) : null, /*#__PURE__*/_react.default.createElement(_tri_btn.default, {
    content: {
      tp: 'Clear All Integration'
    },
    cb: onClearAll
  }, /*#__PURE__*/_react.default.createElement(_react2.default, {
    path: _js.mdiMathIntegral,
    size: iconSize,
    color: iconColor(isDisableSt),
    className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-rmallint')
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-rmallint')
  }, "x")));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  isDisableSt: _cfg.default.btnCmdIntg(state.layout),
  isFocusAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  isFocusRmIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_RM,
  isFocusSetRefSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF,
  ignoreRef: _format.default.isHplcUvVisLayout(state.layout),
  curveSt: state.curve,
  integrationSt: state.integration.present,
  layoutSt: state.layout
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiSweepTypeAct: _ui.setUiSweepType,
  setIntegrationFkrAct: _integration.setIntegrationFkr,
  clearIntegrationAllAct: _integration.clearIntegrationAll,
  clearIntegrationAllHplcMsAct: _hplc_ms.clearIntegrationAllHplcMs
}, dispatch);
Integration.propTypes = {
  classes: _propTypes.default.object.isRequired,
  isDisableSt: _propTypes.default.bool.isRequired,
  isFocusAddIntgSt: _propTypes.default.bool.isRequired,
  isFocusRmIntgSt: _propTypes.default.bool.isRequired,
  isFocusSetRefSt: _propTypes.default.bool.isRequired,
  ignoreRef: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  setIntegrationFkrAct: _propTypes.default.func.isRequired,
  clearIntegrationAllAct: _propTypes.default.func.isRequired,
  clearIntegrationAllHplcMsAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  integrationSt: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(Integration));