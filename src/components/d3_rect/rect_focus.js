import * as d3 from 'd3';
import {
  InitScale, InitAxisCall, InitTip,
} from '../../helpers/init';
import {
  MountGrid, MountAxis, MountAxisLabelY, MountRef,
  MountClip, MountMainFrame, MountCircles, MountThresLine, MountBars,
} from '../../helpers/mount';
import { TfRescale } from '../../helpers/compass';
import { PksEdit } from '../../helpers/converter';
import { LIST_MODE } from '../../constants/list_mode';

class RectFocus {
  constructor(props) {
    const {
      W, H, clickPointAct,
    } = props;
    this.margin = {
      t: 10,
      b: 60 + Math.round((H - 90) * 0.2) + 20,
      l: 80,
      r: 20,
    };
    this.w = W - this.margin.l - this.margin.r;
    this.h = H - this.margin.t - this.margin.b;
    this.clickPointAct = clickPointAct;

    this.axis = null;
    this.thresLine = null;
    this.grid = null;
    this.circles = null;
    this.ref = null;
    this.ccPattern = null;
    this.data = [];
    this.dataPks = [];
    this.tTrEndPts = null;
    this.tSfPeaks = null;
    this.root = null;
    this.svg = null;
    this.overlay = null;
    this.compass = null;
    this.bars = null;
    this.scales = InitScale(this, false);
    this.axisCall = InitAxisCall(5);
    this.tip = InitTip(this);

    this.setSvg = this.setSvg.bind(this);
    this.setRoot = this.setRoot.bind(this);
    this.setTip = this.setTip.bind(this);
    this.setTrans = this.setTrans.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.setOverlay = this.setOverlay.bind(this);
    this.setCompass = this.setCompass.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.drawBar = this.drawBar.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.onClickEditPeak = this.onClickEditPeak.bind(this);
    this.mergedPeaks = this.mergedPeaks.bind(this);
  }

  setSvg(svg) {
    this.svg = svg;
  }

  setRoot(el) {
    this.root = d3.select(el).selectAll('.focus-main');
  }

  setTip() {
    this.root.call(this.tip);
  }

  setDataParams(data, peaks, tTrEndPts, tSfPeaks) {
    this.data = [...data];
    this.dataPks = [...peaks];
    this.tTrEndPts = tTrEndPts;
    this.tSfPeaks = tSfPeaks;
  }

  setTrans() {
    this.trans = d3.transition().duration(500);
  }

  setOverlay() {
    this.overlay = this.root.append('rect')
      .attr('class', 'overlay-focus')
      .attr('width', this.w)
      .attr('height', this.h)
      .attr('opacity', 0.0);
  }

  setCompass() {
    this.compass = this.root.append('g')
      .attr('class', 'compass')
      .attr('display', 'none');
  }

  setConfig() {
    // Domain Calculate
    const factor = 1.05;
    const xExtent = [
      d3.min(this.data, d => d.x) - 10,
      d3.max(this.data, d => d.x) + 10,
    ];
    const yExtent = [
      0,
      d3.max(this.data, d => d.y) * factor,
    ];
    this.scales.x.domain(xExtent);
    this.scales.y.domain(yExtent);

    // rescale for zoom
    const { xt, yt } = TfRescale(this);

    // Axis Call
    this.axisCall.x.scale(xt);
    this.axisCall.y.scale(yt);
  }

  posHeight(gnd, val) {
    const h = gnd - val;
    return h >= 0 ? h : 0;
  }

  drawBar() {
    const { xt, yt } = TfRescale(this);

    const bars = this.bars.selectAll('rect')
      .data(this.data);

    bars.exit()
      .attr('class', 'exit')
      .remove();

    const gnd = yt(0);
    bars.enter()
      .append('rect')
      .attr('class', 'enter-bar')
      .attr('fill', 'steelblue')
      .attr('width', 1.5)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .merge(bars)
      .attr('height', d => this.posHeight(gnd, yt(d.y)))
      .attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)})`);
  }

  drawGrid() {
    this.grid.x.call(this.axisCall.x
      .tickSize(-this.h, 0, 0))
      .selectAll('line')
      .attr('stroke', '#bbbbbb')
      .attr('stroke-opacity', 0.6)
      .attr('fill', 'none');
    this.grid.y.call(this.axisCall.y
      .tickSize(-this.w, 0, 0))
      .selectAll('line')
      .attr('stroke', '#bbbbbb')
      .attr('stroke-opacity', 0.6)
      .attr('fill', 'none');
  }

  onClickEditPeak(data, editModeSt) {
    d3.event.stopPropagation();
    d3.event.preventDefault();
    if (editModeSt === LIST_MODE.RM_PEAK) {
      this.tip.hide();
    }
    const onPeak = true;
    this.clickPointAct(data, onPeak);
  }

  mergedPeaks(editPeakSt) {
    if (!editPeakSt) return this.dataPks;
    this.dataPks = PksEdit(this.dataPks, editPeakSt);
    return this.dataPks;
  }

  create(
    el, svg, filterSeed, filterPeak, tTrEndPts, tSfPeaks,
  ) {
    this.setSvg(svg);

    MountMainFrame(this, 'focus');
    MountClip(this);

    this.setRoot(el);
    this.setTip();
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks);
    this.setCompass();
    this.setOverlay();

    this.axis = MountAxis(this);
    this.thresLine = MountThresLine(this, 'green');
    this.grid = MountGrid(this);
    this.circles = MountCircles(this);
    this.ref = MountRef(this);
    this.bars = MountBars(this);
    MountAxisLabelY(this);
    // if (cLabel) {
    //   MountMarker(this, 'steelblue');
    // }

    if (this.data && this.data.length > 0) {
      this.setConfig();
      this.drawBar();
      this.drawGrid();
    }
  }

  update(
    el, svg, filterSeed, filterPeak, tTrEndPts, tSfPeaks,
  ) {
    this.setRoot(el);
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks);

    if (this.data && this.data.length > 0) {
      this.setConfig();
      this.drawBar();
      this.drawGrid();
    }
  }
}

export default RectFocus;
