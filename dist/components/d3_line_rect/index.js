"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _material = require("@mui/material");
var _ZoomInOutlined = _interopRequireDefault(require("@mui/icons-material/ZoomInOutlined"));
var _FindReplaceOutlined = _interopRequireDefault(require("@mui/icons-material/FindReplaceOutlined"));
var _common = require("../cmd_bar/common");
var _chem = require("../../helpers/chem");
var _manager = require("../../actions/manager");
var _ui = require("../../actions/ui");
var _hplc_ms = require("../../actions/hplc_ms");
var _curve = require("../../actions/curve");
var _rect_focus = _interopRequireDefault(require("./rect_focus"));
var _multi_focus = _interopRequireDefault(require("./multi_focus"));
var _line_focus = _interopRequireDefault(require("./line_focus"));
var _extractParams = require("../../helpers/extractParams");
var _calc = require("../../helpers/calc");
var _draw = require("../common/draw");
var _list_ui = require("../../constants/list_ui");
var _list_graph = require("../../constants/list_graph");
var _peak_group = _interopRequireDefault(require("../cmd_bar/08_peak_group"));
var _r03_threshold = _interopRequireDefault(require("../cmd_bar/r03_threshold"));
var _integration = _interopRequireDefault(require("../cmd_bar/04_integration"));
var _peak = _interopRequireDefault(require("../cmd_bar/03_peak"));
var _extractEntityLCMS = require("../../helpers/extractEntityLCMS");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-mixed-operators, prefer-object-spread, react/function-component-definition */

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.8 / 3); // ROI

const parsePageValue = feature => {
  const raw = feature?.pageSymbol ?? feature?.pageValue ?? feature?.page;
  if (raw == null) return null;
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }
  const text = String(raw).split('\n')[0].trim();
  const match = text.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
};
const styles = () => Object.assign({}, _common.commonStyle);
const zoomView = (classes, graphIndex, uiSt, zoomInAct) => {
  const onSweepZoomIn = () => {
    const payload = {
      graphIndex,
      sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN
    };
    zoomInAct(payload);
  };
  const onSweepZoomReset = () => {
    const payload = {
      graphIndex,
      sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET
    };
    zoomInAct(payload);
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
        className: (0, _classnames.default)('btn-sv-bar-zoomreset'),
        onClick: onSweepZoomReset,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_FindReplaceOutlined.default, {
          className: classes.icon
        })
      })
    })]
  });
};
const waveLengthSelect = (classes, hplcMsSt, updateWaveLengthAct) => {
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldDecimal),
    variant: "outlined",
    style: {
      width: '140px'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-decimal-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Wavelength (nm)"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: "select-decimal-label",
      label: "Decimal",
      value: selectedWaveLength,
      onChange: updateWaveLengthAct,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-decimal'),
      children: options
    })]
  });
};
const ticSelect = (classes, hplcMsSt, handleTicChanged) => {
  const {
    tic
  } = hplcMsSt;
  const {
    polarity,
    available
  } = tic;
  const listTIC = [{
    name: 'PLUS',
    value: 'positive',
    enabled: available?.positive
  }, {
    name: 'MINUS',
    value: 'negative',
    enabled: available?.negative
  }, {
    name: 'NEUTRAL',
    value: 'neutral',
    enabled: available?.neutral
  }];
  const filtered = listTIC.filter(d => d.enabled);
  const listOptions = filtered.length > 0 ? filtered : listTIC;
  const options = listOptions.map(d => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
    value: d.value,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-decimal'),
      children: d.name
    })
  }, d.value));
  const onTicChange = event => {
    handleTicChanged(event);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldDecimal),
    variant: "outlined",
    style: {
      width: '110px'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-decimal-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "TIC"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: "select-decimal-label",
      label: "Decimal",
      value: polarity,
      onChange: onTicChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-decimal'),
      children: options
    })]
  });
};
class ViewerLineRect extends _react.default.Component {
  constructor(props) {
    super(props);
    const {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      ticEntities,
      uvvisEntities,
      uiSt
    } = props;
    this.rootKlassLine = `.${_list_graph.LIST_ROOT_SVG_GRAPH.LINE}`;
    this.lineFocus = new _line_focus.default({
      W,
      H,
      uvvisEntities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      graphIndex: 0,
      uiSt
    });
    this.rootKlassMulti = `.${_list_graph.LIST_ROOT_SVG_GRAPH.MULTI}`;
    this.multiFocus = new _multi_focus.default({
      W,
      H,
      ticEntities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      graphIndex: 1,
      uiSt
    });
    this.rootKlassRect = `.${_list_graph.LIST_ROOT_SVG_GRAPH.RECT}`;
    this.rectFocus = new _rect_focus.default({
      W,
      H,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      graphIndex: 2,
      uiSt
    });
    this.normChange = this.normChange.bind(this);
    this.extractSubView = this.extractSubView.bind(this);
    this.extractUvvisView = this.extractUvvisView.bind(this);
  }
  componentDidMount() {
    const {
      curveSt,
      feature,
      ticEntities,
      hplcMsSt,
      tTrEndPts,
      layoutSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      integationSt,
      isHidden,
      resetAllAct,
      uiSt,
      editPeakSt
    } = this.props;
    (0, _draw.drawDestroy)(this.rootKlassMulti);
    (0, _draw.drawDestroy)(this.rootKlassLine);
    (0, _draw.drawDestroy)(this.rootKlassRect);
    resetAllAct(feature);
    const {
      zoom
    } = uiSt;
    const {
      sweepExtent
    } = zoom;
    const uvvisViewFeature = this.extractUvvisView();
    if (!uvvisViewFeature || !uvvisViewFeature.data || uvvisViewFeature.data.length === 0) {
      return;
    }
    const {
      data
    } = uvvisViewFeature;
    const currentData = data[0];
    const {
      x,
      y
    } = currentData;
    const uvvisSeed = x.map((d, index) => {
      const s = {
        x: d,
        y: y[index]
      };
      return s;
    });
    (0, _draw.drawMain)(this.rootKlassLine, W, H, _list_graph.LIST_BRUSH_SVG_GRAPH.LINE);
    this.lineFocus.create({
      filterSeed: uvvisSeed,
      filterPeak: [],
      tTrEndPts,
      layoutSt,
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[0],
      integationSt,
      isUiAddIntgSt,
      editPeakSt,
      hplcMsSt
    });
    (0, _draw.drawLabel)(this.rootKlassLine, null, 'Minutes', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassLine, false);
    (0, _draw.drawMain)(this.rootKlassMulti, W, H, _list_graph.LIST_BRUSH_SVG_GRAPH.MULTI);
    this.multiFocus.create({
      ticEntities,
      curveSt,
      hplcMsSt,
      tTrEndPts,
      layoutSt,
      sweepExtentSt: sweepExtent[1],
      isUiAddIntgSt,
      isUiNoBrushSt
    });
    (0, _draw.drawLabel)(this.rootKlassMulti, null, 'Minutes', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassMulti, isHidden);
    (0, _draw.drawMain)(this.rootKlassRect, W, H, _list_graph.LIST_BRUSH_SVG_GRAPH.RECT);
    this.rectFocus.create({
      filterSeed: [],
      filterPeak: [],
      tTrEndPts,
      layoutSt,
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[2]
    });
    (0, _draw.drawLabel)(this.rootKlassRect, null, 'm/z', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassRect, false);
  }
  componentDidUpdate(prevProps) {
    const {
      ticEntities,
      curveSt,
      tTrEndPts,
      layoutSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      isHidden,
      uiSt,
      hplcMsSt,
      integationSt,
      editPeakSt
    } = this.props;
    this.normChange(prevProps);
    const {
      zoom
    } = uiSt;
    const {
      sweepExtent
    } = zoom;
    const uvvisViewFeature = this.extractUvvisView();
    if (uvvisViewFeature) {
      const {
        data
      } = uvvisViewFeature;
      const currentData = data[0];
      const {
        x,
        y
      } = currentData;
      const uvvisSeed = x.map((d, index) => {
        const s = {
          x: d,
          y: y[index]
        };
        return s;
      });
      if (this.lineFocus) {
        this.lineFocus.update({
          filterSeed: uvvisSeed,
          filterPeak: [],
          tTrEndPts,
          isUiNoBrushSt: true,
          isUiAddIntgSt,
          sweepExtentSt: sweepExtent[0],
          uiSt,
          layoutSt,
          integationSt,
          hplcMsSt,
          editPeakSt
        });
      }
      (0, _draw.drawLabel)(this.rootKlassLine, null, 'Minutes', 'Intensity');
      (0, _draw.drawDisplay)(this.rootKlassLine, false);
    }
    if (this.multiFocus) {
      this.multiFocus.update({
        curveSt,
        ticEntities,
        hplcMsSt,
        tTrEndPts,
        layoutSt,
        sweepExtentSt: sweepExtent[1],
        isUiAddIntgSt,
        isUiNoBrushSt,
        uiSt,
        editPeakSt
      });
    }
    const {
      polarity
    } = hplcMsSt.tic;
    let ticLabel = 'NEUTRAL';
    if (polarity === 'negative') {
      ticLabel = 'MINUS';
    } else if (polarity === 'positive') {
      ticLabel = 'PLUS';
    }
    (0, _draw.drawLabel)(this.rootKlassMulti, ticLabel, 'Minutes', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassMulti, isHidden);
    const subViewFeature = this.extractSubView();
    if (subViewFeature) {
      const {
        threshold
      } = hplcMsSt;
      const curTrEndPts = (0, _chem.convertThresEndPts)(subViewFeature, threshold.value);
      const {
        data
      } = subViewFeature;
      const pageValue = parsePageValue(subViewFeature);
      const labelValue = Number.isFinite(pageValue) ? pageValue : subViewFeature?.pageValue ?? subViewFeature?.page ?? null;
      const currentData = data[0];
      const {
        x,
        y
      } = currentData;
      const subSeed = x.map((d, index) => {
        const s = {
          x: d,
          y: y[index]
        };
        return s;
      });
      if (this.rectFocus) {
        this.rectFocus.update({
          filterSeed: subSeed,
          filterPeak: [],
          tTrEndPts: curTrEndPts,
          layoutSt,
          isUiNoBrushSt: true,
          sweepExtentSt: sweepExtent[2],
          uiSt
        });
      }
      (0, _draw.drawLabel)(this.rootKlassRect, labelValue != null ? `${labelValue} min` : null, 'm/z', 'Intensity');
      (0, _draw.drawDisplay)(this.rootKlassRect, false);
    }
  }
  componentWillUnmount() {
    (0, _draw.drawDestroy)(this.rootKlassMulti);
  }
  normChange(prevProps) {
    const {
      feature
    } = this.props;
    const oldFeature = prevProps.feature;
    if (oldFeature !== feature) {
      // resetAllAct(feature);
    }
  }
  extractUvvisView() {
    const {
      uvvisEntities,
      hplcMsSt
    } = this.props;
    if (!uvvisEntities || !uvvisEntities[0]) {
      return null;
    }
    const {
      features
    } = (0, _extractParams.extractParams)(uvvisEntities[0], 0, 1);
    let featuresArr = [];
    if (Array.isArray(features)) {
      featuresArr = features;
    } else if (features && typeof features === 'object') {
      featuresArr = Object.values(features);
    }
    if (featuresArr.length === 0) {
      return null;
    }
    const {
      uvvis
    } = hplcMsSt;
    const {
      wavelengthIdx
    } = uvvis;
    if (wavelengthIdx < 0 || wavelengthIdx >= featuresArr.length) {
      return null;
    }
    return featuresArr[wavelengthIdx];
  }
  extractSubView() {
    const {
      uiSt,
      mzEntities,
      hplcMsSt,
      updateCurrentPageValueAct
    } = this.props;
    const {
      polarity
    } = hplcMsSt.tic;
    const pickEntity = mzEntities?.find(ent => (0, _extractEntityLCMS.getLcMsInfo)(ent).polarity === polarity) || mzEntities?.[0];
    if (!pickEntity || !pickEntity.layout) {
      return null;
    }
    const {
      subViewerAt
    } = uiSt;
    const {
      features
    } = (0, _extractParams.extractParams)(pickEntity, 0, 1);
    let featuresArr = [];
    if (Array.isArray(features)) {
      featuresArr = features;
    } else if (features && typeof features === 'object') {
      featuresArr = Object.values(features);
    }
    if (featuresArr.length === 0) return null;
    const pageValues = featuresArr.map(fe => parsePageValue(fe)).filter(val => Number.isFinite(val));
    if (pageValues.length === 0) return featuresArr[0];
    const hasValidClick = subViewerAt && subViewerAt.x !== undefined;
    const closestPage = hasValidClick ? (0, _calc.findClosest)(pageValues, subViewerAt.x) : pageValues[Math.floor(pageValues.length / 2)];
    if (closestPage !== hplcMsSt.tic.currentPageValue) {
      updateCurrentPageValueAct(closestPage);
    }
    const selectFeature = featuresArr.find(fe => {
      const value = parsePageValue(fe);
      return Number.isFinite(value) && Math.abs(value - closestPage) < 1e-9;
    });
    return selectFeature || featuresArr[0];
  }
  render() {
    const {
      classes,
      hplcMsSt,
      selectWavelengthAct,
      updateTicAct,
      selectCurveAct,
      feature,
      zoomInAct,
      uiSt,
      ticEntities
    } = this.props;
    const handleTicChanged = event => {
      const selectedPolarity = event.target.value;
      updateTicAct({
        polarity: selectedPolarity
      });
      const targetEntity = ticEntities?.find(ent => (0, _extractEntityLCMS.getLcMsInfo)(ent).polarity === selectedPolarity);
      if (targetEntity?.curveIdx !== undefined) {
        selectCurveAct(targetEntity.curveIdx);
      }
    };
    const handleWaveLengthChange = event => {
      selectWavelengthAct(event);
    };
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [zoomView(classes, 0, uiSt, zoomInAct), waveLengthSelect(classes, hplcMsSt, handleWaveLengthChange), /*#__PURE__*/(0, _jsxRuntime.jsx)(_integration.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_peak.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: _list_graph.LIST_ROOT_SVG_GRAPH.LINE
      }), zoomView(classes, 1, uiSt, zoomInAct), ticSelect(classes, hplcMsSt, handleTicChanged), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        style: {
          display: 'inline-flex'
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_peak_group.default, {
          feature: feature,
          graphIndex: 1
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: _list_graph.LIST_ROOT_SVG_GRAPH.MULTI
      }), zoomView(classes, 2, uiSt, zoomInAct), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r03_threshold.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: _list_graph.LIST_ROOT_SVG_GRAPH.RECT
      })]
    });
  }
}
const mapStateToProps = (state, props) => ({
  curveSt: state.curve,
  tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
  isUiAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
  uiSt: state.ui,
  layoutSt: state.layout,
  hplcMsSt: state.hplcMs,
  editPeakSt: state.editPeak.present,
  integationSt: state.integration.present,
  sweepExtentSt: state.ui.sweepExtent
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  resetAllAct: _manager.resetAll,
  clickUiTargetAct: _ui.clickUiTarget,
  selectUiSweepAct: _ui.selectUiSweep,
  scrollUiWheelAct: _ui.scrollUiWheel,
  selectWavelengthAct: _hplc_ms.selectWavelength,
  updateTicAct: _hplc_ms.changeTic,
  selectCurveAct: _curve.selectCurve,
  zoomInAct: _ui.setUiSweepType,
  updateCurrentPageValueAct: _hplc_ms.updateCurrentPageValue
}, dispatch);
ViewerLineRect.propTypes = {
  classes: _propTypes.default.object.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  ticEntities: _propTypes.default.array.isRequired,
  uvvisEntities: _propTypes.default.array.isRequired,
  mzEntities: _propTypes.default.array.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  integationSt: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  tTrEndPts: _propTypes.default.array.isRequired,
  isUiAddIntgSt: _propTypes.default.bool.isRequired,
  isUiNoBrushSt: _propTypes.default.bool.isRequired,
  resetAllAct: _propTypes.default.func.isRequired,
  clickUiTargetAct: _propTypes.default.func.isRequired,
  selectUiSweepAct: _propTypes.default.func.isRequired,
  scrollUiWheelAct: _propTypes.default.func.isRequired,
  isHidden: _propTypes.default.bool.isRequired,
  hplcMsSt: _propTypes.default.object.isRequired,
  selectWavelengthAct: _propTypes.default.func.isRequired,
  updateTicAct: _propTypes.default.func.isRequired,
  selectCurveAct: _propTypes.default.func.isRequired,
  zoomInAct: _propTypes.default.func.isRequired,
  editPeakSt: _propTypes.default.object.isRequired,
  updateCurrentPageValueAct: _propTypes.default.func.isRequired
};

// export default connect(mapStateToProps, mapDispatchToProps)(ViewerLineRect);
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(ViewerLineRect);