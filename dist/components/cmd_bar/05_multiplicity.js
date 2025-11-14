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
var _ui = require("../../actions/ui");
var _multiplicity = require("../../actions/multiplicity");
var _list_ui = require("../../constants/list_ui");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _tri_btn = _interopRequireDefault(require("./tri_btn"));
var _common = require("./common");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */

const styles = () => Object.assign({}, _common.commonStyle);
const Multiplicity = ({
  classes,
  isFocusAddMpySt,
  disableAddMpySt,
  isFocusRmMpySt,
  disableRmMpySt,
  isFocusAddPeakSt,
  isFocusRmPeakSt,
  disableMpyPeakSt,
  setUiSweepTypeAct,
  clearMpyAllAct,
  curveSt
}) => {
  const onSweepMutAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD);
  const onOneMutAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM);
  const onPeakMutAdd = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD);
  const onPeakMutRm = () => setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM);
  const {
    curveIdx
  } = curveSt;
  const onClearAll = () => clearMpyAllAct({
    curveIdx
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.group,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Add Multiplicity"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isFocusAddMpySt, classes), 'btn-sv-bar-addmpy'),
          disabled: disableAddMpySt,
          onClick: onSweepMutAdd,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-addmpy'),
            children: "J+"
          })
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Remove Multiplicity"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isFocusRmMpySt, classes), 'btn-sv-bar-rmmpy'),
          disabled: disableRmMpySt,
          onClick: onOneMutAdd,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-rmmpy'),
            children: "J-"
          })
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Add Peak for Multiplicity"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isFocusAddPeakSt, classes), 'btn-sv-bar-addpeakmpy'),
          disabled: disableMpyPeakSt,
          onClick: onPeakMutAdd,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-addpeakmpy'),
            children: "JP+"
          })
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Remove Peak for Multiplicity"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)((0, _common.focusStyle)(isFocusRmPeakSt, classes), 'btn-sv-bar-rmpeakmpy'),
          disabled: disableMpyPeakSt,
          onClick: onPeakMutRm,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-rmpeakmpy'),
            children: "JP-"
          })
        })
      })
    }), disableAddMpySt ? null :
    /*#__PURE__*/
    // eslint-disable-line
    (0, _jsxRuntime.jsx)(_tri_btn.default, {
      content: {
        tp: 'Clear All Multiplicity'
      },
      cb: onClearAll,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: (0, _classnames.default)(classes.txt, 'txt-sv-bar-rmallmpy'),
        children: "Jx"
      })
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  isFocusAddMpySt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD,
  disableAddMpySt: _cfg.default.btnCmdMpy(state.layout),
  isFocusRmMpySt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM,
  disableRmMpySt: _cfg.default.btnCmdMpy(state.layout),
  isFocusAddPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD,
  isFocusRmPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM,
  disableMpyPeakSt: _cfg.default.btnCmdMpyPeak(state.layout, state.multiplicity.present, state.curve.curveIdx),
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiSweepTypeAct: _ui.setUiSweepType,
  clearMpyAllAct: _multiplicity.clearMpyAll
}, dispatch);
Multiplicity.propTypes = {
  classes: _propTypes.default.object.isRequired,
  isFocusAddMpySt: _propTypes.default.bool.isRequired,
  disableAddMpySt: _propTypes.default.bool.isRequired,
  isFocusRmMpySt: _propTypes.default.bool.isRequired,
  disableRmMpySt: _propTypes.default.bool.isRequired,
  isFocusAddPeakSt: _propTypes.default.bool.isRequired,
  isFocusRmPeakSt: _propTypes.default.bool.isRequired,
  disableMpyPeakSt: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  clearMpyAllAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(Multiplicity));