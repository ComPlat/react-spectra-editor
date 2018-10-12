import * as d3 from 'd3';
import {
  InitScale, InitAxisCall, InitPathCall,
} from '../helpers/init';
import {
  MountPath, MountGrid, MountAxis, MountAxisLabelY, MountMarker,
  MountClip, MountMainFrame, MountCircles,
} from '../helpers/mount';

class D3Focus {
  constructor(props) {
    const { W, H } = props;
    this.margin = {
      t: 30,
      b: 70 + Math.round((H - 90) * 0.2) + 20,
      l: 80,
      r: 20,
    };
    this.w = W - this.margin.l - this.margin.r;
    this.h = H - this.margin.t - this.margin.b;

    this.axis = null;
    this.path = null;
    this.grid = null;
    this.circles = null;
    this.ccPattern = null;
    this.data = [];
    this.dataPks = [];
    this.root = null;
    this.svg = null;
    this.scales = InitScale(this);
    this.axisCall = InitAxisCall(5);
    this.pathCall = InitPathCall(this);

    this.setSvg = this.setSvg.bind(this);
    this.setRoot = this.setRoot.bind(this);
    this.setTrans = this.setTrans.bind(this);
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

  setData(data) {
    this.data = [...data];
  }

  setDataPks(peaks) {
    this.dataPks = [...peaks];
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
      .merge(ccp)
      .attr('cx', d => scales.x(d.x))
      .attr('cy', d => scales.y(d.y))
      .attr('r', 3);
  }

  create(el, svg, filterSeed, filterPeak, cLabel) {
    this.setSvg(svg);

    MountMainFrame(this, 'focus');
    MountClip(this);

    this.setRoot(el);
    this.setData(filterSeed);
    this.setDataPks(filterPeak);

    this.axis = MountAxis(this);
    this.path = MountPath(this, 'steelblue');
    this.grid = MountGrid(this);
    this.circles = MountCircles(this);
    MountAxisLabelY(this);
    if (cLabel) {
      MountMarker(this, 'steelblue');
    }

    if (this.data) {
      this.drawLine();
      this.drawPeaks(this.scales);
    }
  }

  update(el, svg, filterSeed, filterPeak) {
    this.setRoot(el);
    this.setData(filterSeed);
    this.setDataPks(filterPeak);

    if (this.data) {
      this.drawLine();
      this.drawPeaks(this.scales);
    }
  }
}

export default D3Focus;
