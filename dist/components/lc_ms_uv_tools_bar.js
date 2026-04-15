"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _classnames = _interopRequireDefault(require("classnames"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _material = require("@mui/material");
var _ZoomInOutlined = _interopRequireDefault(require("@mui/icons-material/ZoomInOutlined"));
var _FindReplaceOutlined = _interopRequireDefault(require("@mui/icons-material/FindReplaceOutlined"));
var _Undo = _interopRequireDefault(require("@mui/icons-material/Undo"));
var _Redo = _interopRequireDefault(require("@mui/icons-material/Redo"));
var _common = require("./cmd_bar/common");
var _integration = _interopRequireDefault(require("./cmd_bar/04_integration"));
var _peak = _interopRequireDefault(require("./cmd_bar/03_peak"));
var _ui = require("../actions/ui");
var _hplc_ms = require("../actions/hplc_ms");
var _list_ui = require("../constants/list_ui");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-mixed-operators, prefer-object-spread, react/function-component-definition */

const styles = () => Object.assign({}, _common.commonStyle);
const zoomView = (classes, graphIndex, uiSt, zoomInAct) => {
  const onSweepZoomIn = () => {
    zoomInAct({
      graphIndex,
      sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN
    });
  };
  const onSweepZoomReset = () => {
    zoomInAct({
      graphIndex,
      sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET
    });
    zoomInAct({
      graphIndex,
      sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN
    });
  };
  const {
    zoom
  } = uiSt;
  const {
    sweepTypes
  } = zoom;
  const isZoomFocus = sweepTypes[graphIndex] === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.group,
    "data-testid": "Zoom",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Zoom In"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
        className: (0, _classnames.default)((0, _common.focusStyle)(isZoomFocus, classes), 'btn-sv-bar-zoomin'),
        onClick: onSweepZoomIn,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ZoomInOutlined.default, {
          className: (0, _classnames.default)(classes.icon, classes.iconWp)
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Reset Zoom"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
        className: "btn-sv-bar-zoomreset",
        onClick: onSweepZoomReset,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_FindReplaceOutlined.default, {
          className: classes.icon
        })
      })
    })]
  });
};
const wavelengthSelect = (classes, hplcMsSt, updateWavelengthAct) => {
  const uvvis = hplcMsSt && hplcMsSt.uvvis || {};
  const {
    listWaveLength = null,
    selectedWaveLength
  } = uvvis;
  const options = listWaveLength ? listWaveLength.map(d => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
    value: d,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-decimal'),
      children: d
    })
  }, d)) : [];
  const hasSelectedWaveLength = listWaveLength && listWaveLength.includes(selectedWaveLength);
  const resolvedSelectedWaveLength = hasSelectedWaveLength ? selectedWaveLength : listWaveLength && listWaveLength[0];
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldDecimal),
    variant: "outlined",
    style: {
      width: '140px'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "lcms-select-wavelength-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Wavelength (nm)"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: "lcms-select-wavelength-label",
      label: "Wavelength (nm)",
      value: resolvedSelectedWaveLength,
      onChange: updateWavelengthAct,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-decimal'),
      children: options
    })]
  });
};
const LcMsUvToolsBar = ({
  classes,
  uiSt,
  hplcMsSt,
  feature,
  zoomInAct,
  selectWavelengthAct,
  uvvisUndoAct,
  uvvisRedoAct
}) => {
  const handleWavelengthChange = event => {
    selectWavelengthAct(event);
  };
  const hist = hplcMsSt?.uvvisEditHistory || {
    past: [],
    future: []
  };
  const canUndo = hist.past && hist.past.length > 0;
  const canRedo = hist.future && hist.future.length > 0;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [zoomView(classes, 0, uiSt, zoomInAct), wavelengthSelect(classes, hplcMsSt, handleWavelengthChange), /*#__PURE__*/(0, _jsxRuntime.jsx)(_integration.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_peak.default, {
      feature: feature || {}
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
      className: classes.group,
      style: {
        display: 'inline-flex',
        alignItems: 'center'
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Undo"
        }),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: "btn-sv-bar-uvvis-undo",
          disabled: !canUndo,
          onClick: () => uvvisUndoAct(),
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Undo.default, {
            className: classes.icon
          })
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Redo"
        }),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: "btn-sv-bar-uvvis-redo",
          disabled: !canRedo,
          onClick: () => uvvisRedoAct(),
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Redo.default, {
            className: classes.icon
          })
        })
      })]
    })]
  });
};
const mapStateToProps = state => {
  const {
    curveIdx,
    listCurves
  } = state.curve;
  const entity = listCurves[curveIdx];
  const displayFeature = entity?.feature || listCurves[0]?.feature || listCurves[0]?.features?.[0] || {};
  return {
    uiSt: state.ui,
    hplcMsSt: state.hplcMs,
    feature: displayFeature
  };
};
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  zoomInAct: _ui.setUiSweepType,
  selectWavelengthAct: _hplc_ms.selectWavelength,
  uvvisUndoAct: _hplc_ms.uvvisUndo,
  uvvisRedoAct: _hplc_ms.uvvisRedo
}, dispatch);
LcMsUvToolsBar.propTypes = {
  classes: _propTypes.default.object.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  hplcMsSt: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  zoomInAct: _propTypes.default.func.isRequired,
  selectWavelengthAct: _propTypes.default.func.isRequired,
  uvvisUndoAct: _propTypes.default.func.isRequired,
  uvvisRedoAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(LcMsUvToolsBar);