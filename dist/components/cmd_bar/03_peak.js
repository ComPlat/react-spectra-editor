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
var _AddLocationOutlined = _interopRequireDefault(require("@mui/icons-material/AddLocationOutlined"));
var _ui = require("../../actions/ui");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _common = require("./common");
var _list_ui = require("../../constants/list_ui");
var _tri_btn = _interopRequireDefault(require("./tri_btn"));
var _edit_peak = require("../../actions/edit_peak");
var _extractPeaksEdit = require("../../helpers/extractPeaksEdit");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, function-paren-newline, no-unused-vars,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */

const styles = () => Object.assign({}, _common.commonStyle);
const Peak = ({
  classes,
  setUiSweepTypeAct,
  isFocusAddPeakSt,
  disableAddPeakSt,
  isFocusRmPeakSt,
  disableRmPeakSt,
  isFocusSetRefSt,
  disableSetRefSt,
  isHandleMaxAndMinPeaksSt,
  cyclicVotaSt,
  curveSt,
  clearAllPeaksAct,
  feature,
  editPeakSt,
  thresSt,
  shiftSt,
  layoutSt
}) => {
  let onSweepPeakAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.PEAK_ADD);
  let onSweepPeakDELETE = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.PEAK_DELETE);
  let onSweepAnchorShift = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT);
  const {
    curveIdx
  } = curveSt;
  const onClearAll = () => {
    const dataPeaks = (0, _extractPeaksEdit.extractAutoPeaks)(feature, thresSt, shiftSt, layoutSt);
    clearAllPeaksAct({
      curveIdx,
      dataPeaks
    });
  };
  if (isHandleMaxAndMinPeaksSt) {
    const {
      spectraList
    } = cyclicVotaSt;
    const spectra = spectraList[curveIdx];
    if (spectra) {
      const {
        isWorkMaxPeak
      } = spectra;
      if (isWorkMaxPeak) {
        onSweepPeakAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK, curveIdx);
        onSweepPeakDELETE = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK, curveIdx);
      } else {
        onSweepPeakAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK, curveIdx);
        onSweepPeakDELETE = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK, curveIdx);
      }
      onSweepAnchorShift = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF, curveIdx);
    }
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.group,
    "data-testid": "Peak",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Add Peak"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isFocusAddPeakSt, classes), 'btn-sv-bar-addpeak'),
          disabled: disableAddPeakSt,
          onClick: onSweepPeakAdd,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-addpeak'),
            children: "P+"
          })
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Remove Peak"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isFocusRmPeakSt, classes), 'btn-sv-bar-rmpeak'),
          disabled: disableRmPeakSt,
          onClick: onSweepPeakDELETE,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-rmpeak'),
            children: "P-"
          })
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_tri_btn.default, {
      content: {
        tp: 'Clear All Peaks'
      },
      cb: onClearAll,
      isClearAllDisabled: disableRmPeakSt,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-rmallpeaks'),
        children: "P"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: (0, _classnames.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-rmallpeaks'),
        children: "x"
      })]
    }), !disableSetRefSt ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Set Reference"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isFocusSetRefSt, classes), 'btn-sv-bar-setref'),
          disabled: disableSetRefSt,
          onClick: onSweepAnchorShift,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_AddLocationOutlined.default, {
            className: classes.icon
          })
        })
      })
    }) : null]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  isFocusAddPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_ADD || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK,
  disableAddPeakSt: _cfg.default.btnCmdAddPeak(state.layout),
  isFocusRmPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_DELETE || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK,
  disableRmPeakSt: _cfg.default.btnCmdRmPeak(state.layout),
  isFocusSetRefSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT || state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF,
  disableSetRefSt: _cfg.default.btnCmdSetRef(state.layout),
  isHandleMaxAndMinPeaksSt: !_cfg.default.hidePanelCyclicVolta(state.layout),
  cyclicVotaSt: state.cyclicvolta,
  curveSt: state.curve,
  editPeakSt: state.editPeak.present,
  thresSt: state.threshold.list[state.curve.curveIdx],
  layoutSt: state.layout,
  shiftSt: state.shift
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiSweepTypeAct: _ui.setUiSweepType,
  clearAllPeaksAct: _edit_peak.clearAllPeaks
}, dispatch);
Peak.propTypes = {
  classes: _propTypes.default.object.isRequired,
  isFocusAddPeakSt: _propTypes.default.bool.isRequired,
  disableAddPeakSt: _propTypes.default.bool.isRequired,
  isFocusRmPeakSt: _propTypes.default.bool.isRequired,
  disableRmPeakSt: _propTypes.default.bool.isRequired,
  isFocusSetRefSt: _propTypes.default.bool.isRequired,
  disableSetRefSt: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  isHandleMaxAndMinPeaksSt: _propTypes.default.bool.isRequired,
  cyclicVotaSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  clearAllPeaksAct: _propTypes.default.func.isRequired,
  feature: _propTypes.default.object.isRequired,
  editPeakSt: _propTypes.default.object.isRequired,
  thresSt: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  shiftSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(Peak);