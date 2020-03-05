import * as d3 from 'd3';
import {
  InitScale, InitAxisCall, InitTip,
} from '../../helpers/init';
import MountBrush from '../../helpers/brush';
import {
  MountGrid, MountAxis, MountAxisLabelX, MountAxisLabelY, MountRef,
  MountClip, MountMainFrame, MountThresLine, MountBars,
} from '../../helpers/mount';
import { TfRescale, MountCompass } from '../../helpers/compass';
import { PksEdit } from '../../helpers/converter';
import { LIST_LAYOUT } from '../../constants/list_layout';

class RectFocus {
  constructor(props) {
    const {
      W, H, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    } = props;

    this.rootKlass = '.d3Rect';
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
    this.scales = InitScale(this, false);
    this.axisCall = InitAxisCall(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;

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

  setTip(typ) {
    this.tip = InitTip(typ);
    this.root.call(this.tip);
  }

  setDataParams(data, peaks, tTrEndPts, tSfPeaks) {
    this.data = [...data];
    this.dataPks = [...peaks];
    this.tTrEndPts = tTrEndPts;
    this.tSfPeaks = tSfPeaks;
  }

  updatePathCall(xt, yt) {
    this.pathCall = d3.line()
      .x(d => xt(d.x))
      .y(d => yt(d.y));
  }

  setConfig(uiSt) {
    // Domain Calculate
    let { xExtent, yExtent } = uiSt
      ? uiSt.sweepExtent
      : { xExtent: false, yExtent: false };
    if (!xExtent || !yExtent) {
      const xes = d3.extent(this.data, d => d.x).sort((a, b) => a - b);
      xExtent = { xL: xes[0] - 10, xU: xes[1] + 10 };
      const btm = 0; // MS baseline is always 0.
      const top = d3.max(this.data, d => d.y);
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

  posHeight(gnd, val) {
    const h = gnd - val;
    return h >= 0 ? h : 0;
  }

  barColor(y, yRef) {
    return y >= yRef ? 'steelblue' : '#aaa';
  }

  drawBar() {
    const { xt, yt } = TfRescale(this);
    this.updatePathCall(xt, yt);

    const yRef = this.tTrEndPts[0].y;

    const bars = this.bars.selectAll('rect')
      .data(this.data);

    bars.exit()
      .attr('class', 'exit')
      .remove();

    const gnd = yt(0);
    bars.enter()
      .append('rect')
      .attr('class', 'enter-bar')
      .attr('width', 1.5)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .merge(bars)
      .attr('fill', d => this.barColor(d.y, yRef))
      .attr('height', d => this.posHeight(gnd, yt(d.y)))
      .attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)})`);
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
    this.grid.x.call(this.axisCall.x
      .tickSize(-this.h, 0, 0))
      .selectAll('line')
      .attr('stroke', '#ddd')
      .attr('stroke-opacity', 0.6)
      .attr('fill', 'none');
    this.grid.y.call(this.axisCall.y
      .tickSize(-this.w, 0, 0))
      .selectAll('line')
      .attr('stroke', '#ddd')
      .attr('stroke-opacity', 0.6)
      .attr('fill', 'none');
  }

  mergedPeaks(editPeakSt) {
    if (!editPeakSt) return this.dataPks;
    this.dataPks = PksEdit(this.dataPks, editPeakSt);
    return this.dataPks;
  }

  create({
    filterSeed, filterPeak, tTrEndPts, tSfPeaks, uiSt,
  }) {
    this.svg = d3.select('.d3Svg');
    MountMainFrame(this, 'focus');
    MountClip(this);

    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.setTip(LIST_LAYOUT.MS);
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks);
    MountCompass(this);

    this.axis = MountAxis(this);
    this.thresLine = MountThresLine(this, 'green');
    this.grid = MountGrid(this);
    this.ref = MountRef(this);
    this.bars = MountBars(this);
    MountAxisLabelX(this);
    MountAxisLabelY(this);

    if (this.data && this.data.length > 0) {
      this.setConfig(uiSt);
      this.drawBar();
      this.drawThres();
      this.drawGrid();
    }
    MountBrush(this, uiSt);
  }

  update({
    filterSeed, filterPeak, tTrEndPts, tSfPeaks, uiSt,
  }) {
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks);

    if (this.data && this.data.length > 0) {
      this.setConfig(uiSt);
      this.drawBar();
      this.drawThres();
      this.drawGrid();
    }
    MountBrush(this, uiSt);
  }
}

export default RectFocus;
