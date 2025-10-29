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
var _calc = require("../../helpers/calc");
var _focus = require("../../helpers/focus");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _format = _interopRequireDefault(require("../../helpers/format"));
var _integration = require("../../helpers/integration");
/* eslint-disable prefer-object-spread, no-mixed-operators */

const d3 = require('d3');
class LineFocus {
  constructor(props) {
    const {
      W,
      H,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      graphIndex,
      uiSt
    } = props;
    this.graphIndex = graphIndex;
    this.uiSt = uiSt;
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
    this.drawAUC = this.drawAUC.bind(this);
    this.drawInteg = this.drawInteg.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }
  getShouldUpdate(hplcMsSt) {
    const {
      prevXt,
      prevYt,
      prevLySt,
      prevItSt,
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
    const currentSpectrum = hplcMsSt?.uvvis?.currentSpectrum;
    const sameItSt = prevItSt === currentSpectrum?.integrations?.length;
    const sameData = prevData === this.data.length;
    this.shouldUpdate = Object.assign({}, this.shouldUpdate, {
      sameXY,
      sameLySt,
      // eslint-disable-line
      sameTePt,
      sameData,
      sameItSt // eslint-disable-line
    });
  }
  resetShouldUpdate(hplcMsSt) {
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const prevXt = xt(1.1);
    const prevYt = yt(1.1);
    const prevTePt = this.tTrEndPts.length;
    const prevData = this.data.length;
    const prevLySt = this.layout;
    const currentSpectrum = hplcMsSt?.uvvis?.currentSpectrum;
    const prevItSt = currentSpectrum?.integrations?.length;
    this.shouldUpdate = Object.assign({}, this.shouldUpdate, {
      prevXt,
      prevYt,
      prevLySt,
      // eslint-disable-line
      prevTePt,
      prevData,
      prevItSt // eslint-disable-line
    });
  }
  setTip() {
    this.tip = (0, _init.InitTip)();
    this.root.call(this.tip);
  }
  setDataParams(data, tTrEndPts, layout, editPeakSt) {
    this.data = [...data];
    this.data = data.map(d => ({
      x: d.x / 60,
      y: d.y
    }));
    this.tTrEndPts = tTrEndPts;
    this.layout = layout;
    this.editPeakSt = editPeakSt;
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
    if (!this.path) return;
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
    this.clickUiTargetAct(data, onPeak);
  }
  drawAUC(stack) {
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const auc = this.tags.aucPath.selectAll('path').data(stack, d => (0, _focus.itgIdTag)(d));
    auc.exit().attr('class', 'exit').remove();
    const integCurve = border => {
      const {
        xL,
        xU
      } = border.xExtent;
      const ps = this.data.filter(d => d.x > xL && d.x < xU);
      if (!ps[0]) return null;
      const point1 = ps[0];
      const point2 = ps[ps.length - 1];
      const slope = (0, _calc.calcSlope)(point1.x, point1.y, point2.x, point2.y);
      let lastDY = point1.y;
      return d3.area().x(d => xt(d.x)).y0((d, index) => {
        if (index > 0) {
          const lastD = ps[index - 1];
          const y = slope * (d.x - lastD.x) + lastDY;
          lastDY = y;
          return yt(y);
        }
        return yt(0);
      }).y1(d => yt(d.y))(ps);
    };
    auc.enter().append('path').attr('class', 'auc').attr('fill', 'red').attr('stroke', 'none').attr('fill-opacity', 0.2).attr('stroke-width', 2).merge(auc).attr('d', d => integCurve(d)).attr('id', d => `auc${(0, _focus.itgIdTag)(d)}`).on('mouseover', function () {
      d3.select(this).attr('stroke', 'blue').style('fill', 'blue');
    }).on('mouseout', function () {
      d3.select(this).attr('stroke', 'none').style('fill', 'red').style('fill-opacity', 0.2);
    }).on('click', (event, d) => this.onClickTarget(event, d));
  }
  drawInteg(hplcMsSt) {
    const {
      sameXY,
      sameLySt,
      sameItSt,
      sameData
    } = this.shouldUpdate;
    if (sameXY && sameLySt && sameItSt && sameData) return;
    const isDisable = _cfg.default.btnCmdIntg(this.layout);
    const ignoreRef = _format.default.isLCMsLayout(this.layout);
    const currentSpectrum = hplcMsSt?.uvvis?.currentSpectrum;
    const currentIntegrations = currentSpectrum?.integrations || [];
    const currentRefArea = currentSpectrum?.refArea || 0;
    const currentRefFactor = currentSpectrum?.refFactor || 1;
    const igbp = this.tags.igbPath.selectAll('path').data(currentIntegrations, d => (0, _focus.itgIdTag)(d));
    igbp.exit().attr('class', 'exit').remove();
    const igcp = this.tags.igcPath.selectAll('path').data(currentIntegrations, d => (0, _focus.itgIdTag)(d));
    igcp.exit().attr('class', 'exit').remove();
    const igtp = this.tags.igtPath.selectAll('text').data(currentIntegrations, d => (0, _focus.itgIdTag)(d));
    igtp.exit().attr('class', 'exit').remove();
    if (currentIntegrations.length === 0 || isDisable) {
      // remove drawn area under curve
      const auc = this.tags.aucPath.selectAll('path').data(currentIntegrations);
      auc.exit().attr('class', 'exit').remove();
      auc.merge(auc);
      return;
    }
    if (ignoreRef) {
      this.drawAUC(currentIntegrations);
    } else {
      // rescale for zoom
      const {
        xt
      } = (0, _compass.TfRescale)(this);
      const dh = 50;
      const integBar = data => {
        const points = [[xt(data.xL), dh], [xt(data.xL), dh - 10], [xt(data.xL), dh - 5], [xt(data.xU), dh - 5], [xt(data.xU), dh - 10], [xt(data.xU), dh]];
        return d3.line()(points);
      };
      igbp.enter().append('path').attr('class', 'igbp').attr('fill', 'none').attr('stroke', '#228B22').attr('stroke-width', 2).merge(igbp).attr('id', d => `igbp${(0, _focus.itgIdTag)(d)}`).attr('d', d => integBar(d)).on('mouseover', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', 'blue');
      }).on('mouseout', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', '#228B22');
      }).on('click', (event, d) => this.onClickTarget(event, d));
      const integCurve = border => {
        const {
          xL,
          xU
        } = border;
        const ps = this.data.filter(d => d.x > xL && d.x < xU);
        const kMax = this.data[this.data.length - 1].k;
        if (!ps[0]) return null;
        const kRef = ps[0].k;
        if (!this.reverseXAxis(this.layout)) {
          return d3.line().x(d => xt(d.x)).y(d => 100 - (kRef - d.k) * 400 / kMax)(ps);
        }
        return d3.line().x(d => xt(d.x)).y(d => 300 - (d.k - kRef) * 400 / kMax)(ps);
      };
      igcp.enter().append('path').attr('class', 'igcp').attr('fill', 'none').attr('stroke', '#228B22').attr('stroke-width', 2).merge(igcp).attr('id', d => `igbc${(0, _focus.itgIdTag)(d)}`).attr('d', d => integCurve(d)).on('mouseover', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', 'blue');
      }).on('mouseout', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', '#228B22');
      }).on('click', (event, d) => this.onClickTarget(event, d));
      igtp.enter().append('text').attr('class', 'igtp').attr('font-family', 'Helvetica').style('font-size', '12px').attr('fill', '#228B22').style('text-anchor', 'middle').merge(igtp).attr('id', d => `igtp${(0, _focus.itgIdTag)(d)}`).text(d => (0, _integration.calcArea)(d, currentRefArea, currentRefFactor, ignoreRef)).attr('transform', d => {
        const x = xt((d.xL + d.xU) / 2);
        const y = dh - 12;
        return `translate(${x}, ${y})`;
      }).on('mouseover', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', 'blue');
      }).on('mouseout', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', '#228B22');
      }).on('click', (event, d) => this.onClickTarget(event, d));
    }
  }
  mergedPeaks(hplcMsSt) {
    const currentSpectrum = hplcMsSt?.uvvis?.currentSpectrum;
    if (!currentSpectrum || !currentSpectrum.peaks) return [];
    return currentSpectrum.peaks;
  }
  drawPeaks(hplcMsSt) {
    const {
      sameXY,
      sameEpSt,
      sameDtPk,
      sameSfPk
    } = this.shouldUpdate;
    if (sameXY && sameEpSt && sameDtPk && sameSfPk) return;
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const dPks = this.mergedPeaks(hplcMsSt);
    const mpp = this.tags.pPath.selectAll('path').data(dPks);
    mpp.exit().remove();
    const linePath = [{
      x: -0.5,
      y: 10
    }, {
      x: -0.5,
      y: -20
    }, {
      x: 0.5,
      y: -20
    }, {
      x: 0.5,
      y: 10
    }];
    const lineSymbol = d3.line().x(d => d.x).y(d => d.y)(linePath);
    mpp.enter().append('path').attr('d', lineSymbol).attr('class', 'enter-peak').attr('fill', 'red').attr('stroke', 'pink').attr('stroke-width', 3).attr('stroke-opacity', 0.0).merge(mpp).attr('id', d => `mpp${Math.round(1000 * d.x)}`).attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)})`).on('mouseover', (event, d) => {
      d3.select(`#mpp${Math.round(1000 * d.x)}`).attr('stroke-opacity', '1.0');
      const tipParams = {
        d,
        layout: this.layout
      };
      this.tip.show(tipParams, event.target);
    }).on('mouseout', (event, d) => {
      d3.select(`#mpp${Math.round(1000 * d.x)}`).attr('stroke-opacity', '0.0');
      const tipParams = {
        d,
        layout: this.layout
      };
      this.tip.hide(tipParams, event.target);
    }).on('click', (event, d) => this.onClickTarget(event, d));
    if (_format.default.isLCMsLayout(this.layout)) {
      const bpTxt = this.tags.bpTxt.selectAll('text').data(dPks);
      bpTxt.exit().remove();
      bpTxt.enter().append('text').attr('class', 'peak-text').attr('font-family', 'Helvetica').style('font-size', '12px').attr('fill', '#228B22').style('text-anchor', 'middle').merge(bpTxt).attr('id', d => `txt${Math.round(1000 * d.x)}`).text(d => d.x.toFixed(2)).attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y) - 25})`).on('click', (event, d) => this.onClickTarget(event, d));
    }
  }
  create({
    filterSeed,
    tTrEndPts,
    layoutSt,
    sweepExtentSt,
    isUiAddIntgSt,
    isUiNoBrushSt,
    hplcMsSt,
    editPeakSt
  }) {
    this.svg = d3.select('.d3Svg');
    (0, _mount.MountMainFrame)(this, 'focus');
    (0, _mount.MountClip)(this);
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    if (!this.root || this.root.empty()) {
      console.error('Failed to initialize root element');
      return;
    }
    this.scales = (0, _init.InitScale)(this, false);
    this.setTip();
    this.setDataParams(filterSeed, tTrEndPts, layoutSt, editPeakSt);
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
      this.drawPeaks(hplcMsSt);
      this.drawGrid();
      this.drawInteg(hplcMsSt);
    }
    (0, _brush.default)(this, isUiAddIntgSt, isUiNoBrushSt);
    this.resetShouldUpdate(hplcMsSt);
  }
  reverseXAxis(layoutSt) {
    return [_list_layout.LIST_LAYOUT.UVVIS, _list_layout.LIST_LAYOUT.HPLC_UVVIS, _list_layout.LIST_LAYOUT.TGA, _list_layout.LIST_LAYOUT.DSC, _list_layout.LIST_LAYOUT.XRD, _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY, _list_layout.LIST_LAYOUT.CDS, _list_layout.LIST_LAYOUT.DLS_ACF, _list_layout.LIST_LAYOUT.SEC, _list_layout.LIST_LAYOUT.GC, _list_layout.LIST_LAYOUT.EMISSIONS, _list_layout.LIST_LAYOUT.DLS_INTENSITY].indexOf(layoutSt) < 0;
  }
  update({
    filterSeed,
    tTrEndPts,
    layoutSt,
    sweepExtentSt,
    isUiAddIntgSt,
    isUiNoBrushSt,
    uiSt,
    hplcMsSt,
    editPeakSt
  }) {
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = (0, _init.InitScale)(this, false);
    this.setDataParams(filterSeed, tTrEndPts, layoutSt, editPeakSt);
    this.uiSt = uiSt;
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.getShouldUpdate(hplcMsSt);
      this.drawLine();
      this.drawGrid();
      this.drawPeaks(hplcMsSt);
      this.drawInteg(hplcMsSt);
    }
    (0, _brush.default)(this, isUiAddIntgSt, isUiNoBrushSt);
    this.resetShouldUpdate(hplcMsSt);
  }
}
var _default = exports.default = LineFocus;