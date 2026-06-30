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
var _integration_draft = require("../../helpers/integration_draft.js");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _tri_btn = _interopRequireDefault(require("./tri_btn"));
var _common = require("./common");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _list_layout = require("../../constants/list_layout");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */

// eslint-disable-line import/extensions

const styles = () => Object.assign({
  field: {
    width: 80
  },
  txtIcon: {},
  cancelBtn: {
    borderColor: '#d32f2f',
    color: '#d32f2f',
    '&:hover': {
      backgroundColor: '#ffebee'
    }
  }
}, _common.commonStyle);
const iconSize = '16px';
const setFactor = (classes, integrationSt, setIntegrationFkrAct, curveIdx) => {
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_TextField.default, {
    className: classes.field,
    id: "intg-factor-name",
    type: "number",
    value: refFactor,
    margin: "none",
    InputProps: {
      className: (0, _classnames.default)(classes.txtInput, 'txtfield-sv-bar-input')
    },
    label: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.txtLabel, 'txtfield-sv-bar-label'),
      children: "Ref Area"
    }),
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
  showIntegSplitToolsSt,
  isDisableSt,
  isFocusAddIntgSt,
  isFocusRmIntgSt,
  isFocusSetRefSt,
  isFocusSplitIntgSt,
  isFocusVisualSplitIntgSt,
  setUiSweepTypeAct,
  setIntegrationFkrAct,
  clearIntegrationAllAct,
  curveSt,
  integrationSt,
  clearIntegrationAllHplcMsAct,
  layoutSt
}) => {
  const {
    curveIdx
  } = curveSt;
  const onCancelTool = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN, curveIdx);
  const onSweepIntegtAdd = () => {
    if (isFocusAddIntgSt) {
      (0, _integration_draft.clearPendingIntegrationDraft)();
      onCancelTool();
      return;
    }
    setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD, curveIdx);
  };
  const onSweepIntegtRm = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_RM);
  const onSweepIntegtSR = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF);
  const onClearAll = () => {
    if (layoutSt === _list_layout.LIST_LAYOUT.LC_MS) {
      clearIntegrationAllHplcMsAct();
    } else {
      clearIntegrationAllAct({
        curveIdx
      });
    }
  };
  const onSweepIntegtSplit = () => {
    if (isFocusSplitIntgSt) {
      onCancelTool();
      return;
    }
    setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SPLIT, curveIdx);
  };
  const onSweepIntegtVisualSplit = () => {
    if (isFocusVisualSplitIntgSt) {
      onCancelTool();
      return;
    }
    setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_VISUAL_SPLIT, curveIdx);
  };
  if (isDisableSt) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.group,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Add Integration"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_common.MuButton, {
          className: (0, _classnames.default)(isFocusAddIntgSt ? classes.cancelBtn : (0, _common.focusStyle)(false, classes), 'btn-add-inter'),
          onClick: onSweepIntegtAdd,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_react2.default, {
            path: isFocusAddIntgSt ? _js.mdiClose : _js.mdiMathIntegral,
            size: iconSize,
            color: iconColor(isFocusAddIntgSt),
            className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-addint')
          }), isFocusAddIntgSt ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-addint'),
            children: "+"
          })]
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Remove Integration"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isFocusRmIntgSt, classes), 'btn-remove-inter'),
          onClick: onSweepIntegtRm,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_react2.default, {
            path: _js.mdiMathIntegral,
            size: iconSize,
            color: iconColor(isFocusRmIntgSt),
            className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-rmint')
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-rmint'),
            children: "-"
          })]
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Set Integration Reference"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isFocusSetRefSt, classes), 'btn-set-inter-ref'),
          onClick: onSweepIntegtSR,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_react2.default, {
            path: _js.mdiReflectVertical,
            size: iconSize,
            color: iconColor(isFocusSetRefSt),
            className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-refint')
          })
        })
      })
    }), showIntegSplitToolsSt ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Split Integration"
        }),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_common.MuButton, {
            className: (0, _classnames.default)(isFocusSplitIntgSt ? classes.cancelBtn : (0, _common.focusStyle)(false, classes), 'btn-split-inter'),
            onClick: onSweepIntegtSplit,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_react2.default, {
              path: isFocusSplitIntgSt ? _js.mdiClose : _js.mdiMathIntegral,
              size: iconSize,
              color: isFocusSplitIntgSt ? '#d32f2f' : iconColor(false),
              className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-splitint')
            }), isFocusSplitIntgSt ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
              className: (0, _classnames.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-splitint'),
              children: "/"
            })]
          })
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Visual Split Integration"
        }),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_common.MuButton, {
            className: (0, _classnames.default)(isFocusVisualSplitIntgSt ? classes.cancelBtn : (0, _common.focusStyle)(false, classes), 'btn-visual-split-inter'),
            onClick: onSweepIntegtVisualSplit,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_react2.default, {
              path: isFocusVisualSplitIntgSt ? _js.mdiClose : _js.mdiMathIntegral,
              size: iconSize,
              color: isFocusVisualSplitIntgSt ? '#d32f2f' : iconColor(false),
              className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-visualsplitint')
            }), isFocusVisualSplitIntgSt ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
              className: (0, _classnames.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-visualsplitint'),
              children: "|"
            })]
          })
        })
      })]
    }) : null, !ignoreRef ? setFactor(classes, integrationSt, setIntegrationFkrAct, curveIdx) : null, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_tri_btn.default, {
      content: {
        tp: 'Clear All Integration'
      },
      cb: onClearAll,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_react2.default, {
        path: _js.mdiMathIntegral,
        size: iconSize,
        color: iconColor(false),
        className: (0, _classnames.default)(classes.iconMdi, 'icon-sv-bar-rmallint')
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: (0, _classnames.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-rmallint'),
        children: "x"
      })]
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  isDisableSt: _cfg.default.btnCmdIntg(state.layout),
  isFocusAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  isFocusRmIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_RM,
  isFocusSetRefSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF,
  isFocusSplitIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SPLIT,
  isFocusVisualSplitIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_VISUAL_SPLIT,
  ignoreRef: _format.default.isHplcUvVisLayout(state.layout),
  showIntegSplitToolsSt: _cfg.default.showIntegSplitTools(state.layout),
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
  isFocusSplitIntgSt: _propTypes.default.bool.isRequired,
  isFocusVisualSplitIntgSt: _propTypes.default.bool.isRequired,
  ignoreRef: _propTypes.default.bool.isRequired,
  showIntegSplitToolsSt: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  setIntegrationFkrAct: _propTypes.default.func.isRequired,
  clearIntegrationAllAct: _propTypes.default.func.isRequired,
  clearIntegrationAllHplcMsAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  integrationSt: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(Integration));