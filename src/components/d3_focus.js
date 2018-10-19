import * as d3 from 'd3';
import {
  InitScale, InitAxisCall, InitPathCall, InitTip,
} from '../helpers/init';
import {
  MountPath, MountGrid, MountAxis, MountAxisLabelY,
  MountClip, MountMainFrame, MountCircles, MountThresLine,
} from '../helpers/mount';

class D3Focus {
  constructor(props) {
    const { W, H } = props;
    this.margin = {
      t: 10,
      b: 60 + Math.round((H - 90) * 0.2) + 20,
      l: 80,
      r: 20,
    };
    this.w = W - this.margin.l - this.margin.r;
    this.h = H - this.margin.t - this.margin.b;

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
    this.scales = InitScale(this);
    this.axisCall = InitAxisCall(5);
    this.pathCall = InitPathCall(this);
    this.tip = InitTip(this);

    this.setSvg = this.setSvg.bind(this);
    this.setRoot = this.setRoot.bind(this);
    this.setTip = this.setTip.bind(this);
    this.setTrans = this.setTrans.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.drawPeaks = this.drawPeaks.bind(this);
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
    // Axis Call
    this.axisCall.x.scale(this.scales.x);
    this.axisCall.y.scale(this.scales.y);

    // Path Calculate
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

  drawPeaks(scales) {
    const ccp = this.circles.selectAll('circle')
      .data(this.dataPks);

    ccp.exit()
      .attr('class', 'exit')
      .remove();

    ccp.enter()
      .append('circle')
      .attr('class', 'enter')
      .attr('fill', 'pink')
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
      .merge(ccp)
      .attr('cx', d => scales.x(d.x))
      .attr('cy', d => scales.y(d.y))
      .attr('r', 3);
  }

  create(el, svg, filterSeed, filterPeak, tEndPts) {
    this.setSvg(svg);

    MountMainFrame(this, 'focus');
    MountClip(this);

    this.setRoot(el);
    this.setTip();
    this.setDataParams(filterSeed, filterPeak, tEndPts);

    this.axis = MountAxis(this);
    this.path = MountPath(this, 'steelblue');
    this.thresLine = MountThresLine(this, 'green');
    this.grid = MountGrid(this);
    this.circles = MountCircles(this);
    MountAxisLabelY(this);
    // if (cLabel) {
    //   MountMarker(this, 'steelblue');
    // }

    if (this.data) {
      this.drawLine();
      this.drawPeaks(this.scales);
    }
  }

  update(el, svg, filterSeed, filterPeak, tEndPts) {
    this.setRoot(el);
    this.setDataParams(filterSeed, filterPeak, tEndPts);

    if (this.data) {
      this.drawLine();
      this.drawPeaks(this.scales);
    }
  }
}

export default D3Focus;
