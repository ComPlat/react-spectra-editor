import * as d3 from 'd3';
import { InitScale, InitAxisCall, InitPathCall } from '../helpers/init';
import {
  MountPath, MountAxis, MountMainFrame, MountAxisLabelX,
} from '../helpers/mount';

class D3Context {
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
    this.path = null;
    this.grid = null;
    this.data = {};
    this.root = null;
    this.updateBorder = null;
    this.svg = null;
    this.scales = InitScale(this);
    this.axisCall = InitAxisCall(3);
    this.pathCall = InitPathCall(this);

    this.setSvg = this.setSvg.bind(this);
    this.setData = this.setData.bind(this);
    this.setRoot = this.setRoot.bind(this);
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

  drawTime() {
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
    this.axis.x.call(this.axisCall.x.scale(this.scales.x));
    this.axis.y.call(this.axisCall.y.scale(this.scales.y));

    // Path Calculate
    this.path.attr('d', this.pathCall(this.data));
  }

  create(el, svg, data, updateBorder) {
    this.updateBorder = updateBorder;
    this.setSvg(svg);

    MountMainFrame(this, 'context');

    this.setRoot(el);
    this.setData(data);

    this.axis = MountAxis(this);
    this.path = MountPath(this, '#80013f');
    MountAxisLabelX(this);

    if (this.data && this.data.length > 0) {
      this.drawTime();
    }
  }

  update(el, svg, data) {
    this.setRoot(el);
    this.setData(data);

    if (this.data && this.data.length > 0) {
      this.drawTime();
    }
  }
}

export default D3Context;
