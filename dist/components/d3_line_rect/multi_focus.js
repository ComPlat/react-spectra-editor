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
var _format = _interopRequireDefault(require("../../helpers/format"));
var _list_graph = require("../../constants/list_graph");
var _chem = require("../../helpers/chem");
var _extractEntityLCMS = require("../../helpers/extractEntityLCMS");
/* eslint-disable no-unused-vars, prefer-object-spread, no-mixed-operators,
no-unneeded-ternary, arrow-body-style, max-len */

const d3 = require('d3');
class MultiFocus {
  constructor(props) {
    const {
      W,
      H,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      ticEntities,
      graphIndex,
      uiSt
    } = props;
    this.graphIndex = graphIndex;
    this.uiSt = uiSt;
    this.ticEntities = ticEntities;
    this.jcampIdx = 0;
    this.isShowAllCurves = false;
    this.rootKlass = `.${_list_graph.LIST_ROOT_SVG_GRAPH.MULTI}`;
    this.brushClass = `.${_list_graph.LIST_BRUSH_SVG_GRAPH.MULTI}`;
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
    this.otherLineData = [];
    this.pathColor = 'steelblue';
    this.tTrEndPts = null;
    this.root = null;
    this.svg = null;
    this.axisCall = (0, _init.InitAxisCall)(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;
    this.shouldUpdate = {};
    this.layout = _list_layout.LIST_LAYOUT.LC_MS;
    this.getShouldUpdate = this.getShouldUpdate.bind(this);
    this.resetShouldUpdate = this.resetShouldUpdate.bind(this);
    this.setTip = this.setTip.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.drawOtherLines = this.drawOtherLines.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.onClickTarget = this.onClickTarget.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }
  colorForPolarity = polarity => {
    if (polarity === 'negative') return '#2980b9';
    if (polarity === 'neutral') return '#2980b9';
    return '#d35400';
  };
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
  setDataParams(tTrEndPts, layout) {
    let jcampIdx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    this.data = [];
    this.otherLineData = [];
    this.ticEntities.forEach((entry, idx) => {
      const {
        topic,
        feature
      } = entry;
      const {
        polarity = 'neutral'
      } = (0, _extractEntityLCMS.getLcMsInfo)(entry);
      const fixedColor = this.colorForPolarity(polarity);
      if (!feature || !topic) return;
      const currData = (0, _chem.convertTopic)(topic, layout, feature, 0);
      if (idx === jcampIdx) {
        this.data = currData;
        this.pathColor = fixedColor;
      } else {
        this.otherLineData.push({
          data: currData,
          polarity,
          color: fixedColor,
          idx
        });
      }
    });
    this.tTrEndPts = tTrEndPts;
    this.layout = layout;
    this.jcampIdx = jcampIdx;
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
      let allData = [...this.data];
      if (this.otherLineData) {
        this.otherLineData.forEach(lineData => {
          allData = [...allData, ...lineData.data];
        });
      }
      const xes = d3.extent(allData, d => d.x).sort((a, b) => a - b);
      xExtent = {
        xL: xes[0],
        xU: xes[1]
      };
      const btm = d3.min(allData, d => d.y);
      const top = d3.max(allData, d => d.y);
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
    if (!this.path) return;
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    this.updatePathCall(xt, yt);
    this.path.attr('d', this.pathCall(this.data));
    this.path.style('stroke', this.pathColor);
    if (this.layout === _list_layout.LIST_LAYOUT.AIF) {
      this.path.attr('marker-mid', 'url(#arrow-left)');
    }
  }
  drawOtherLines(layout) {
    d3.selectAll('.line-clip-compare').remove();
    if (!this.otherLineData) return null;
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    this.updatePathCall(xt, yt);
    this.otherLineData.forEach((entry, idx) => {
      const {
        data,
        color: pathColor
      } = entry;
      const path = (0, _mount.MountComparePath)(this, pathColor, idx, 0.4);
      path.attr('d', this.pathCall(data));
      if (this.layout === _list_layout.LIST_LAYOUT.AIF && this.isShowAllCurves === true) {
        path.attr('marker-mid', 'url(#arrow-left)');
      }
    });
    return null;
  }
  drawGrid() {
    const {
      sameXY
    } = this.shouldUpdate;
    if (sameXY || !this.grid || !this.axisCall) return;
    if (this.grid.x && this.axisCall.x) {
      this.grid.x.call(this.axisCall.x.tickSize(-this.h, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
    }
    if (this.grid.y && this.axisCall.y) {
      this.grid.y.call(this.axisCall.y.tickSize(-this.w, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
    }
  }
  onClickTarget(event, data) {
    event.stopPropagation();
    event.preventDefault();
    const onPeak = true;
    this.clickUiTargetAct(data, onPeak, false, this.jcampIdx);
  }
  create(_ref) {
    let {
      ticEntities,
      curveSt,
      tTrEndPts,
      layoutSt,
      sweepExtentSt,
      isUiNoBrushSt
    } = _ref;
    this.svg = d3.select(this.rootKlass).select(this.brushClass);
    (0, _mount.MountMainFrame)(this, 'focus');
    (0, _mount.MountClip)(this);
    const {
      curveIdx,
      isShowAllCurve
    } = curveSt;
    const jcampIdx = curveIdx;
    this.isShowAllCurves = isShowAllCurve;
    this.ticEntities = ticEntities;
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = (0, _init.InitScale)(this, false);
    this.setTip();
    this.setDataParams(tTrEndPts, layoutSt, jcampIdx);
    (0, _compass.MountCompass)(this);
    this.axis = (0, _mount.MountAxis)(this);
    this.path = (0, _mount.MountPath)(this, this.pathColor);
    this.grid = (0, _mount.MountGrid)(this);
    this.tags = (0, _mount.MountTags)(this);
    (0, _mount.MountAxisLabelX)(this);
    (0, _mount.MountAxisLabelY)(this);
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.drawLine();
      this.drawGrid();
      this.drawOtherLines(layoutSt);
    }
    (0, _brush.default)(this, false, isUiNoBrushSt, this.brushClass);
    this.resetShouldUpdate();
  }
  update(_ref2) {
    let {
      curveSt,
      tTrEndPts,
      layoutSt,
      ticEntities,
      sweepExtentSt,
      isUiNoBrushSt,
      uiSt
    } = _ref2;
    this.svg = d3.select(this.rootKlass).select(this.brushClass);
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = (0, _init.InitScale)(this, false);
    const {
      curveIdx,
      isShowAllCurve
    } = curveSt;
    const jcampIdx = curveIdx;
    this.isShowAllCurves = isShowAllCurve;
    this.ticEntities = ticEntities;
    this.uiSt = uiSt;
    this.setDataParams(tTrEndPts, layoutSt, jcampIdx);
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.getShouldUpdate();
      this.drawLine();
      this.drawGrid();
      this.drawOtherLines(layoutSt);
    }
    (0, _brush.default)(this, false, isUiNoBrushSt, this.brushClass);
    this.resetShouldUpdate();
  }
}
var _default = exports.default = MultiFocus;