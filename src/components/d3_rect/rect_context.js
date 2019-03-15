import * as d3 from 'd3';
import {
  InitScale, InitAxisCall,
} from '../../helpers/init';
import {
  MountBars, MountAxis, MountMainFrame, MountAxisLabelX,
} from '../../helpers/mount';

class RectContext {
  constructor(props) {
    const { W, H } = props;
    this.margin = {
      t: 20 + Math.round((H - 90) * 0.8) + 20,
      b: 50,
      l: 80,
      r: 20,
    };
    this.w = W - this.margin.l - this.margin.r;
    this.h = H - this.margin.t - this.margin.b;

    this.axis = null;
    this.grid = null;
    this.data = {};
    this.root = null;
    this.updateBorder = null;
    this.svg = null;
    this.bars = null;
    this.scales = InitScale(this, false);
    this.axisCall = InitAxisCall(3);

    this.setSvg = this.setSvg.bind(this);
    this.setData = this.setData.bind(this);
    this.setRoot = this.setRoot.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.drawTime = this.drawTime.bind(this);
  }

  setSvg(svg) {
    this.svg = svg;
  }

  setRoot(el) {
    this.root = d3.select(el).selectAll('.context-main');
  }

  setData(data) {
    this.data = [...data];
  }

  setConfig() {
    // Domain Calculate
    const factor = 1.05;
    const xExtent = [
      0,
      d3.max(this.data, d => d.x) + 10,
    ];
    const yExtent = [
      0,
      d3.max(this.data, d => d.y) * factor,
    ];
    this.scales.x.domain(xExtent);
    this.scales.y.domain(yExtent);
    // Axis Call
    this.axis.x.call(this.axisCall.x.scale(this.scales.x));
    this.axis.y.call(this.axisCall.y.scale(this.scales.y));
  }

  posHeight(gnd, val) {
    const h = gnd - val;
    return h >= 0 ? h : 0;
  }

  drawTime() {
    const bars = this.bars.selectAll('rect')
      .data(this.data);

    bars.exit()
      .attr('class', 'exit')
      .remove();

    bars.enter()
      .append('rect')
      .attr('class', 'enter-bar')
      .attr('fill', 'steelblue')
      .attr('y', d => this.scales.y(d.y))
      .attr('x', d => this.scales.x(d.x))
      .attr('height', d => this.posHeight(this.h, this.scales.y(d.y)))
      .attr('width', 1.5)
      .merge(bars);
  }

  create(el, svg, data, updateBorder) {
    this.updateBorder = updateBorder;
    this.setSvg(svg);

    MountMainFrame(this, 'context');

    this.setRoot(el);
    this.setData(data);

    this.axis = MountAxis(this);
    this.bars = MountBars(this);
    MountAxisLabelX(this);

    if (this.data && this.data.length > 0) {
      this.setConfig();
      this.drawTime();
    }
  }

  update(el, svg, data) {
    this.setRoot(el);
    this.setData(data);

    if (this.data && this.data.length > 0) {
      this.setConfig();
      this.drawTime();
    }
  }
}

export default RectContext;
