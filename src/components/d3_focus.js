import * as d3 from 'd3';
import {
  InitScale, InitAxisCall, InitTip,
} from '../helpers/init';
import {
  MountPath, MountGrid, MountAxis, MountAxisLabelY,
  MountClip, MountMainFrame, MountCircles, MountThresLine,
} from '../helpers/mount';
import { TfRescale } from '../helpers/compass';
import { PksEdit } from '../helpers/converter';

class D3Focus {
  constructor(props) {
    const {
      W, H, addToPosListAct, addToNegListAct,
    } = props;
    this.margin = {
      t: 10,
      b: 60 + Math.round((H - 90) * 0.2) + 20,
      l: 80,
      r: 20,
    };
    this.w = W - this.margin.l - this.margin.r;
    this.h = H - this.margin.t - this.margin.b;
    this.addToPosListAct = addToPosListAct;
    this.addToNegListAct = addToNegListAct;

    this.axis = null;
    this.path = null;
    this.thresLine = null;
    this.grid = null;
    this.circles = null;
    this.ccPattern = null;
    this.data = [];
    this.dataPks = [];
    this.tEndPts = null;
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
    this.drawLine = this.drawLine.bind(this);
    this.drawPeaks = this.drawPeaks.bind(this);
    this.onClickPeak = this.onClickPeak.bind(this);
    this.mergedPeaks = this.mergedPeaks.bind(this);
    this.updatePathCall = this.updatePathCall.bind(this);
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

  setDataParams(data, peaks, tEndPts) {
    this.data = [...data];
    this.dataPks = [...peaks];
    this.tEndPts = tEndPts;
  }

  setTrans() {
    this.trans = d3.transition().duration(500);
  }

  setOverlay() {
    this.overlay = this.root.append('rect')
      .attr('class', 'overlay')
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

  drawLine() {
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

    // Path Calculate
    this.updatePathCall(xt, yt);
    this.path.attr('d', this.pathCall(this.data));

    // Threshold
    if (this.tEndPts.length > 0) {
      this.thresLine.attr('d', this.pathCall(this.tEndPts));
      this.thresLine.attr('visibility', 'visible');
    } else {
      this.thresLine.attr('visibility', 'hidden');
    }

    // Grid Calculate
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

  onClickPeak(data) {
    d3.event.stopPropagation();
    this.tip.hide();
    this.addToNegListAct(data);
  }

  mergedPeaks(editPeakSt) {
    if (!editPeakSt) return this.dataPks;
    this.dataPks = PksEdit(this.dataPks, editPeakSt);
    return this.dataPks;
  }

  drawPeaks(editPeakSt) {
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
      .attr('class', 'enter')
      .attr('fill', 'red')
      .attr('stroke', 'blue')
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0.0)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .merge(ccp)
      .attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)})`)
      .on('click', d => this.onClickPeak(d));
  }

  create(el, svg, filterSeed, filterPeak, tEndPts, editPeakSt) {
    this.setSvg(svg);

    MountMainFrame(this, 'focus');
    MountClip(this);

    this.setRoot(el);
    this.setTip();
    this.setDataParams(filterSeed, filterPeak, tEndPts);
    this.setOverlay();
    this.setCompass();

    this.axis = MountAxis(this);
    this.path = MountPath(this, 'steelblue');
    this.thresLine = MountThresLine(this, 'green');
    this.grid = MountGrid(this);
    this.circles = MountCircles(this);
    MountAxisLabelY(this);
    // if (cLabel) {
    //   MountMarker(this, 'steelblue');
    // }

    if (this.data && this.data.length > 0) {
      this.drawLine();
      this.drawPeaks(editPeakSt);
    }
  }

  update(el, svg, filterSeed, filterPeak, tEndPts, editPeakSt) {
    this.setRoot(el);
    this.setDataParams(filterSeed, filterPeak, tEndPts);

    if (this.data && this.data.length > 0) {
      this.drawLine();
      this.drawPeaks(editPeakSt);
    }
  }
}

export default D3Focus;
