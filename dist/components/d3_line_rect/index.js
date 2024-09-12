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
var _hplcms = require("../../actions/hplcms");
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
/* eslint-disable no-mixed-operators, prefer-object-spread, react/function-component-definition */

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.8 / 3); // ROI

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
  return /*#__PURE__*/_react.default.createElement("span", {
    className: classes.group,
    "data-testid": "Zoom"
  }, /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Zoom In")
  }, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)((0, _common.focusStyle)(isZoomFocus, classes), 'btn-sv-bar-zoomin'),
    onClick: onSweepZoomIn
  }, /*#__PURE__*/_react.default.createElement(_ZoomInOutlined.default, {
    className: (0, _classnames.default)(classes.icon, classes.iconWp)
  }))), /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, "Reset Zoom")
  }, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
    className: (0, _classnames.default)('btn-sv-bar-zoomreset'),
    onClick: onSweepZoomReset
  }, /*#__PURE__*/_react.default.createElement(_FindReplaceOutlined.default, {
    className: classes.icon
  }))));
};
const waveLengthSelect = (classes, hplcMsSt, updateWaveLengthAct) => {
  const {
    uvvis
  } = hplcMsSt;
  const {
    listWaveLength,
    selectedWaveLength
  } = uvvis;
  const options = listWaveLength.map(d => /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: d,
    key: d
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-decimal')
  }, d)));
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldDecimal),
    variant: "outlined",
    style: {
      width: '80px'
    }
  }, /*#__PURE__*/_react.default.createElement(_material.InputLabel, {
    id: "select-decimal-label",
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "Wavelength"), /*#__PURE__*/_react.default.createElement(_material.Select, {
    labelId: "select-decimal-label",
    label: "Decimal",
    value: selectedWaveLength,
    onChange: updateWaveLengthAct,
    className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-decimal')
  }, options));
};
const ticSelect = (classes, hplcMsSt, updateTicAct) => {
  const {
    tic
  } = hplcMsSt;
  const {
    isNegative
  } = tic;
  const listTIC = [{
    name: 'PLUS',
    value: 0
  }, {
    name: 'MINUS',
    value: 1
  }];
  const options = listTIC.map(d => /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: d.value,
    key: d.value
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-decimal')
  }, d.name)));
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldDecimal),
    variant: "outlined",
    style: {
      position: 'absolute'
    }
  }, /*#__PURE__*/_react.default.createElement(_material.InputLabel, {
    id: "select-decimal-label",
    className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label')
  }, "TIC"), /*#__PURE__*/_react.default.createElement(_material.Select, {
    labelId: "select-decimal-label",
    label: "Decimal",
    value: isNegative ? 1 : 0,
    onChange: updateTicAct,
    className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-decimal')
  }, options));
};
class ViewerLineRect extends _react.default.Component {
  constructor(props) {
    super(props);
    const {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      entities
    } = props;
    this.rootKlassLine = `.${_list_graph.LIST_ROOT_SVG_GRAPH.LINE}`;
    this.lineFocus = new _line_focus.default({
      W,
      H,
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
    });
    this.rootKlassMulti = `.${_list_graph.LIST_ROOT_SVG_GRAPH.MULTI}`;
    this.multiFocus = new _multi_focus.default({
      W,
      H,
      entities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
    });
    this.rootKlassRect = `.${_list_graph.LIST_ROOT_SVG_GRAPH.RECT}`;
    this.rectFocus = new _rect_focus.default({
      W,
      H,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
    });
    this.normChange = this.normChange.bind(this);
    this.extractSubView = this.extractSubView.bind(this);
    this.extractUvvisView = this.extractUvvisView.bind(this);
  }
  componentDidMount() {
    const {
      entities,
      curveSt,
      seed,
      cLabel,
      feature,
      tTrEndPts,
      layoutSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      isHidden,
      resetAllAct,
      uiSt
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
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[0]
    });
    (0, _draw.drawLabel)(this.rootKlassLine, null, 'Minutes', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassLine, false);
    const filterSeed = seed;
    (0, _draw.drawMain)(this.rootKlassMulti, W, H, _list_graph.LIST_BRUSH_SVG_GRAPH.MULTI);
    this.multiFocus.create({
      entities,
      curveSt,
      filterSeed,
      tTrEndPts,
      layoutSt,
      sweepExtentSt: sweepExtent[1],
      isUiAddIntgSt,
      isUiNoBrushSt
    });
    (0, _draw.drawLabel)(this.rootKlassMulti, cLabel, 'Minutes', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassMulti, isHidden);
    (0, _draw.drawMain)(this.rootKlassRect, W, H, _list_graph.LIST_BRUSH_SVG_GRAPH.RECT);
    this.rectFocus.create({
      filterSeed: [],
      filterPeak: [],
      tTrEndPts,
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[2]
    });
    (0, _draw.drawLabel)(this.rootKlassRect, null, 'M/Z', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassRect, false);
  }
  componentDidUpdate(prevProps) {
    const {
      entities,
      curveSt,
      seed,
      cLabel,
      tTrEndPts,
      layoutSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      isHidden,
      uiSt,
      hplcMsSt
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
      this.lineFocus.update({
        filterSeed: uvvisSeed,
        filterPeak: [],
        tTrEndPts,
        isUiNoBrushSt: true,
        sweepExtentSt: sweepExtent[0]
      });
      (0, _draw.drawLabel)(this.rootKlassLine, null, 'Minutes', 'Intensity');
      (0, _draw.drawDisplay)(this.rootKlassLine, false);
    }
    const filterSeed = seed;
    this.multiFocus.update({
      entities,
      curveSt,
      filterSeed,
      tTrEndPts,
      layoutSt,
      sweepExtentSt: sweepExtent[1],
      isUiAddIntgSt,
      isUiNoBrushSt
    });
    (0, _draw.drawLabel)(this.rootKlassMulti, cLabel, 'Minutes', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassMulti, isHidden);
    const subViewFeature = this.extractSubView();
    if (subViewFeature) {
      const {
        threshold
      } = hplcMsSt;
      const curTrEndPts = (0, _chem.convertThresEndPts)(subViewFeature, threshold.value);
      const {
        data,
        pageValue
      } = subViewFeature;
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
      this.rectFocus.update({
        filterSeed: subSeed,
        filterPeak: [],
        tTrEndPts: curTrEndPts,
        isUiNoBrushSt: true,
        sweepExtentSt: sweepExtent[2]
      });
      (0, _draw.drawLabel)(this.rootKlassRect, `${pageValue} min`, 'M/Z', 'Intensity');
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
      subEntities,
      hplcMsSt
    } = this.props;
    const {
      features
    } = (0, _extractParams.extractParams)(subEntities[0], 0, 1);
    const {
      uvvis
    } = hplcMsSt;
    const {
      wavelengthIdx
    } = uvvis;
    return features[wavelengthIdx];
  }
  extractSubView() {
    const {
      uiSt,
      subEntities,
      hplcMsSt
    } = this.props;
    const {
      tic
    } = hplcMsSt;
    const {
      isNegative
    } = tic;
    const entityIdx = isNegative ? 2 : 1;
    const {
      subViewerAt
    } = uiSt;
    let selectFeature = null;
    if (subViewerAt && subViewerAt.x) {
      const {
        features
      } = (0, _extractParams.extractParams)(subEntities[entityIdx], 0, 1);
      const arrPageValues = features.map(fe => fe.pageValue);
      const closestPage = (0, _calc.findClosest)(arrPageValues, subViewerAt.x);
      const filteredFeatures = features.filter(fe => {
        const {
          pageValue
        } = fe;
        return pageValue === closestPage;
      });
      [selectFeature] = filteredFeatures;
    }
    return selectFeature;
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
      uiSt
    } = this.props;
    const handleTicChanged = event => {
      updateTicAct(event);
      selectCurveAct(event.target.value);
    };
    return /*#__PURE__*/_react.default.createElement("div", null, zoomView(_classnames.default, 0, uiSt, zoomInAct), waveLengthSelect(classes, hplcMsSt, selectWavelengthAct), /*#__PURE__*/_react.default.createElement("div", {
      className: _list_graph.LIST_ROOT_SVG_GRAPH.LINE
    }), /*#__PURE__*/_react.default.createElement(_peak_group.default, {
      feature: feature,
      graphIndex: 1
    }), zoomView(classes, 1, uiSt, zoomInAct), ticSelect(classes, hplcMsSt, handleTicChanged), /*#__PURE__*/_react.default.createElement("div", {
      className: _list_graph.LIST_ROOT_SVG_GRAPH.MULTI
    }), zoomView(classes, 2, uiSt, zoomInAct), /*#__PURE__*/_react.default.createElement(_r03_threshold.default, null), /*#__PURE__*/_react.default.createElement("div", {
      className: _list_graph.LIST_ROOT_SVG_GRAPH.RECT
    }));
  }
}
const mapStateToProps = (state, props) => ({
  curveSt: state.curve,
  seed: (0, _chem.Topic2Seed)(state, props),
  tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
  isUiAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
  uiSt: state.ui,
  hplcMsSt: state.hplcMs
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  resetAllAct: _manager.resetAll,
  clickUiTargetAct: _ui.clickUiTarget,
  selectUiSweepAct: _ui.selectUiSweep,
  scrollUiWheelAct: _ui.scrollUiWheel,
  selectWavelengthAct: _hplcms.selectWavelength,
  updateTicAct: _hplcms.changeTic,
  selectCurveAct: _curve.selectCurve,
  zoomInAct: _ui.setUiSweepType
}, dispatch);
ViewerLineRect.propTypes = {
  classes: _propTypes.default.object.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  entities: _propTypes.default.array.isRequired,
  subEntities: _propTypes.default.array.isRequired,
  seed: _propTypes.default.array.isRequired,
  cLabel: _propTypes.default.string.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  feature: _propTypes.default.object.isRequired,
  tTrEndPts: _propTypes.default.array.isRequired,
  isUiAddIntgSt: _propTypes.default.bool.isRequired,
  isUiNoBrushSt: _propTypes.default.bool.isRequired,
  resetAllAct: _propTypes.default.func.isRequired,
  clickUiTargetAct: _propTypes.default.func.isRequired,
  selectUiSweepAct: _propTypes.default.func.isRequired,
  scrollUiWheelAct: _propTypes.default.func.isRequired,
  isHidden: _propTypes.default.bool.isRequired,
  hplcMsSt: _propTypes.default.bool.isRequired,
  selectWavelengthAct: _propTypes.default.func.isRequired,
  updateTicAct: _propTypes.default.func.isRequired,
  selectCurveAct: _propTypes.default.func.isRequired,
  zoomInAct: _propTypes.default.func.isRequired
};

// export default connect(mapStateToProps, mapDispatchToProps)(ViewerLineRect);
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(ViewerLineRect);