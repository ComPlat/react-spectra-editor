import * as d3 from 'd3';
import D3Focus from './d3_focus';
import D3Context from './d3_context';
import MountZoom from '../helpers/zoom';
import MountBrush from '../helpers/brush';
import { MountCompass } from '../helpers/compass';

const W = 700;
const H = 500;

class D3Canvas {
  constructor(props) {
    const { clickPointAct } = props;
    this.focus = new D3Focus({
      W, H, clickPointAct,
    });
    this.context = new D3Context({ W, H });

    this.svg = null;
    this.zoom = d3.zoom();
    this.brush = d3.brushX();

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.drawMain = this.drawMain.bind(this);
  }

  drawMain(el) {
    const svg = d3.select(el).append('svg')
      .attr('class', 'canvas-main')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${W} ${H}`);
    this.svg = svg;
  }

  drawLabel(el, cLabel, xLabel, yLabel) {
    d3.select(el).selectAll('.xLabel').text(xLabel);
    d3.select(el).selectAll('.yLabel').text(yLabel);
    if (cLabel) {
      d3.select(el).selectAll('.mark-text').text(cLabel);
    }
  }

  create(
    el, seed, peaks, tEndPts, tShiftPeaks, editPeakSt, editModeSt,
    filterSeed, filterPeak, cLabel, xLabel, yLabel,
    updateBorder,
  ) {
    this.drawMain(el);

    this.context.create(el, this.svg, seed, updateBorder);
    this.focus.create(
      el, this.svg, filterSeed, filterPeak, tEndPts, tShiftPeaks,
      editPeakSt, editModeSt, cLabel,
    );
    this.drawLabel(el, cLabel, xLabel, yLabel);

    MountBrush(this);
    MountZoom(this);
    MountCompass(this);
  }

  update(
    el, seed, peaks, tEndPts, tShiftPeaks, editPeakSt, editModeSt,
    filterSeed, filterPeak, cLabel, xLabel, yLabel,
  ) {
    this.context.update(el, this.svg, seed);
    this.focus.update(
      el, this.svg, filterSeed, filterPeak, tEndPts, tShiftPeaks,
      editPeakSt, editModeSt, null,
    );
    this.drawLabel(el, cLabel, xLabel, yLabel);
  }

  destroy(el) {
    d3.select(el).selectAll('svg').remove();
  }
}

export default D3Canvas;
