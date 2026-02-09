/* eslint-disable no-unused-vars, prefer-object-spread, no-mixed-operators,
no-unneeded-ternary, arrow-body-style, max-len */
import {
  InitScale, InitAxisCall, InitTip,
} from '../../helpers/init';
import {
  MountPath, MountGrid, MountAxis, MountAxisLabelX, MountAxisLabelY,
  MountClip, MountMainFrame, MountTags, MountComparePath,
} from '../../helpers/mount';
import MountBrush from '../../helpers/brush';
import { TfRescale, MountCompass } from '../../helpers/compass';
import { LIST_LAYOUT } from '../../constants/list_layout';
import Format from '../../helpers/format';
import { LIST_ROOT_SVG_GRAPH, LIST_BRUSH_SVG_GRAPH } from '../../constants/list_graph';
import {
  convertTopic,
} from '../../helpers/chem';
import { getLcMsInfo } from '../../helpers/extractEntityLCMS';

const d3 = require('d3');

class MultiFocus {
  constructor(props) {
    const {
      W, H, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct, ticEntities, graphIndex, uiSt,
    } = props;
    this.graphIndex = graphIndex;
    this.uiSt = uiSt;
    this.ticEntities = ticEntities;
    this.jcampIdx = 0;
    this.isShowAllCurves = false;
    this.rootKlass = `.${LIST_ROOT_SVG_GRAPH.MULTI}`;
    this.brushClass = `.${LIST_BRUSH_SVG_GRAPH.MULTI}`;
    this.margin = {
      t: 5,
      b: 40,
      l: 60,
      r: 5,
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
    this.axisCall = InitAxisCall(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;
    this.shouldUpdate = {};
    this.layout = LIST_LAYOUT.LC_MS;

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

  colorForPolarity = (polarity) => {
    if (polarity === 'negative') return '#2980b9';
    if (polarity === 'neutral') return '#2980b9';
    return '#d35400';
  };

  getShouldUpdate() {
    const {
      prevXt, prevYt, prevLySt,
      prevTePt, prevData,
    } = this.shouldUpdate;
    const { xt, yt } = TfRescale(this);
    const sameXY = xt(1.1) === prevXt && prevYt === yt(1.1);
    const sameLySt = prevLySt === this.layout;
    const sameTePt = prevTePt === this.tTrEndPts.length;
    const sameData = prevData === this.data.length;
    this.shouldUpdate = Object.assign(
      {},
      this.shouldUpdate,
      {
        sameXY, sameLySt, // eslint-disable-line
        sameTePt, sameData, // eslint-disable-line
      },
    );
  }

  resetShouldUpdate() {
    const { xt, yt } = TfRescale(this);
    const prevXt = xt(1.1);
    const prevYt = yt(1.1);
    const prevTePt = this.tTrEndPts.length;
    const prevData = this.data.length;
    const prevLySt = this.layout;
    this.shouldUpdate = Object.assign(
      {},
      this.shouldUpdate,
      {
        prevXt, prevYt, prevLySt, // eslint-disable-line
        prevTePt, prevData, // eslint-disable-line
      },
    );
  }

  setTip() {
    this.tip = InitTip();
    this.root.call(this.tip);
  }

  setDataParams(tTrEndPts, layout, jcampIdx = 0) {
    this.data = [];
    this.otherLineData = [];
    this.ticEntities.forEach((entry, idx) => {
      const { topic, feature } = entry;
      const { polarity = 'neutral' } = getLcMsInfo(entry);
      const fixedColor = this.colorForPolarity(polarity);
      if (!feature || !topic) return;
      const currData = convertTopic(topic, layout, feature, 0);
      if (idx === jcampIdx) {
        this.data = currData;
        this.pathColor = fixedColor;
      } else {
        this.otherLineData.push({
          data: currData, polarity, color: fixedColor, idx,
        });
      }
    });

    this.tTrEndPts = tTrEndPts;
    this.layout = layout;
    this.jcampIdx = jcampIdx;
  }

  updatePathCall(xt, yt) {
    this.pathCall = d3.line()
      .x((d) => xt(d.x))
      .y((d) => yt(d.y));
  }

  setConfig(sweepExtentSt) {
    // Domain Calculate
    let { xExtent, yExtent } = sweepExtentSt || { xExtent: false, yExtent: false };

    if (!xExtent || !yExtent) {
      let allData = [...this.data];
      if (this.otherLineData) {
        this.otherLineData.forEach((lineData) => {
          allData = [...allData, ...lineData.data];
        });
      }

      const xes = d3.extent(allData, (d) => d.x).sort((a, b) => a - b);
      xExtent = { xL: xes[0], xU: xes[1] };
      const btm = d3.min(allData, (d) => d.y);
      const top = d3.max(allData, (d) => d.y);
      const height = top - btm;
      yExtent = {
        yL: (btm - this.factor * height),
        yU: (top + this.factor * height),
      };
    }

    this.scales.x.domain([xExtent.xL, xExtent.xU]);
    this.scales.y.domain([yExtent.yL, yExtent.yU]);

    // rescale for zoom
    const { xt, yt } = TfRescale(this);

    // Axis Call
    this.axisCall.x.scale(xt);
    this.axisCall.y.scale(yt);

    this.currentExtent = { xExtent, yExtent };
  }

  drawLine() {
    if (!this.path) return;

    const { xt, yt } = TfRescale(this);
    this.updatePathCall(xt, yt);
    this.path.attr('d', this.pathCall(this.data));
    this.path.style('stroke', this.pathColor);
    if (this.layout === LIST_LAYOUT.AIF) {
      this.path.attr('marker-mid', 'url(#arrow-left)');
    }
  }

  drawOtherLines(layout) {
    d3.selectAll('.line-clip-compare').remove();
    if (!this.otherLineData) return null;
    const { xt, yt } = TfRescale(this);
    this.updatePathCall(xt, yt);
    this.otherLineData.forEach((entry, idx) => {
      const { data, color: pathColor } = entry;
      const path = MountComparePath(this, pathColor, idx, 0.4);
      path.attr('d', this.pathCall(data));
      if (this.layout === LIST_LAYOUT.AIF && this.isShowAllCurves === true) {
        path.attr('marker-mid', 'url(#arrow-left)');
      }
    });
    return null;
  }

  drawGrid() {
    const { sameXY } = this.shouldUpdate;
    if (sameXY || !this.grid || !this.axisCall) return;
    if (this.grid.x && this.axisCall.x) {
      this.grid.x.call(this.axisCall.x
        .tickSize(-this.h, 0, 0))
        .selectAll('line')
        .attr('stroke', '#ddd')
        .attr('stroke-opacity', 0.6)
        .attr('fill', 'none');
    }
    if (this.grid.y && this.axisCall.y) {
      this.grid.y.call(this.axisCall.y
        .tickSize(-this.w, 0, 0))
        .selectAll('line')
        .attr('stroke', '#ddd')
        .attr('stroke-opacity', 0.6)
        .attr('fill', 'none');
    }
  }

  onClickTarget(event, data) {
    event.stopPropagation();
    event.preventDefault();
    const onPeak = true;
    this.clickUiTargetAct(data, onPeak, false, this.jcampIdx);
  }

  create({
    ticEntities,
    curveSt,
    tTrEndPts,
    layoutSt,
    sweepExtentSt, isUiNoBrushSt,
  }) {
    this.svg = d3.select(this.rootKlass).select(this.brushClass);
    MountMainFrame(this, 'focus');
    MountClip(this);

    const { curveIdx, isShowAllCurve } = curveSt;
    const jcampIdx = curveIdx;
    this.isShowAllCurves = isShowAllCurve;
    this.ticEntities = ticEntities;
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = InitScale(this, false);
    this.setTip();
    this.setDataParams(tTrEndPts, layoutSt, jcampIdx);
    MountCompass(this);

    this.axis = MountAxis(this);
    this.path = MountPath(this, this.pathColor);
    this.grid = MountGrid(this);
    this.tags = MountTags(this);
    MountAxisLabelX(this);
    MountAxisLabelY(this);

    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.drawLine();
      this.drawGrid();
      this.drawOtherLines(layoutSt);
    }
    MountBrush(this, false, isUiNoBrushSt, this.brushClass);
    this.resetShouldUpdate();
  }

  update({
    curveSt,
    tTrEndPts,
    layoutSt,
    ticEntities,
    sweepExtentSt, isUiNoBrushSt, uiSt,
  }) {
    this.svg = d3.select(this.rootKlass).select(this.brushClass);
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = InitScale(this, false);

    const { curveIdx, isShowAllCurve } = curveSt;
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
    MountBrush(this, false, isUiNoBrushSt, this.brushClass);
    this.resetShouldUpdate();
  }
}

export default MultiFocus;
