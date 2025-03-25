/* eslint-disable prefer-object-spread, no-mixed-operators */
import {
  InitScale, InitAxisCall, InitTip,
} from '../../helpers/init';
import {
  MountPath, MountGrid, MountAxis, MountAxisLabelX, MountAxisLabelY,
  MountClip, MountMainFrame, MountTags,
} from '../../helpers/mount';
import MountBrush from '../../helpers/brush';
import { TfRescale, MountCompass } from '../../helpers/compass';
import { LIST_LAYOUT } from '../../constants/list_layout';
import { LIST_ROOT_SVG_GRAPH } from '../../constants/list_graph';
import { calcSlope } from '../../helpers/calc';
import { itgIdTag } from '../../helpers/focus';
import Cfg from '../../helpers/cfg';
import Format from '../../helpers/format';
import { calcArea } from '../../helpers/integration';

const d3 = require('d3');

class LineFocus {
  constructor(props) {
    const {
      W, H, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct, graphIndex, uiSt,
    } = props;
    this.graphIndex = graphIndex;
    this.uiSt = uiSt;
    this.jcampIdx = 0;
    this.rootKlass = `.${LIST_ROOT_SVG_GRAPH.LINE}`;
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
    this.brushX = d3.brushX();

    this.axis = null;
    this.path = null;
    this.grid = null;
    this.tags = null;
    this.data = [];
    this.tTrEndPts = null;
    this.root = null;
    this.svg = null;
    this.axisCall = InitAxisCall(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;
    this.shouldUpdate = {};
    this.layout = LIST_LAYOUT.H1;

    this.getShouldUpdate = this.getShouldUpdate.bind(this);
    this.resetShouldUpdate = this.resetShouldUpdate.bind(this);
    this.setTip = this.setTip.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.onClickTarget = this.onClickTarget.bind(this);
    this.drawAUC = this.drawAUC.bind(this);
    this.drawInteg = this.drawInteg.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }

  getShouldUpdate(nextItSt) {
    const {
      prevXt, prevYt, prevLySt, prevItSt,
      prevTePt, prevData,
    } = this.shouldUpdate;
    const { xt, yt } = TfRescale(this);
    const sameXY = xt(1.1) === prevXt && prevYt === yt(1.1);
    const sameLySt = prevLySt === this.layout;
    const sameTePt = prevTePt === this.tTrEndPts.length;
    const sameItSt = prevItSt === nextItSt;
    const sameData = prevData === this.data.length;
    this.shouldUpdate = Object.assign(
      {},
      this.shouldUpdate,
      {
        sameXY, sameLySt, // eslint-disable-line
        sameTePt, sameData, sameItSt, // eslint-disable-line
      },
    );
  }

  resetShouldUpdate(prevItSt) {
    const { xt, yt } = TfRescale(this);
    const prevXt = xt(1.1);
    const prevYt = yt(1.1);
    const prevTePt = this.tTrEndPts.length;
    const prevData = this.data.length;
    const prevLySt = this.layout;
    this.shouldUpdate = Object.assign(
      {},
      this.shouldUpdate,
      {
        prevXt, prevYt, prevLySt, // eslint-disable-line
        prevTePt, prevData, prevItSt, // eslint-disable-line
      },
    );
  }

  setTip() {
    this.tip = InitTip();
    this.root.call(this.tip);
  }

  setDataParams(data, tTrEndPts, layout) {
    this.data = [...data];
    this.data = data.map((d) => ({ x: d.x / 60, y: d.y }));
    this.tTrEndPts = tTrEndPts;
    this.layout = layout;
  }

  updatePathCall(xt, yt) {
    this.pathCall = d3.line()
      .x((d) => xt(d.x))
      .y((d) => yt(d.y));
  }

  setConfig(sweepExtentSt) {
    // Domain Calculate
    let { xExtent, yExtent } = sweepExtentSt || { xExtent: false, yExtent: false };

    if (!xExtent || !yExtent) {
      const xes = d3.extent(this.data, (d) => d.x).sort((a, b) => a - b);
      xExtent = { xL: xes[0], xU: xes[1] };
      const btm = d3.min(this.data, (d) => d.y);
      const top = d3.max(this.data, (d) => d.y);
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

  drawLine() {
    if (!this.path) return;

    const { sameXY } = this.shouldUpdate;
    if (sameXY) return;

    const { xt, yt } = TfRescale(this);
    this.updatePathCall(xt, yt);
    this.path.attr('d', this.pathCall(this.data));
  }

  drawGrid() {
    const { sameXY } = this.shouldUpdate;
    if (sameXY || !this.grid || !this.axisCall) return;

    if (this.grid.x && this.axisCall.x) {
      this.grid.x.call(this.axisCall.x
        .tickSize(-this.h, 0, 0))
        .selectAll('line')
        .attr('stroke', '#ddd')
        .attr('stroke-opacity', 0.6)
        .attr('fill', 'none');
    }

    if (this.grid.y && this.axisCall.y) {
      this.grid.y.call(this.axisCall.y
        .tickSize(-this.w, 0, 0))
        .selectAll('line')
        .attr('stroke', '#ddd')
        .attr('stroke-opacity', 0.6)
        .attr('fill', 'none');
    }
  }

  onClickTarget(event, data) {
    event.stopPropagation();
    event.preventDefault();
    const onPeak = true;
    this.clickUiTargetAct(data, onPeak);
  }

  drawAUC(stack) {
    const { xt, yt } = TfRescale(this);
    const auc = this.tags.aucPath.selectAll('path').data(stack);
    auc.exit()
      .attr('class', 'exit')
      .remove();

    const integCurve = (border) => {
      const { xL, xU } = border;
      const ps = this.data.filter((d) => d.x > xL && d.x < xU);
      if (!ps[0]) return null;

      const point1 = ps[0];
      const point2 = ps[ps.length - 1];
      const slope = calcSlope(point1.x, point1.y, point2.x, point2.y);
      let lastDY = point1.y;

      return d3.area()
        .x((d) => xt(d.x))
        .y0((d, index) => {
          if (index > 0) {
            const lastD = ps[index - 1];
            const y = slope * (d.x - lastD.x) + lastDY;
            lastDY = y;
            return yt(y);
          }
          return yt(0);
        })
        .y1((d) => yt(d.y))(ps);
    };

    auc.enter()
      .append('path')
      .attr('class', 'auc')
      .attr('fill', 'red')
      .attr('stroke', 'none')
      .attr('fill-opacity', 0.2)
      .attr('stroke-width', 2)
      .merge(auc)
      .attr('d', (d) => integCurve(d))
      .attr('id', (d) => `auc${itgIdTag(d)}`)
      .on('mouseover', (event, d) => {
        d3.select(`#auc${itgIdTag(d)}`)
          .attr('stroke', 'red');
        d3.select(`#auc${itgIdTag(d)}`)
          .attr('stroke', 'red');
        d3.select(`#auc${itgIdTag(d)}`)
          .style('fill', 'red');
      })
      .on('mouseout', (event, d) => {
        d3.select(`#auc${itgIdTag(d)}`)
          .attr('stroke', 'none');
        d3.select(`#auc${itgIdTag(d)}`)
          .style('fill', 'red');
        d3.select(`#auc${itgIdTag(d)}`)
          .style('fill-opacity', 0.2);
      })
      .on('click', (event, d) => this.onClickTarget(event, d));
  }

  drawInteg(integationSt) {
    const {
      sameXY, sameLySt, sameItSt, sameData,
    } = this.shouldUpdate;
    if (sameXY && sameLySt && sameItSt && sameData) return;
    const { selectedIdx, integrations } = integationSt;
    const selectedIntegration = integrations[selectedIdx];
    const {
      stack, refArea, refFactor, shift,
    } = selectedIntegration;
    const isDisable = Cfg.btnCmdIntg(this.layout);
    const ignoreRef = Format.isLCMsLayout(this.layout);
    const itgs = isDisable ? [] : stack;

    const igbp = this.tags.igbPath.selectAll('path').data(itgs);
    igbp.exit()
      .attr('class', 'exit')
      .remove();
    const igcp = this.tags.igcPath.selectAll('path').data(itgs);
    igcp.exit()
      .attr('class', 'exit')
      .remove();

    const igtp = this.tags.igtPath.selectAll('text').data(itgs);
    igtp.exit()
      .attr('class', 'exit')
      .remove();

    if (itgs.length === 0 || isDisable) {
      // remove drawn area under curve
      const auc = this.tags.aucPath.selectAll('path').data(stack);
      auc.exit()
        .attr('class', 'exit')
        .remove();
      auc.merge(auc);
      return;
    }

    if (ignoreRef) {
      this.drawAUC(stack);
    } else {
      // rescale for zoom
      const { xt } = TfRescale(this);

      const dh = 50;
      const integBar = (data) => (
        d3.line()([
          [xt(data.xL - shift), dh],
          [xt(data.xL - shift), dh - 10],
          [xt(data.xL - shift), dh - 5],
          [xt(data.xU - shift), dh - 5],
          [xt(data.xU - shift), dh - 10],
          [xt(data.xU - shift), dh],
        ])
      );

      igbp.enter()
        .append('path')
        .attr('class', 'igbp')
        .attr('fill', 'none')
        .attr('stroke', '#228B22')
        .attr('stroke-width', 2)
        .merge(igbp)
        .attr('id', (d) => `igbp${itgIdTag(d)}`)
        .attr('d', (d) => integBar(d))
        .on('mouseover', (event, d) => {
          d3.select(`#igbp${itgIdTag(d)}`)
            .attr('stroke', 'blue');
          d3.select(`#igbc${itgIdTag(d)}`)
            .attr('stroke', 'blue');
          d3.select(`#igtp${itgIdTag(d)}`)
            .style('fill', 'blue');
        })
        .on('mouseout', (event, d) => {
          d3.select(`#igbp${itgIdTag(d)}`)
            .attr('stroke', '#228B22');
          d3.select(`#igbc${itgIdTag(d)}`)
            .attr('stroke', '#228B22');
          d3.select(`#igtp${itgIdTag(d)}`)
            .style('fill', '#228B22');
        })
        .on('click', (event, d) => this.onClickTarget(event, d));

      const integCurve = (border) => {
        const { xL, xU } = border;
        const [nXL, nXU] = [xL - shift, xU - shift];
        const ps = this.data.filter((d) => d.x > nXL && d.x < nXU);
        const kMax = this.data[this.data.length - 1].k;
        if (!ps[0]) return null;
        const kRef = ps[0].k;
        if (!this.reverseXAxis(this.layout)) {
          return d3.line()
            .x((d) => xt(d.x))
            .y((d) => 100 - (kRef - d.k) * 400 / kMax)(ps);
        }
        return d3.line()
          .x((d) => xt(d.x))
          .y((d) => 300 - (d.k - kRef) * 400 / kMax)(ps);
      };

      igcp.enter()
        .append('path')
        .attr('class', 'igcp')
        .attr('fill', 'none')
        .attr('stroke', '#228B22')
        .attr('stroke-width', 2)
        .merge(igcp)
        .attr('id', (d) => `igbc${itgIdTag(d)}`)
        .attr('d', (d) => integCurve(d))
        .on('mouseover', (event, d) => {
          d3.select(`#igbp${itgIdTag(d)}`)
            .attr('stroke', 'blue');
          d3.select(`#igbc${itgIdTag(d)}`)
            .attr('stroke', 'blue');
          d3.select(`#igtp${itgIdTag(d)}`)
            .style('fill', 'blue');
        })
        .on('mouseout', (event, d) => {
          d3.select(`#igbp${itgIdTag(d)}`)
            .attr('stroke', '#228B22');
          d3.select(`#igbc${itgIdTag(d)}`)
            .attr('stroke', '#228B22');
          d3.select(`#igtp${itgIdTag(d)}`)
            .style('fill', '#228B22');
        })
        .on('click', (event, d) => this.onClickTarget(event, d));

      igtp.enter()
        .append('text')
        .attr('class', 'igtp')
        .attr('font-family', 'Helvetica')
        .style('font-size', '12px')
        .attr('fill', '#228B22')
        .style('text-anchor', 'middle')
        .merge(igtp)
        .attr('id', (d) => `igtp${itgIdTag(d)}`)
        .text((d) => calcArea(d, refArea, refFactor, ignoreRef))
        .attr('transform', (d) => `translate(${xt((d.xL + d.xU) / 2 - shift)}, ${dh - 12})`)
        .on('mouseover', (event, d) => {
          d3.select(`#igbp${itgIdTag(d)}`)
            .attr('stroke', 'blue');
          d3.select(`#igbc${itgIdTag(d)}`)
            .attr('stroke', 'blue');
          d3.select(`#igtp${itgIdTag(d)}`)
            .style('fill', 'blue');
        })
        .on('mouseout', (event, d) => {
          d3.select(`#igbp${itgIdTag(d)}`)
            .attr('stroke', '#228B22');
          d3.select(`#igbc${itgIdTag(d)}`)
            .attr('stroke', '#228B22');
          d3.select(`#igtp${itgIdTag(d)}`)
            .style('fill', '#228B22');
        })
        .on('click', (event, d) => this.onClickTarget(event, d));
    }
  }

  create({
    filterSeed, tTrEndPts,
    layoutSt, integationSt,
    sweepExtentSt, isUiAddIntgSt, isUiNoBrushSt,
  }) {
    this.svg = d3.select('.d3Svg');
    MountMainFrame(this, 'focus');
    MountClip(this);

    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = InitScale(this, false);
    this.setTip();
    this.setDataParams(filterSeed, tTrEndPts, layoutSt);
    MountCompass(this);

    this.axis = MountAxis(this);
    this.path = MountPath(this, 'steelblue');
    this.grid = MountGrid(this);
    this.tags = MountTags(this);
    MountAxisLabelX(this);
    MountAxisLabelY(this);

    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.drawLine();
      this.drawGrid();
      this.drawInteg(integationSt);
    }
    MountBrush(this, isUiAddIntgSt, isUiNoBrushSt);
    this.resetShouldUpdate(integationSt);
  }

  reverseXAxis(layoutSt) {
    return [LIST_LAYOUT.UVVIS, LIST_LAYOUT.HPLC_UVVIS,
      LIST_LAYOUT.TGA, LIST_LAYOUT.DSC,
      LIST_LAYOUT.XRD, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
      LIST_LAYOUT.CDS, LIST_LAYOUT.DLS_ACF, LIST_LAYOUT.SEC, LIST_LAYOUT.GC,
      LIST_LAYOUT.EMISSIONS, LIST_LAYOUT.DLS_INTENSITY].indexOf(layoutSt) < 0;
  }

  update({
    filterSeed, tTrEndPts,
    layoutSt, integationSt,
    sweepExtentSt, isUiAddIntgSt, isUiNoBrushSt, uiSt,
  }) {
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = InitScale(this, false);
    this.setDataParams(filterSeed, tTrEndPts, layoutSt);
    this.uiSt = uiSt;
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.getShouldUpdate(integationSt);
      this.drawLine();
      this.drawGrid();
      this.drawInteg(integationSt);
    }

    MountBrush(this, isUiAddIntgSt, isUiNoBrushSt);
    this.resetShouldUpdate(integationSt);
  }
}

export default LineFocus;
