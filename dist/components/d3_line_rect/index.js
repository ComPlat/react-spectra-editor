"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toSeed = exports.sameSizes = exports.measurePane = exports.isLcmsMsPageLoading = exports.default = exports.computeLcmsUnionXExtent = exports.UnconnectedViewerLineRect = exports.SIZE_EPSILON = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _material = require("@mui/material");
var _ZoomInOutlined = _interopRequireDefault(require("@mui/icons-material/ZoomInOutlined"));
var _FindReplaceOutlined = _interopRequireDefault(require("@mui/icons-material/FindReplaceOutlined"));
var _Undo = _interopRequireDefault(require("@mui/icons-material/Undo"));
var _Redo = _interopRequireDefault(require("@mui/icons-material/Redo"));
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
var _wavelengthSelect = _interopRequireDefault(require("../../features/lc-ms/ui/wavelengthSelect"));
var _pageValue = require("../../features/lc-ms/parsing/pageValue");
var _list_graph = require("../../constants/list_graph");
var _peak_group = _interopRequireDefault(require("../cmd_bar/08_peak_group"));
var _r03_threshold = _interopRequireDefault(require("../cmd_bar/r03_threshold"));
var _integration = _interopRequireDefault(require("../cmd_bar/04_integration"));
var _peak = _interopRequireDefault(require("../cmd_bar/03_peak"));
var _extractEntityLCMS = require("../../helpers/extractEntityLCMS");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-mixed-operators, prefer-object-spread, react/function-component-definition */

const d3 = require('d3');

// Fallback viewBox, used only until the panes can be measured (and in jsdom, where
// clientWidth/clientHeight are 0).
const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.8 / 3); // ROI

// Below this, the drawable area net of the focus classes' margins (l:60 r:5 t:5 b:40)
// stops being meaningful; clamp rather than let a scale range invert.
const MIN_PANE_W = 240;
const MIN_PANE_H = 96;

// Each chart svg carries `preserveAspectRatio="xMinYMin meet"`, so it is the viewBox
// aspect - not the container - that decides how much of the pane the drawing fills. With
// a viewBox derived once from `window.innerWidth` at module load, a pane proportionally
// wider than that ratio scales the drawing down to its height and leaves the surplus
// width empty on the right, which is what a viewport wider than FHD produces. Measuring
// the pane and matching the viewBox to it removes the letterboxing in both directions.
const measurePane = node => {
  if (!node) return null;
  const {
    clientWidth,
    clientHeight
  } = node;
  if (!clientWidth || !clientHeight) return null;
  return {
    width: Math.max(Math.round(clientWidth), MIN_PANE_W),
    height: Math.max(Math.round(clientHeight), MIN_PANE_H)
  };
};
exports.measurePane = measurePane;
// A pane whose height is content-derived (any host that does not bound us - the
// standalone demo included) takes its height from the svg, whose height comes back from
// the viewBox we are about to set. Re-measuring integer client boxes across that round
// trip can differ by a pixel without anything really having moved, so require a real
// change before paying for a remount.
const SIZE_EPSILON = exports.SIZE_EPSILON = 2;
const sameSizes = (a, b) => Boolean(a) && Boolean(b) && ['line', 'multi', 'rect'].every(k => Math.abs(a[k].width - b[k].width) <= SIZE_EPSILON && Math.abs(a[k].height - b[k].height) <= SIZE_EPSILON);
exports.sameSizes = sameSizes;
const toSeed = (xValues = [], yValues = []) => {
  const maxLength = Math.min(xValues.length, yValues.length);
  const seed = new Array(maxLength);
  for (let index = 0; index < maxLength; index += 1) {
    seed[index] = {
      x: xValues[index],
      y: yValues[index]
    };
  }
  return seed;
};

// Widen a running [xL, xU] pair (starting at [null, null]) by one d3.extent
// result. d3.extent is what does the folding: it skips null/undefined/NaN,
// which a hand-rolled min/max cannot — a single non-finite x would sit in the
// accumulator forever (every comparison against NaN is false) and pin both
// panes to a NaN domain that the seed guard then refuses to recompute.
// convertTopic emits exactly that whenever topic.y outruns topic.x.
exports.toSeed = toSeed;
const widenExtent = ([xL, xU], [nextL, nextU]) => nextL === undefined || nextU === undefined ? [xL, xU] : [xL === null ? nextL : Math.min(xL, nextL), xU === null ? nextU : Math.max(xU, nextU)];

// Mirrors MultiFocus.setDataParams' own guard (multi_focus.js) and reuses
// convertTopic so an entity that MultiFocus itself would skip (no feature)
// can't still widen the seeded union — the two panes would otherwise
// disagree by construction.
const foldTicXExtent = (layoutSt, ticEntities, extent) => (ticEntities || []).reduce((acc, entity) => {
  const {
    topic,
    feature
  } = entity || {};
  if (!feature || !topic) return acc;
  return widenExtent(acc, d3.extent((0, _chem.convertTopic)(topic, layoutSt, feature, 0), d => d.x));
}, extent);

// Both LC-MS panes need to agree on one x-domain before any zoom. Rather than
// having each D3 focus class separately track the other pane's data, compute
// the union once here and seed it into Redux (seedLcmsUnionExtentAct) — the
// existing lcmsSyncX mirroring in updateZoom (reducer_ui.js) then keeps both
// sweepExtent[0]/[1] on that same value, the same path a real zoom uses.
// Returns null when either side has no data yet, so callers don't commit a
// partial union that would otherwise get stuck once seeded.
const computeLcmsUnionXExtent = (layoutSt, uvvisSeed = [], ticEntities = []) => {
  if (uvvisSeed.length === 0) return null;
  const [uvvisXL, uvvisXU] = widenExtent([null, null], d3.extent(uvvisSeed, d => d.x));
  if (uvvisXL === null) return null;
  const [ticXL, ticXU] = foldTicXExtent(layoutSt, ticEntities, [null, null]);
  if (ticXL === null) return null;
  return {
    xL: Math.min(uvvisXL, ticXL),
    xU: Math.max(uvvisXU, ticXU)
  };
};
exports.computeLcmsUnionXExtent = computeLcmsUnionXExtent;
const isLcmsMsPageLoading = (mzEntities = [], hplcMsSt = {}) => {
  const currentPageValue = hplcMsSt?.tic?.currentPageValue;
  if (!Number.isFinite(currentPageValue)) return false;
  const polarity = hplcMsSt?.tic?.polarity;
  const pickEntity = mzEntities?.find(ent => (0, _extractEntityLCMS.getLcMsInfo)(ent).polarity === polarity) || mzEntities?.[0];
  if (!pickEntity) return true;
  const {
    features
  } = (0, _extractParams.extractParams)(pickEntity, null, null);
  let featuresArr = [];
  if (Array.isArray(features)) {
    featuresArr = features;
  } else if (features && typeof features === 'object') {
    featuresArr = Object.values(features);
  }
  if (featuresArr.length === 0) return true;
  const pageValues = featuresArr.map(feature => (0, _pageValue.parseFeaturePageValue)(feature)).filter(value => Number.isFinite(value));
  if (pageValues.length === 0) return true;
  return !pageValues.some(value => Math.abs(value - currentPageValue) < 1e-5);
};
exports.isLcmsMsPageLoading = isLcmsMsPageLoading;
const styles = () => Object.assign({}, {
  lcMsStackRoot: {
    margin: '0 0 5px 52px',
    // This is the only place the editor mounts three chart containers stacked in one
    // pane instead of a single one. A host stylesheet that stretches a single chart
    // with `.d3Line { height: 100% }` would otherwise make each of the three as tall
    // as this whole pane and push the TIC and m/z graphs out of a bounded, clipped
    // container. As a flex column they share the pane instead, so the stack fits
    // whether or not the host ships such a rule.
    display: 'flex',
    flexDirection: 'column',
    // Load-bearing under a host that makes this node a flex item (chemotion_ELN's
    // `.MuiGrid-grid-xs-9 { display: flex; flex-direction: column }` does), where the
    // initial `min-height: auto` would otherwise resolve to the stack's content size
    // and defeat the shrink below.
    minHeight: 0,
    // All three panes need the SAME flex-basis or the deficit is shared in proportion
    // to basis and one of them is squeezed to a fraction of a third. `height: 100%`
    // rather than `flex-basis: 0`, because a host stylesheet loads after this JSS and
    // chemotion_ELN already puts `height: 100%` on the two bare mounts with a higher
    // specificity than anything reachable from here - a basis of 0 would lose that
    // contest on `.d3Line`/`.d3Multi`, apply to the m/z panel alone, and collapse it to
    // zero. Restating the same declaration agrees with such a host and supplies it for
    // one that bounds our height without styling the mounts itself. Against an
    // unbounded parent it computes to `auto`, i.e. the content height, as before.
    '& > .d3Line, & > .d3Multi': {
      flex: '1 1 auto',
      minHeight: 0,
      height: '100%'
    }
  },
  lcMsToolbarRow: {
    // Never absorb the shrink the chart panes above negotiate.
    flexShrink: 0,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 8,
    rowGap: 4
  },
  lcMsToolbarLeft: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 4,
    rowGap: 4,
    flex: '1 1 auto',
    minWidth: 0
  },
  lcMsToolbarRight: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    columnGap: 8,
    rowGap: 4,
    flex: '0 1 auto'
  },
  lcMsGraphPanel: {
    position: 'relative',
    // Wraps the m/z chart plus its loading overlay, so this - not `.d3Rect` - is the
    // flex item beside the two bare mounts, and takes the same basis as they do.
    flex: '1 1 auto',
    minHeight: 0,
    height: '100%'
  },
  lcMsLoadingOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    pointerEvents: 'none',
    zIndex: 2
  },
  lcMsLoadingIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.18)'
  }
}, _common.commonStyle);
const zoomView = (classes, graphIndex, uiSt, zoomInAct) => {
  const onSweepZoomIn = () => {
    const payload = {
      graphIndex,
      sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN
    };
    zoomInAct(payload);
  };
  const onSweepZoomReset = () => {
    const resetPayload = {
      graphIndex,
      sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET
    };
    zoomInAct(resetPayload);
    // Re-enable zoom brush immediately after reset for LC/MS flow.
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
        className: (0, _classnames.default)('btn-sv-bar-zoomreset'),
        onClick: onSweepZoomReset,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_FindReplaceOutlined.default, {
          className: classes.icon
        })
      })
    })]
  });
};
const wavelengthSelect = (classes, hplcMsSt, updateWavelengthAct) => (0, _wavelengthSelect.default)(classes, hplcMsSt, updateWavelengthAct);
const countAvailableTicPolarities = hplcMsSt => {
  const a = hplcMsSt?.tic?.available;
  if (!a || typeof a !== 'object') return 0;
  return ['positive', 'negative', 'neutral'].filter(k => a[k]).length;
};
const ticSelect = (classes, hplcMsSt, handleTicChanged) => {
  const {
    tic = {}
  } = hplcMsSt || {};
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
  if (filtered.length <= 1) {
    return null;
  }
  const listOptions = filtered;
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
  const optionValues = listOptions.map(d => d.value);
  const resolvedPolarity = optionValues.includes(polarity) ? polarity : optionValues[0];
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
      value: resolvedPolarity,
      onChange: onTicChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-decimal'),
      children: options
    })]
  });
};
class ViewerLineRect extends _react.default.Component {
  constructor(props) {
    super(props);
    this.rootKlassLine = `.${_list_graph.LIST_ROOT_SVG_GRAPH.LINE}`;
    this.rootKlassMulti = `.${_list_graph.LIST_ROOT_SVG_GRAPH.MULTI}`;
    this.rootKlassRect = `.${_list_graph.LIST_ROOT_SVG_GRAPH.RECT}`;
    this.stackRef = /*#__PURE__*/_react.default.createRef();
    this.lineRef = /*#__PURE__*/_react.default.createRef();
    this.multiRef = /*#__PURE__*/_react.default.createRef();
    this.rectRef = /*#__PURE__*/_react.default.createRef();
    this.resizeObserver = null;
    this.resizeFrame = null;
    // Kept in step with the focus objects below: whatever sizes they were built from are
    // the sizes the svg viewBoxes must use, so the two are set together and never drift.
    this.currentSizes = null;

    // Nothing is mounted yet, so this resolves to the fallback; componentDidMount
    // re-measures and rebuilds against the real panes.
    this.currentSizes = this.resolvePaneSizes();
    this.createFocuses(this.currentSizes);
    this.handleResize = this.handleResize.bind(this);
    this.extractSubView = this.extractSubView.bind(this);
    this.notifyHostOnSubViewerChange = this.notifyHostOnSubViewerChange.bind(this);
    this.extractUvvisView = this.extractUvvisView.bind(this);
    this.handleUvvisUndo = this.handleUvvisUndo.bind(this);
    this.handleUvvisRedo = this.handleUvvisRedo.bind(this);
    this.maybeSeedUnionXExtent = this.maybeSeedUnionXExtent.bind(this);
  }
  componentDidMount() {
    this.setupResizeObserver();
    this.mountCharts(this.resolvePaneSizes(), true);
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
      integrationSt,
      editPeakSt
    } = this.props;
    const {
      zoom
    } = uiSt;
    const {
      sweepExtent
    } = zoom || {};
    if (!Array.isArray(sweepExtent)) return;
    const uvvisViewFeature = this.extractUvvisView();
    let uvvisSeed = [];
    if (uvvisViewFeature?.data?.[0]) {
      const hasLineSvg = !!document.querySelector(`${this.rootKlassLine} .${_list_graph.LIST_BRUSH_SVG_GRAPH.LINE}`);
      if (!hasLineSvg) {
        (0, _draw.drawMain)(this.rootKlassLine, this.currentSizes.line.width, this.currentSizes.line.height, _list_graph.LIST_BRUSH_SVG_GRAPH.LINE);
      }
      const currentData = uvvisViewFeature.data[0];
      const {
        x,
        y
      } = currentData;
      uvvisSeed = toSeed(x, y);
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
          integrationSt,
          hplcMsSt,
          editPeakSt
        });
      }
      (0, _draw.drawLabel)(this.rootKlassLine, null, 'Minutes', 'Intensity');
      (0, _draw.drawDisplay)(this.rootKlassLine, false);
    }
    this.maybeSeedUnionXExtent(layoutSt, uvvisSeed, ticEntities);
    if (this.multiFocus) {
      const hasMultiSvg = !!document.querySelector(`${this.rootKlassMulti} .${_list_graph.LIST_BRUSH_SVG_GRAPH.MULTI}`);
      if (!hasMultiSvg) {
        (0, _draw.drawMain)(this.rootKlassMulti, this.currentSizes.multi.width, this.currentSizes.multi.height, _list_graph.LIST_BRUSH_SVG_GRAPH.MULTI);
      }
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
    const ticPolarityCount = countAvailableTicPolarities(hplcMsSt);
    let ticLabel = null;
    if (ticPolarityCount > 1) {
      ticLabel = 'NEUTRAL';
      if (polarity === 'negative') {
        ticLabel = 'MINUS';
      } else if (polarity === 'positive') {
        ticLabel = 'PLUS';
      }
    }
    (0, _draw.drawLabel)(this.rootKlassMulti, ticLabel, 'Minutes', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassMulti, isHidden);
    this.notifyHostOnSubViewerChange(prevProps);
    const subViewFeature = this.extractSubView();
    if (subViewFeature) {
      const hasRectSvg = !!document.querySelector(`${this.rootKlassRect} .${_list_graph.LIST_BRUSH_SVG_GRAPH.RECT}`);
      if (!hasRectSvg) {
        (0, _draw.drawMain)(this.rootKlassRect, this.currentSizes.rect.width, this.currentSizes.rect.height, _list_graph.LIST_BRUSH_SVG_GRAPH.RECT);
      }
      const {
        threshold
      } = hplcMsSt;
      const curTrEndPts = (0, _chem.convertThresEndPts)(subViewFeature, threshold.value);
      const {
        data
      } = subViewFeature;
      const pageValue = (0, _pageValue.parseFeaturePageValue)(subViewFeature);
      const labelValue = Number.isFinite(pageValue) ? pageValue : subViewFeature?.pageValue ?? subViewFeature?.page ?? null;
      const currentData = data[0];
      const {
        x,
        y
      } = currentData;
      const subSeed = toSeed(x, y);
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
    this.teardownResizeObserver();
    (0, _draw.drawDestroy)(this.rootKlassLine);
    (0, _draw.drawDestroy)(this.rootKlassMulti);
    (0, _draw.drawDestroy)(this.rootKlassRect);
  }

  // Redraw only when a pane actually changed size. Against an unbounded host the measured
  // size is the one the current viewBox already produces, so this settles after the first
  // pass instead of feeding itself.
  handleResize() {
    // Never mutate layout synchronously inside a ResizeObserver callback. The remount
    // resizes the subtree being observed, and the browser abandons the delivery pass with
    // "ResizeObserver loop completed with undelivered notifications" - which surfaces as
    // an uncaught application error, not just a console warning. Deferring to the next
    // frame lets the observer finish before anything moves.
    //
    // d3_multi remounts synchronously and gets away with it because its resize path is
    // gated to Cyclic Voltammetry, whose container height is fixed by CSS and so cannot
    // be fed back into by a redraw. This stack has no such guarantee.
    if (this.resizeFrame != null) return;
    this.resizeFrame = window.requestAnimationFrame(() => {
      this.resizeFrame = null;
      const sizes = this.resolvePaneSizes();
      if (sameSizes(sizes, this.currentSizes)) return;
      this.mountCharts(sizes, false);
    });
  }
  handleUvvisUndo() {
    const {
      uvvisUndoAct
    } = this.props;
    uvvisUndoAct();
  }
  handleUvvisRedo() {
    const {
      uvvisRedoAct
    } = this.props;
    uvvisRedoAct();
  }
  setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    if (!this.stackRef.current || this.resizeObserver) return;
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.stackRef.current);
  }

  // Measure every pane, so a stack whose three panes differ in height (a host that has
  // not equalised them) still gets a correct viewBox each.
  resolvePaneSizes() {
    const fallback = {
      width: W,
      height: H
    };
    return {
      line: measurePane(this.lineRef?.current) || fallback,
      multi: measurePane(this.multiRef?.current) || fallback,
      rect: measurePane(this.rectRef?.current) || fallback
    };
  }
  createFocuses(sizes) {
    const {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      ticEntities,
      uvvisEntities,
      uiSt
    } = this.props;
    const shared = {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      uiSt
    };
    this.lineFocus = new _line_focus.default({
      W: sizes.line.width,
      H: sizes.line.height,
      uvvisEntities,
      graphIndex: 0,
      ...shared
    });
    this.multiFocus = new _multi_focus.default({
      W: sizes.multi.width,
      H: sizes.multi.height,
      ticEntities,
      graphIndex: 1,
      ...shared
    });
    this.rectFocus = new _rect_focus.default({
      W: sizes.rect.width,
      H: sizes.rect.height,
      graphIndex: 2,
      ...shared
    });
  }
  teardownResizeObserver() {
    if (this.resizeFrame != null) {
      window.cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  // The whole draw sequence, parameterised by pane size so a resize can re-run it. Only
  // the first run resets redux (`shouldReset`); a resize must not discard the user's zoom,
  // threshold or selection.
  mountCharts(sizes, shouldReset = false) {
    const {
      curveSt,
      feature,
      ticEntities,
      hplcMsSt,
      tTrEndPts,
      layoutSt,
      isUiAddIntgSt,
      isUiNoBrushSt,
      integrationSt,
      isHidden,
      resetAllAct,
      uiSt,
      editPeakSt
    } = this.props;
    this.currentSizes = sizes;
    (0, _draw.drawDestroy)(this.rootKlassMulti);
    (0, _draw.drawDestroy)(this.rootKlassLine);
    (0, _draw.drawDestroy)(this.rootKlassRect);
    if (shouldReset) {
      resetAllAct(feature);
    }
    this.createFocuses(sizes);
    const {
      zoom
    } = uiSt;
    const {
      sweepExtent
    } = zoom;
    const uvvisViewFeature = this.extractUvvisView();
    let uvvisSeed = [];
    if (uvvisViewFeature?.data?.[0]) {
      const currentData = uvvisViewFeature.data[0];
      const {
        x,
        y
      } = currentData;
      uvvisSeed = toSeed(x, y);
    }
    this.maybeSeedUnionXExtent(layoutSt, uvvisSeed, ticEntities);
    (0, _draw.drawMain)(this.rootKlassLine, sizes.line.width, sizes.line.height, _list_graph.LIST_BRUSH_SVG_GRAPH.LINE);
    this.lineFocus.create({
      filterSeed: uvvisSeed,
      filterPeak: [],
      tTrEndPts,
      layoutSt,
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[0],
      integrationSt,
      isUiAddIntgSt,
      editPeakSt,
      hplcMsSt
    });
    (0, _draw.drawLabel)(this.rootKlassLine, null, 'Minutes', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassLine, false);
    const multiSize = sizes.multi;
    (0, _draw.drawMain)(this.rootKlassMulti, multiSize.width, multiSize.height, _list_graph.LIST_BRUSH_SVG_GRAPH.MULTI);
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

    // Seed the m/z pane with the scan that is currently selected rather than with an
    // empty series. On first mount there is none and this stays [] as before - but a
    // resize remount happens long after componentDidUpdate has drawn a scan here, and
    // recreating the pane empty would silently wipe it with nothing to redraw it.
    const subViewFeature = this.extractSubView();
    let subSeed = [];
    let subTrEndPts = tTrEndPts;
    let subLabel = null;
    if (subViewFeature?.data?.[0]) {
      const {
        x,
        y
      } = subViewFeature.data[0];
      subSeed = toSeed(x, y);
      subTrEndPts = (0, _chem.convertThresEndPts)(subViewFeature, hplcMsSt?.threshold?.value);
      const pageValue = (0, _pageValue.parseFeaturePageValue)(subViewFeature);
      subLabel = Number.isFinite(pageValue) ? pageValue : subViewFeature?.pageValue ?? subViewFeature?.page ?? null;
    }
    (0, _draw.drawMain)(this.rootKlassRect, sizes.rect.width, sizes.rect.height, _list_graph.LIST_BRUSH_SVG_GRAPH.RECT);
    this.rectFocus.create({
      filterSeed: subSeed,
      filterPeak: [],
      tTrEndPts: subTrEndPts,
      layoutSt,
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[2]
    });
    (0, _draw.drawLabel)(this.rootKlassRect, subLabel != null ? `${subLabel} min` : null, 'm/z', 'Intensity');
    (0, _draw.drawDisplay)(this.rootKlassRect, false);
  }

  // Seeds sweepExtent[0]/[1] with the same x-domain (via seedLcmsUnionExtentAct,
  // reusing the existing lcmsSyncX mirroring in updateZoom) whenever both are
  // still unset — i.e. before any zoom, or right after a zoom reset. Skips
  // seeding while either side has no data yet, rather than committing a
  // partial union that would get stuck once one side's data arrives late.
  maybeSeedUnionXExtent(layoutSt, uvvisSeed, ticEntities) {
    const {
      uiSt,
      seedLcmsUnionExtentAct
    } = this.props;
    const sweepExtent = uiSt?.zoom?.sweepExtent;
    if (!Array.isArray(sweepExtent)) return;
    if (sweepExtent[0]?.xExtent || sweepExtent[1]?.xExtent) return;
    const unionXExtent = computeLcmsUnionXExtent(layoutSt, uvvisSeed, ticEntities);
    if (unionXExtent) seedLcmsUnionExtentAct(unionXExtent);
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
    } = (0, _extractParams.extractParams)(uvvisEntities[0], null, null);
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
      hplcMsSt
    } = this.props;
    const {
      polarity
    } = hplcMsSt.tic;
    const pickEntity = mzEntities?.find(ent => (0, _extractEntityLCMS.getLcMsInfo)(ent).polarity === polarity) || mzEntities?.[0];
    if (!pickEntity || !pickEntity.layout) return null;
    const {
      features
    } = (0, _extractParams.extractParams)(pickEntity, null, null);
    let featuresArr = [];
    if (Array.isArray(features)) featuresArr = features;else if (features && typeof features === 'object') featuresArr = Object.values(features);
    if (featuresArr.length === 0) return null;
    const {
      subViewerAt
    } = uiSt;
    const pageValues = featuresArr.map(fe => (0, _pageValue.parseFeaturePageValue)(fe)).filter(val => Number.isFinite(val));
    if (pageValues.length === 0) return featuresArr[0];
    let requestedPageValue;
    if (subViewerAt != null && Number.isFinite(subViewerAt.x)) {
      requestedPageValue = subViewerAt.x;
    } else if (Number.isFinite(hplcMsSt.tic.currentPageValue)) {
      requestedPageValue = hplcMsSt.tic.currentPageValue;
    } else {
      requestedPageValue = pageValues[Math.floor(pageValues.length / 2)];
    }
    const closestPage = (0, _calc.findClosest)(pageValues, requestedPageValue);
    const selectFeature = featuresArr.find(fe => {
      const value = (0, _pageValue.parseFeaturePageValue)(fe);
      return Number.isFinite(value) && Math.abs(value - closestPage) < 1e-9;
    });
    return selectFeature || featuresArr[0];
  }
  notifyHostOnSubViewerChange(prevProps) {
    const {
      uiSt,
      hplcMsSt,
      mzEntities,
      onLcmsPageRequest,
      updateCurrentPageValueAct
    } = this.props;
    const subViewerAt = uiSt?.subViewerAt;
    if (!subViewerAt || !Number.isFinite(subViewerAt.x)) return;
    const prevSubViewerAt = prevProps?.uiSt?.subViewerAt;
    const sameClickAsBefore = prevSubViewerAt && Number.isFinite(prevSubViewerAt.x) && Math.abs(subViewerAt.x - prevSubViewerAt.x) < 1e-9 && Math.abs((subViewerAt.y ?? 0) - (prevSubViewerAt.y ?? 0)) < 1e-9;
    if (sameClickAsBefore) return;
    const {
      polarity
    } = hplcMsSt.tic;
    const pickEntity = mzEntities?.find(ent => (0, _extractEntityLCMS.getLcMsInfo)(ent).polarity === polarity) || mzEntities?.[0];
    if (!pickEntity || !pickEntity.layout) return;
    const {
      features
    } = (0, _extractParams.extractParams)(pickEntity, null, null);
    let featuresArr = [];
    if (Array.isArray(features)) featuresArr = features;else if (features && typeof features === 'object') featuresArr = Object.values(features);
    const pageValues = featuresArr.map(fe => (0, _pageValue.parseFeaturePageValue)(fe)).filter(val => Number.isFinite(val));
    const requestedRt = subViewerAt.x;
    const matchesLoadedScan = pageValues.some(pv => Math.abs(pv - requestedRt) < 1e-5);
    const needsRemoteFetch = !matchesLoadedScan;
    const exactFeature = featuresArr.find(fe => {
      const value = (0, _pageValue.parseFeaturePageValue)(fe);
      return Number.isFinite(value) && Math.abs(value - requestedRt) < 1e-9;
    });
    const requestRetentionTime = exactFeature?.pageSymbol ?? exactFeature?.page ?? exactFeature?.pageValue ?? requestedRt;
    const persistedRt = needsRemoteFetch ? requestedRt : (0, _calc.findClosest)(pageValues, requestedRt);
    const prevPersistedRt = hplcMsSt.tic.currentPageValue;
    if (!Number.isFinite(prevPersistedRt) || Math.abs(persistedRt - prevPersistedRt) > 1e-5) {
      updateCurrentPageValueAct(persistedRt);
    }
    if (needsRemoteFetch && typeof onLcmsPageRequest === 'function') {
      onLcmsPageRequest({
        retentionTime: requestRetentionTime,
        polarity,
        trigger: 'user_click'
      });
    }
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
      ticEntities,
      mzEntities,
      omitUvvisToolbarRow,
      onLcmsPageRequest
    } = this.props;
    const resolvedFeature = feature || {};
    const hasEdit = !!resolvedFeature?.data?.[0]?.x?.length;
    const isMsLoading = isLcmsMsPageLoading(mzEntities, hplcMsSt);
    const handleTicChanged = event => {
      const selectedPolarity = event.target.value;
      updateTicAct({
        polarity: selectedPolarity
      });
      const targetEntity = ticEntities?.find(ent => (0, _extractEntityLCMS.getLcMsInfo)(ent).polarity === selectedPolarity);
      if (targetEntity?.curveIdx !== undefined) {
        selectCurveAct(targetEntity.curveIdx);
      }
      const rt = hplcMsSt?.tic?.currentPageValue;
      // Always notify the host on polarity change so it can fetch the mz page for the
      // other trace. If RT is not set yet, pass undefined — ELN resolves initial RT.
      if (typeof onLcmsPageRequest === 'function') {
        onLcmsPageRequest({
          retentionTime: Number.isFinite(rt) ? rt : undefined,
          polarity: selectedPolarity,
          trigger: 'tic_polarity'
        });
      }
    };
    const handleWavelengthChange = event => {
      selectWavelengthAct(event);
    };
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: `${_list_graph.LIST_HOST_HOOK_CLASS.LCMS_STACK} ${classes.lcMsStackRoot}`,
      ref: this.stackRef,
      children: [omitUvvisToolbarRow ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.lcMsToolbarRow,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: classes.lcMsToolbarLeft,
          children: [zoomView(classes, 0, uiSt, zoomInAct), wavelengthSelect(classes, hplcMsSt, handleWavelengthChange), /*#__PURE__*/(0, _jsxRuntime.jsx)(_integration.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_peak.default, {
            feature: resolvedFeature
          }), (() => {
            const hist = hplcMsSt?.uvvisEditHistory || {
              past: [],
              future: []
            };
            const canUndo = hist.past && hist.past.length > 0;
            const canRedo = hist.future && hist.future.length > 0;
            return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
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
                  onClick: this.handleUvvisUndo,
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
                  onClick: this.handleUvvisRedo,
                  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Redo.default, {
                    className: classes.icon
                  })
                })
              })]
            });
          })()]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.lcMsToolbarRight
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: _list_graph.LIST_ROOT_SVG_GRAPH.LINE,
        ref: this.lineRef
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.lcMsToolbarRow,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: classes.lcMsToolbarLeft,
          children: [zoomView(classes, 1, uiSt, zoomInAct), ticSelect(classes, hplcMsSt, handleTicChanged), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            style: {
              display: 'inline-flex'
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_peak_group.default, {
              feature: resolvedFeature,
              graphIndex: 1
            })
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.lcMsToolbarRight
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: _list_graph.LIST_ROOT_SVG_GRAPH.MULTI,
        ref: this.multiRef
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.lcMsToolbarRow,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: classes.lcMsToolbarLeft,
          children: [zoomView(classes, 2, uiSt, zoomInAct), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r03_threshold.default, {
            feature: resolvedFeature,
            hasEdit: hasEdit
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.lcMsToolbarRight
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: `${_list_graph.LIST_HOST_HOOK_CLASS.LCMS_GRAPH_PANEL} ${classes.lcMsGraphPanel}`,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: _list_graph.LIST_ROOT_SVG_GRAPH.RECT,
          ref: this.rectRef
        }), isMsLoading ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.lcMsLoadingOverlay,
          "data-testid": "lcms-ms-loading",
          "aria-label": "Loading MS spectrum",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: classes.lcMsLoadingIndicator,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.CircularProgress, {
              size: 28
            })
          })
        }) : null]
      })]
    });
  }
}
exports.UnconnectedViewerLineRect = ViewerLineRect;
const mapStateToProps = (state, props) => ({
  curveSt: state.curve,
  tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
  isUiAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
  uiSt: state.ui,
  layoutSt: state.layout,
  hplcMsSt: state.hplcMs,
  editPeakSt: state.editPeak.present,
  integrationSt: state.integration.present,
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
  updateCurrentPageValueAct: _hplc_ms.updateCurrentPageValue,
  uvvisUndoAct: _hplc_ms.uvvisUndo,
  uvvisRedoAct: _hplc_ms.uvvisRedo,
  seedLcmsUnionExtentAct: _ui.seedLcmsUnionExtent
}, dispatch);
ViewerLineRect.propTypes = {
  classes: _propTypes.default.object.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  ticEntities: _propTypes.default.array.isRequired,
  uvvisEntities: _propTypes.default.array.isRequired,
  mzEntities: _propTypes.default.array.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  integrationSt: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object,
  tTrEndPts: _propTypes.default.array.isRequired,
  isUiAddIntgSt: _propTypes.default.bool.isRequired,
  isUiNoBrushSt: _propTypes.default.bool.isRequired,
  resetAllAct: _propTypes.default.func.isRequired,
  clickUiTargetAct: _propTypes.default.func.isRequired,
  selectUiSweepAct: _propTypes.default.func.isRequired,
  scrollUiWheelAct: _propTypes.default.func.isRequired,
  isHidden: _propTypes.default.bool,
  hplcMsSt: _propTypes.default.object.isRequired,
  selectWavelengthAct: _propTypes.default.func.isRequired,
  updateTicAct: _propTypes.default.func.isRequired,
  selectCurveAct: _propTypes.default.func.isRequired,
  zoomInAct: _propTypes.default.func.isRequired,
  editPeakSt: _propTypes.default.object.isRequired,
  updateCurrentPageValueAct: _propTypes.default.func.isRequired,
  uvvisUndoAct: _propTypes.default.func.isRequired,
  uvvisRedoAct: _propTypes.default.func.isRequired,
  seedLcmsUnionExtentAct: _propTypes.default.func.isRequired,
  omitUvvisToolbarRow: _propTypes.default.bool,
  onLcmsPageRequest: _propTypes.default.func
};
ViewerLineRect.defaultProps = {
  feature: {},
  isHidden: false,
  omitUvvisToolbarRow: false,
  onLcmsPageRequest: null
};

// Unconnected class, exported for direct unit testing (e.g. maybeSeedUnionXExtent)
// without mounting the full redux-connected component.
// export default connect(mapStateToProps, mapDispatchToProps)(ViewerLineRect);
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(ViewerLineRect);