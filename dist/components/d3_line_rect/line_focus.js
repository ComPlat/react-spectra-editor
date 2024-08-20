"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _init = require("../../helpers/init");
var _mount = require("../../helpers/mount");
var _brush = _interopRequireDefault(require("../../helpers/brush"));
var _compass = require("../../helpers/compass");
var _list_layout = require("../../constants/list_layout");
var _list_graph = require("../../constants/list_graph");
/* eslint-disable prefer-object-spread, no-mixed-operators */

const d3 = require('d3');
class LineFocus {
  constructor(props) {
    const {
      W,
      H,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct
    } = props;
    this.jcampIdx = 0;
    this.rootKlass = `.${_list_graph.LIST_ROOT_SVG_GRAPH.LINE}`;
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
    this.brushX = d3.brushX();
    this.axis = null;
    this.path = null;
    this.grid = null;
    this.tags = null;
    this.data = [];
    this.tTrEndPts = null;
    this.root = null;
    this.svg = null;
    this.axisCall = (0, _init.InitAxisCall)(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;
    this.shouldUpdate = {};
    this.layout = _list_layout.LIST_LAYOUT.H1;
    this.getShouldUpdate = this.getShouldUpdate.bind(this);
    this.resetShouldUpdate = this.resetShouldUpdate.bind(this);
    this.setTip = this.setTip.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.onClickTarget = this.onClickTarget.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }
  getShouldUpdate() {
    const {
      prevXt,
      prevYt,
      prevLySt,
      prevTePt,
      prevData
    } = this.shouldUpdate;
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const sameXY = xt(1.1) === prevXt && prevYt === yt(1.1);
    const sameLySt = prevLySt === this.layout;
    const sameTePt = prevTePt === this.tTrEndPts.length;
    const sameData = prevData === this.data.length;
    this.shouldUpdate = Object.assign({}, this.shouldUpdate, {
      sameXY,
      sameLySt,
      // eslint-disable-line
      sameTePt,
      sameData // eslint-disable-line
    });
  }
  resetShouldUpdate() {
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const prevXt = xt(1.1);
    const prevYt = yt(1.1);
    const prevTePt = this.tTrEndPts.length;
    const prevData = this.data.length;
    const prevLySt = this.layout;
    this.shouldUpdate = Object.assign({}, this.shouldUpdate, {
      prevXt,
      prevYt,
      prevLySt,
      // eslint-disable-line
      prevTePt,
      prevData // eslint-disable-line
    });
  }
  setTip() {
    this.tip = (0, _init.InitTip)();
    this.root.call(this.tip);
  }
  setDataParams(data, tTrEndPts, layout) {
    this.data = [...data];
    this.tTrEndPts = tTrEndPts;
    this.layout = layout;
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
        xL: xes[0],
        xU: xes[1]
      };
      const btm = d3.min(this.data, d => d.y);
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
  drawLine() {
    const {
      sameXY
    } = this.shouldUpdate;
    if (sameXY) return;
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    this.updatePathCall(xt, yt);
    this.path.attr('d', this.pathCall(this.data));
  }
  drawGrid() {
    const {
      sameXY
    } = this.shouldUpdate;
    if (sameXY) return;
    this.grid.x.call(this.axisCall.x.tickSize(-this.h, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
    this.grid.y.call(this.axisCall.y.tickSize(-this.w, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
  }
  onClickTarget(event, data) {
    event.stopPropagation();
    event.preventDefault();
    const onPeak = true;
    this.clickUiTargetAct(data, onPeak);
  }
  create(_ref) {
    let {
      filterSeed,
      tTrEndPts,
      layoutSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt
    } = _ref;
    this.svg = d3.select('.d3Svg');
    (0, _mount.MountMainFrame)(this, 'focus');
    (0, _mount.MountClip)(this);
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = (0, _init.InitScale)(this, false);
    this.setTip();
    this.setDataParams(filterSeed, tTrEndPts, layoutSt);
    (0, _compass.MountCompass)(this);
    this.axis = (0, _mount.MountAxis)(this);
    this.path = (0, _mount.MountPath)(this, 'steelblue');
    this.grid = (0, _mount.MountGrid)(this);
    this.tags = (0, _mount.MountTags)(this);
    (0, _mount.MountAxisLabelX)(this);
    (0, _mount.MountAxisLabelY)(this);
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.drawLine();
      this.drawGrid();
    }
    (0, _brush.default)(this, isUiAddIntgSt, isUiNoBrushSt);
    this.resetShouldUpdate();
  }
  update(_ref2) {
    let {
      filterSeed,
      tTrEndPts,
      layoutSt,
      sweepExtentSt,
      isUiAddIntgSt,
      isUiNoBrushSt
    } = _ref2;
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = (0, _init.InitScale)(this, false);
    this.setDataParams(filterSeed, tTrEndPts, layoutSt);
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.getShouldUpdate();
      this.drawLine();
      this.drawGrid();
    }
    (0, _brush.default)(this, isUiAddIntgSt, isUiNoBrushSt);
    this.resetShouldUpdate();
  }
}
var _default = exports.default = LineFocus;