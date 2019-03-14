import * as d3 from 'd3';
import {
  InitScale, InitAxisCall, InitTip,
} from '../../helpers/init';
import {
  MountPath, MountGrid, MountAxis, MountAxisLabelY, MountRef,
  MountClip, MountMainFrame, MountCircles, MountThresLine,
} from '../../helpers/mount';
import { TfRescale } from '../../helpers/compass';
import { PksEdit } from '../../helpers/converter';
import { LIST_MODE } from '../../constants/list_mode';

class LineFocus {
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
    this.path = null;
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
    this.scales = InitScale(this);
    this.axisCall = InitAxisCall(5);
    this.pathCall = null;
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
    this.drawLine = this.drawLine.bind(this);
    this.drawThres = this.drawThres.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.drawPeaks = this.drawPeaks.bind(this);
    this.drawRef = this.drawRef.bind(this);
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

  updatePathCall(xt, yt) {
    this.pathCall = d3.line()
      .x(d => xt(d.x))
      .y(d => yt(d.y));
  }

  setConfig() {
    // Domain Calculate
    const factor = 1.05;
    const xExtent = d3.extent(this.data, d => d.x);
    const yExtent = [
      d3.min(this.data, d => d.y) / factor,
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

  drawLine() {
    const { xt, yt } = TfRescale(this);

    this.updatePathCall(xt, yt);
    this.path.attr('d', this.pathCall(this.data));
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

  drawPeaks(editPeakSt, editModeSt) {
    // rescale for zoom
    const { xt, yt } = TfRescale(this);

    const ccp = this.circles.selectAll('path')
      .data(this.mergedPeaks(editPeakSt));

    ccp.exit()
      .attr('class', 'exit')
      .remove();

    const symbol = d3.symbol().size([15]);

    ccp.enter()
      .append('path')
      .attr('d', symbol.type(d3.symbolDiamond))
      .attr('class', 'enter-peak')
      .attr('fill', 'red')
      .attr('stroke', 'blue')
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0.0)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .merge(ccp)
      .attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)})`)
      .on('click', d => this.onClickEditPeak(d, editModeSt));
  }

  drawRef() {
    // rescale for zoom
    const { xt, yt } = TfRescale(this);

    const ccp = this.ref.selectAll('path')
      .data(this.tSfPeaks);

    ccp.exit()
      .attr('class', 'exit')
      .remove();

    const symbol = d3.symbol().size([12]);

    ccp.enter()
      .append('path')
      .attr('d', symbol.type(d3.symbolCircle))
      .attr('class', 'enter-ref')
      .attr('fill-opacity', 1.0)
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 1.0)
      .merge(ccp)
      .attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)})`)
      .on('click', () => this.onClickEditPeak(false, false));
  }

  create(
    el, svg, filterSeed, filterPeak, tTrEndPts, tSfPeaks, editPeakSt, editModeSt,
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
    this.path = MountPath(this, 'steelblue');
    this.thresLine = MountThresLine(this, 'green');
    this.grid = MountGrid(this);
    this.circles = MountCircles(this);
    this.ref = MountRef(this);
    MountAxisLabelY(this);
    // if (cLabel) {
    //   MountMarker(this, 'steelblue');
    // }

    if (this.data && this.data.length > 0) {
      this.setConfig();
      this.drawLine();
      this.drawThres();
      this.drawGrid();
      this.drawRef();
      this.drawPeaks(editPeakSt, editModeSt);
    }
  }

  update(
    el, svg, filterSeed, filterPeak, tTrEndPts, tSfPeaks, editPeakSt, editModeSt,
  ) {
    this.setRoot(el);
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks);

    if (this.data && this.data.length > 0) {
      this.setConfig();
      this.drawLine();
      this.drawThres();
      this.drawGrid();
      this.drawRef();
      this.drawPeaks(editPeakSt, editModeSt);
    }
  }
}

export default LineFocus;
