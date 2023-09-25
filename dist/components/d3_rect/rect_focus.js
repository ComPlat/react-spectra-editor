"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var d3 = _interopRequireWildcard(require("d3"));
var _init = require("../../helpers/init");
var _brush = _interopRequireDefault(require("../../helpers/brush"));
var _mount = require("../../helpers/mount");
var _compass = require("../../helpers/compass");
var _converter = require("../../helpers/converter");
var _list_layout = require("../../constants/list_layout");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class RectFocus {
  constructor(props) {
    const {
      W,
      H,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
    } = props;
    this.rootKlass = '.d3Rect';
    this.margin = {
      t: 5,
      b: 40,
      l: 60,
      r: 5
    };
    this.w = W - this.margin.l - this.margin.r;
    this.h = H - this.margin.t - this.margin.b;
    this.clickUiTargetAct = clickUiTargetAct;
    this.selectUiSweepAct = selectUiSweepAct;
    this.scrollUiWheelAct = scrollUiWheelAct;
    this.brush = d3.brush();
    this.axis = null;
    this.thresLine = null;
    this.grid = null;
    this.ref = null;
    this.ccPattern = null;
    this.data = [];
    this.dataPks = [];
    this.tTrEndPts = null;
    this.tSfPeaks = null;
    this.root = null;
    this.svg = null;
    this.bars = null;
    this.scales = (0, _init.InitScale)(this, false);
    this.axisCall = (0, _init.InitAxisCall)(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;
    this.layout = _list_layout.LIST_LAYOUT.MS;
    this.setTip = this.setTip.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.drawBar = this.drawBar.bind(this);
    this.drawThres = this.drawThres.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.mergedPeaks = this.mergedPeaks.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }
  setTip() {
    this.tip = (0, _init.InitTip)();
    this.root.call(this.tip);
  }
  setDataParams(data, peaks, tTrEndPts, tSfPeaks) {
    this.data = [...data];
    this.dataPks = [...peaks];
    this.tTrEndPts = tTrEndPts;
    this.tSfPeaks = tSfPeaks;
  }
  updatePathCall(xt, yt) {
    this.pathCall = d3.line().x(d => xt(d.x)).y(d => yt(d.y));
  }
  setConfig(sweepExtentSt) {
    // Domain Calculate
    let {
      xExtent,
      yExtent
    } = sweepExtentSt || {
      xExtent: false,
      yExtent: false
    };
    if (!xExtent || !yExtent) {
      const xes = d3.extent(this.data, d => d.x).sort((a, b) => a - b);
      xExtent = {
        xL: xes[0] - 10,
        xU: xes[1] + 10
      };
      const btm = 0; // MS baseline is always 0.
      const top = d3.max(this.data, d => d.y);
      const height = top - btm;
      yExtent = {
        yL: btm - this.factor * height,
        yU: top + this.factor * height
      };
    }
    this.scales.x.domain([xExtent.xL, xExtent.xU]);
    this.scales.y.domain([yExtent.yL, yExtent.yU]);

    // rescale for zoom
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);

    // Axis Call
    this.axisCall.x.scale(xt);
    this.axisCall.y.scale(yt);
    this.currentExtent = {
      xExtent,
      yExtent
    };
  }
  posHeight(gnd, val) {
    const h = gnd - val;
    return h >= 0 ? h : 0;
  }
  barColor(y, yRef) {
    return y >= yRef ? 'steelblue' : '#aaa';
  }
  drawBar() {
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    this.updatePathCall(xt, yt);
    const yRef = this.tTrEndPts[0].y;
    const bars = this.bars.selectAll('rect').data(this.data);
    bars.exit().attr('class', 'exit').remove();
    const gnd = yt(0);
    bars.enter().append('rect').attr('class', 'enter-bar').attr('width', 1.5).merge(bars).attr('fill', d => this.barColor(d.y, yRef)).attr('height', d => this.posHeight(gnd, yt(d.y))).attr('id', d => `mpp${Math.round(1000 * d.x)}`).attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)})`).on('mouseover', (d, i, n) => {
      d3.select(`#mpp${Math.round(1000 * d.x)}`).attr('stroke-opacity', '1.0');
      d3.select(`#bpt${Math.round(1000 * d.x)}`).style('fill', 'blue');
      const tipParams = {
        d,
        layout: this.layout
      };
      this.tip.show(tipParams, n[i]);
    }).on('mouseout', (d, i, n) => {
      d3.select(`#mpp${Math.round(1000 * d.x)}`).attr('stroke-opacity', '1.0');
      d3.select(`#bpt${Math.round(1000 * d.x)}`).style('fill', 'red');
      const tipParams = {
        d,
        layout: this.layout
      };
      this.tip.hide(tipParams, n[i]);
    });
  }
  drawThres() {
    if (this.tTrEndPts.length > 0) {
      this.thresLine.attr('d', this.pathCall(this.tTrEndPts));
      this.thresLine.attr('visibility', 'visible');
    } else {
      this.thresLine.attr('visibility', 'hidden');
    }
  }
  drawGrid() {
    this.grid.x.call(this.axisCall.x.tickSize(-this.h, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
    this.grid.y.call(this.axisCall.y.tickSize(-this.w, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
  }
  mergedPeaks(editPeakSt) {
    if (!editPeakSt) return this.dataPks;
    this.dataPks = (0, _converter.PksEdit)(this.dataPks, editPeakSt);
    return this.dataPks;
  }
  create(_ref) {
    let {
      filterSeed,
      filterPeak,
      tTrEndPts,
      tSfPeaks,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt
    } = _ref;
    this.svg = d3.select('.d3Svg');
    (0, _mount.MountMainFrame)(this, 'focus');
    (0, _mount.MountClip)(this);
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.setTip();
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks);
    (0, _compass.MountCompass)(this);
    this.axis = (0, _mount.MountAxis)(this);
    [this.thresLine] = (0, _mount.MountThresLine)(this, 'green');
    this.grid = (0, _mount.MountGrid)(this);
    this.ref = (0, _mount.MountRef)(this);
    this.bars = (0, _mount.MountBars)(this);
    (0, _mount.MountAxisLabelX)(this);
    (0, _mount.MountAxisLabelY)(this);
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.drawBar();
      this.drawThres();
      this.drawGrid();
    }
    (0, _brush.default)(this, isUiAddIntgSt, isUiNoBrushSt);
  }
  update(_ref2) {
    let {
      filterSeed,
      filterPeak,
      tTrEndPts,
      tSfPeaks,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt
    } = _ref2;
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks);
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.drawBar();
      this.drawThres();
      this.drawGrid();
    }
    (0, _brush.default)(this, isUiAddIntgSt, isUiNoBrushSt);
  }
}
var _default = exports.default = RectFocus;