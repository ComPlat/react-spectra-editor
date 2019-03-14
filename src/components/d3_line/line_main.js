import * as d3 from 'd3';
import LineFocus from './line_focus';
import LineContext from './line_context';
import Zoomed from './line_zoomed';
import MountZoom from '../../helpers/zoom';
import MountBrush from '../../helpers/brush';
import { MountCompass } from '../../helpers/compass';

const W = 700;
const H = 500;

class LineMain {
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
      .attr('class', 'kanvas-main')
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
    el, seed, peaks, tTrEndPts, tSfPeaks, editPeakSt, editModeSt,
    filterSeed, filterPeak, cLabel, xLabel, yLabel,
    updateBorder,
  ) {
    this.drawMain(el);

    this.context.create(el, this.svg, seed, updateBorder);
    this.focus.create(
      el, this.svg, filterSeed, filterPeak, tTrEndPts, tSfPeaks,
      editPeakSt, editModeSt, cLabel,
    );
    this.drawLabel(el, cLabel, xLabel, yLabel);

    MountBrush(this);
    MountZoom(this, Zoomed);
    MountCompass(this);
  }

  update(
    el, seed, peaks, tTrEndPts, tSfPeaks, editPeakSt, editModeSt,
    filterSeed, filterPeak, cLabel, xLabel, yLabel, isHidden,
  ) {
    this.context.update(el, this.svg, seed);
    this.focus.update(
      el, this.svg, filterSeed, filterPeak, tTrEndPts, tSfPeaks,
      editPeakSt, editModeSt, null,
    );
    this.drawLabel(el, cLabel, xLabel, yLabel);

    if (isHidden) {
      d3.select(el).selectAll('svg').style('width', 0);
    } else {
      d3.select(el).selectAll('svg').style('width', '100%');
    }
  }

  destroy(el) {
    d3.select(el).selectAll('svg').remove();
  }
}

export default LineMain;
