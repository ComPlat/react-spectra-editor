import * as d3 from 'd3';
import {
  InitScale, InitAxisCall, InitTip,
} from '../../helpers/init';
import {
  MountPath, MountGrid, MountAxis, MountAxisLabelX, MountAxisLabelY, MountRef,
  MountClip, MountMainFrame, MountTags, MountThresLine,
} from '../../helpers/mount';
import MountBrush from '../../helpers/brush';
import { TfRescale, MountCompass } from '../../helpers/compass';
import { PksEdit } from '../../helpers/converter';
import { itgIdTag, mpyIdTag } from '../../helpers/focus';
import { calcMpyCenter, calcArea } from '../../helpers/calc';
import Format from '../../helpers/format';
import Cfg from '../../helpers/cfg';

class LineFocus {
  constructor(props) {
    const {
      W, H, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    } = props;

    this.rootKlass = '.d3Line';
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
    this.thresLine = null;
    this.grid = null;
    this.tags = null;
    this.ref = null;
    this.ccPattern = null;
    this.data = [];
    this.dataPks = [];
    this.tTrEndPts = null;
    this.tSfPeaks = null;
    this.root = null;
    this.svg = null;
    this.scales = InitScale(this);
    this.axisCall = InitAxisCall(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;
    this.shouldUpdate = {};
    this.freq = false;

    this.getShouldUpdate = this.getShouldUpdate.bind(this);
    this.resetShouldUpdate = this.resetShouldUpdate.bind(this);
    this.setTip = this.setTip.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.drawThres = this.drawThres.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.drawPeaks = this.drawPeaks.bind(this);
    this.drawRef = this.drawRef.bind(this);
    this.drawInteg = this.drawInteg.bind(this);
    this.drawMtply = this.drawMtply.bind(this);
    this.onClickTarget = this.onClickTarget.bind(this);
    this.mergedPeaks = this.mergedPeaks.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }

  getShouldUpdate(nextEpSt, nextLySt, nextItSt, nextMySt) {
    const {
      prevXt, prevYt, prevEpSt, prevLySt, prevItSt, prevMySt,
      prevTePt, prevDtPk, prevSfPk, prevData,
    } = this.shouldUpdate;
    const { xt, yt } = TfRescale(this);
    const sameXY = xt(1.1) === prevXt && prevYt === yt(1.1);
    const sameEpSt = prevEpSt === nextEpSt;
    const sameLySt = prevLySt === nextLySt;
    const sameItSt = prevItSt === nextItSt;
    const sameMySt = prevMySt === nextMySt;
    const sameTePt = prevTePt === this.tTrEndPts.length;
    const sameDtPk = prevDtPk === this.dataPks.length;
    const sameSfPk = prevSfPk === this.tSfPeaks.length;
    const sameData = prevData === this.data.length;
    const sameRef = prevEpSt.prevOffset === nextEpSt.prevOffset;
    this.shouldUpdate = Object.assign(
      {},
      this.shouldUpdate,
      {
        sameXY, sameEpSt, sameLySt, sameItSt, sameMySt, // eslint-disable-line
        sameTePt, sameDtPk, sameSfPk, sameData, sameRef, // eslint-disable-line
      },
    );
  }

  resetShouldUpdate(prevEpSt, prevLySt, prevItSt, prevMySt) {
    const { xt, yt } = TfRescale(this);
    const prevXt = xt(1.1);
    const prevYt = yt(1.1);
    const prevTePt = this.tTrEndPts.length;
    const prevDtPk = this.dataPks.length;
    const prevSfPk = this.tSfPeaks.length;
    const prevData = this.data.length;
    this.shouldUpdate = Object.assign(
      {},
      this.shouldUpdate,
      {
        prevXt, prevYt, prevEpSt, prevLySt, prevItSt, prevMySt, // eslint-disable-line
        prevTePt, prevDtPk, prevSfPk, prevData, // eslint-disable-line
      },
    );
  }

  setTip(typ) {
    this.tip = InitTip(typ);
    this.root.call(this.tip);
  }

  setDataParams(data, peaks, tTrEndPts, tSfPeaks, freq) {
    this.data = [...data];
    this.dataPks = [...peaks];
    this.tTrEndPts = tTrEndPts;
    this.tSfPeaks = tSfPeaks;
    this.freq = freq;
  }

  updatePathCall(xt, yt) {
    this.pathCall = d3.line()
      .x(d => xt(d.x))
      .y(d => yt(d.y));
  }

  setConfig(sweepExtentSt) {
    // Domain Calculate
    let { xExtent, yExtent } = sweepExtentSt || { xExtent: false, yExtent: false };

    if (!xExtent || !yExtent) {
      const xes = d3.extent(this.data, d => d.x).sort((a, b) => a - b);
      xExtent = { xL: xes[0], xU: xes[1] };
      const btm = d3.min(this.data, d => d.y);
      const top = d3.max(this.data, d => d.y);
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
    const { sameXY, sameRef } = this.shouldUpdate;
    if (sameXY && sameRef) return;

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
    const { sameXY } = this.shouldUpdate;
    if (sameXY) return;

    this.grid.x.call(this.axisCall.x
      .tickSize(-this.h, 0, 0))
      .selectAll('line')
      .attr('stroke', '#ddd')
      .attr('stroke-opacity', 0.6)
      .attr('fill', 'none');
    this.grid.y.call(this.axisCall.y
      .tickSize(-this.w, 0, 0))
      .selectAll('line')
      .attr('stroke', '#ddd')
      .attr('stroke-opacity', 0.6)
      .attr('fill', 'none');
  }

  onClickTarget(data) {
    d3.event.stopPropagation();
    d3.event.preventDefault();
    const onPeak = true;
    this.clickUiTargetAct(data, onPeak);
  }

  mergedPeaks(editPeakSt) {
    if (!editPeakSt) return this.dataPks;
    this.dataPks = PksEdit(this.dataPks, editPeakSt);
    return this.dataPks;
  }

  drawPeaks(editPeakSt) {
    const {
      sameXY, sameEpSt, sameDtPk, sameSfPk,
    } = this.shouldUpdate;
    if (sameXY && sameEpSt && sameDtPk && sameSfPk) return;

    // rescale for zoom
    const { xt, yt } = TfRescale(this);
    const dPks = this.mergedPeaks(editPeakSt);

    const mpp = this.tags.pPath.selectAll('path').data(dPks);
    mpp.exit()
      .attr('class', 'exit')
      .remove();

    const linePath = [
      { x: -0.5, y: 10 },
      { x: -0.5, y: -20 },
      { x: 0.5, y: -20 },
      { x: 0.5, y: 10 },
    ];
    // const faktor = layoutSt === LIST_LAYOUT.IR ? -1 : 1;
    const lineSymbol = d3.line()
      .x(d => d.x)
      .y(d => d.y)(linePath);

    mpp.enter()
      .append('path')
      .attr('d', lineSymbol)
      .attr('class', 'enter-peak')
      .attr('fill', 'red')
      .attr('stroke', 'pink')
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0.0)
      .merge(mpp)
      .attr('id', d => `mpp${Math.round(1000 * d.x)}`)
      .attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)})`)
      .on('mouseover', (d, i, n) => {
        d3.select(`#mpp${Math.round(1000 * d.x)}`)
          .attr('stroke-opacity', '1.0');
        d3.select(`#bpt${Math.round(1000 * d.x)}`)
          .style('fill', 'blue');
        this.tip.show(d, n[i]);
      })
      .on('mouseout', (d, i, n) => {
        d3.select(`#mpp${Math.round(1000 * d.x)}`)
          .attr('stroke-opacity', '0.0');
        d3.select(`#bpt${Math.round(1000 * d.x)}`)
          .style('fill', 'red');
        this.tip.hide(d, n[i]);
      })
      .on('click', d => this.onClickTarget(d));
  }

  drawInteg(layoutSt, integationSt) {
    const {
      sameXY, sameLySt, sameItSt, sameData,
    } = this.shouldUpdate;
    if (sameXY && sameLySt && sameItSt && sameData) return;
    const {
      stack, refArea, refFactor, shift,
    } = integationSt;
    const isDisable = Cfg.btnCmdIntg(layoutSt);
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

    if (itgs.length === 0 || isDisable) return;
    // rescale for zoom
    const { xt } = TfRescale(this);

    const dh = 50;
    const integBar = data => (
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
      .attr('id', d => `igbp${itgIdTag(d)}`)
      .attr('d', d => integBar(d))
      .on('mouseover', (d) => {
        d3.select(`#igbp${itgIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.select(`#igbc${itgIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.select(`#igtp${itgIdTag(d)}`)
          .style('fill', 'blue');
      })
      .on('mouseout', (d) => {
        d3.select(`#igbp${itgIdTag(d)}`)
          .attr('stroke', '#228B22');
        d3.select(`#igbc${itgIdTag(d)}`)
          .attr('stroke', '#228B22');
        d3.select(`#igtp${itgIdTag(d)}`)
          .style('fill', '#228B22');
      })
      .on('click', d => this.onClickTarget(d));

    const integCurve = (border) => {
      const { xL, xU } = border;
      const [nXL, nXU] = [xL - shift, xU - shift];
      const ps = this.data.filter(d => d.x > nXL && d.x < nXU);
      const kMax = this.data[this.data.length - 1].k;
      if (!ps[0]) return null;
      const kRef = ps[0].k;
      return d3.line()
        .x(d => xt(d.x))
        .y(d => 300 - (d.k - kRef) * 400 / kMax)(ps);
    };

    igcp.enter()
      .append('path')
      .attr('class', 'igcp')
      .attr('fill', 'none')
      .attr('stroke', '#228B22')
      .attr('stroke-width', 2)
      .merge(igcp)
      .attr('id', d => `igbc${itgIdTag(d)}`)
      .attr('d', d => integCurve(d))
      .on('mouseover', (d) => {
        d3.select(`#igbp${itgIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.select(`#igbc${itgIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.select(`#igtp${itgIdTag(d)}`)
          .style('fill', 'blue');
      })
      .on('mouseout', (d) => {
        d3.select(`#igbp${itgIdTag(d)}`)
          .attr('stroke', '#228B22');
        d3.select(`#igbc${itgIdTag(d)}`)
          .attr('stroke', '#228B22');
        d3.select(`#igtp${itgIdTag(d)}`)
          .style('fill', '#228B22');
      })
      .on('click', d => this.onClickTarget(d));

    igtp.enter()
      .append('text')
      .attr('class', 'igtp')
      .attr('font-family', 'Helvetica')
      .style('font-size', '12px')
      .attr('fill', '#228B22')
      .style('text-anchor', 'middle')
      .merge(igtp)
      .attr('id', d => `igtp${itgIdTag(d)}`)
      .text(d => calcArea(d, refArea, refFactor))
      .attr('transform', d => `translate(${xt((d.xL + d.xU) / 2 - shift)}, ${dh - 12})`)
      .on('mouseover', (d) => {
        d3.select(`#igbp${itgIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.select(`#igbc${itgIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.select(`#igtp${itgIdTag(d)}`)
          .style('fill', 'blue');
      })
      .on('mouseout', (d) => {
        d3.select(`#igbp${itgIdTag(d)}`)
          .attr('stroke', '#228B22');
        d3.select(`#igbc${itgIdTag(d)}`)
          .attr('stroke', '#228B22');
        d3.select(`#igtp${itgIdTag(d)}`)
          .style('fill', '#228B22');
      })
      .on('click', d => this.onClickTarget(d));
  }


  drawMtply(layoutSt, mtplySt) {
    const { sameXY, sameLySt, sameMySt } = this.shouldUpdate;
    if (sameXY && sameLySt && sameMySt) return;

    const { stack, smExtext, shift } = mtplySt;
    const mpys = stack;
    const isDisable = Cfg.btnCmdMpy(layoutSt);
    if (mpys === 0 || isDisable) return;
    // rescale for zoom
    const { xt } = TfRescale(this);

    const mpyb = this.tags.mpybPath.selectAll('path').data(mpys);
    mpyb.exit()
      .attr('class', 'exit')
      .remove();
    const mpyt1 = this.tags.mpyt1Path.selectAll('text').data(mpys);
    mpyt1.exit()
      .attr('class', 'exit')
      .remove();
    const mpyt2 = this.tags.mpyt2Path.selectAll('text').data(mpys);
    mpyt2.exit()
      .attr('class', 'exit')
      .remove();
    let mPeaks = mpys.map((m) => {
      const { peaks, xExtent } = m;
      return peaks.map(p => Object.assign({}, p, { xExtent }));
    });
    mPeaks = [].concat(...mPeaks);
    const mpyp = this.tags.mpypPath.selectAll('path').data(mPeaks);
    mpyp.exit()
      .attr('class', 'exit')
      .remove();

    const height = this.h;
    const dh = Math.abs(0.06 * height);
    const mpyBar = data => (
      d3.line()([
        [xt(data.xExtent.xL - shift), height - dh],
        [xt(data.xExtent.xL - shift), height - dh - 10],
        [xt(data.xExtent.xL - shift), height - dh - 5],
        [xt(data.xExtent.xU - shift), height - dh - 5],
        [xt(data.xExtent.xU - shift), height - dh - 10],
        [xt(data.xExtent.xU - shift), height - dh],
      ])
    );

    const mpyColor = (d) => {
      const { xL, xU } = d.xExtent;
      return (smExtext.xL === xL && smExtext.xU === xU) ? 'purple' : '#DA70D6';
    };

    mpyb.enter()
      .append('path')
      .attr('class', 'mpyb')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .merge(mpyb)
      .attr('stroke', d => mpyColor(d))
      .attr('id', d => `mpyb${mpyIdTag(d)}`)
      .attr('d', d => mpyBar(d))
      .on('mouseover', (d) => {
        d3.selectAll(`#mpyb${mpyIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.selectAll(`#mpyt1${mpyIdTag(d)}`)
          .style('fill', 'blue');
        d3.selectAll(`#mpyt2${mpyIdTag(d)}`)
          .style('fill', 'blue');
        d3.selectAll(`#mpyp${mpyIdTag(d)}`)
          .attr('stroke', 'blue');
      })
      .on('mouseout', (d) => {
        const dColor = mpyColor(d);
        d3.selectAll(`#mpyb${mpyIdTag(d)}`)
          .attr('stroke', dColor);
        d3.selectAll(`#mpyt1${mpyIdTag(d)}`)
          .style('fill', dColor);
        d3.selectAll(`#mpyt2${mpyIdTag(d)}`)
          .style('fill', dColor);
        d3.selectAll(`#mpyp${mpyIdTag(d)}`)
          .attr('stroke', dColor);
      })
      .on('click', d => this.onClickTarget(d));

    mpyt1.enter()
      .append('text')
      .attr('class', 'mpyt1')
      .attr('font-family', 'Helvetica')
      .style('font-size', '12px')
      .style('text-anchor', 'middle')
      .merge(mpyt1)
      .attr('fill', d => mpyColor(d))
      .attr('id', d => `mpyt1${mpyIdTag(d)}`)
      .text(d => `${calcMpyCenter(d.peaks, shift, d.mpyType).toFixed(3)}`)
      .attr('transform', d => `translate(${xt((d.xExtent.xL + d.xExtent.xU) / 2 - shift)}, ${height - dh + 12})`)
      .on('mouseover', (d) => {
        d3.selectAll(`#mpyb${mpyIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.selectAll(`#mpyt1${mpyIdTag(d)}`)
          .style('fill', 'blue');
        d3.selectAll(`#mpyt2${mpyIdTag(d)}`)
          .style('fill', 'blue');
        d3.selectAll(`#mpyp${mpyIdTag(d)}`)
          .attr('stroke', 'blue');
      })
      .on('mouseout', (d) => {
        const dColor = mpyColor(d);
        d3.selectAll(`#mpyb${mpyIdTag(d)}`)
          .attr('stroke', dColor);
        d3.selectAll(`#mpyt1${mpyIdTag(d)}`)
          .style('fill', dColor);
        d3.selectAll(`#mpyt2${mpyIdTag(d)}`)
          .style('fill', dColor);
        d3.selectAll(`#mpyp${mpyIdTag(d)}`)
          .attr('stroke', dColor);
      })
      .on('click', d => this.onClickTarget(d));

    mpyt2.enter()
      .append('text')
      .attr('class', 'mpyt2')
      .attr('font-family', 'Helvetica')
      .style('font-size', '12px')
      .style('text-anchor', 'middle')
      .merge(mpyt2)
      .attr('fill', d => mpyColor(d))
      .attr('id', d => `mpyt2${mpyIdTag(d)}`)
      .text(d => `(${d.mpyType})`)
      .attr('transform', d => `translate(${xt((d.xExtent.xL + d.xExtent.xU) / 2 - shift)}, ${height - dh + 24})`)
      .on('mouseover', (d) => {
        d3.selectAll(`#mpyb${mpyIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.selectAll(`#mpyt1${mpyIdTag(d)}`)
          .style('fill', 'blue');
        d3.selectAll(`#mpyt2${mpyIdTag(d)}`)
          .style('fill', 'blue');
        d3.selectAll(`#mpyp${mpyIdTag(d)}`)
          .attr('stroke', 'blue');
      })
      .on('mouseout', (d) => {
        const dColor = mpyColor(d);
        d3.selectAll(`#mpyb${mpyIdTag(d)}`)
          .attr('stroke', dColor);
        d3.selectAll(`#mpyt1${mpyIdTag(d)}`)
          .style('fill', dColor);
        d3.selectAll(`#mpyt2${mpyIdTag(d)}`)
          .style('fill', dColor);
        d3.selectAll(`#mpyp${mpyIdTag(d)}`)
          .attr('stroke', dColor);
      })
      .on('click', d => this.onClickTarget(d));

    const mpypH = height - dh;
    const mpypPath = pk => (
      [
        { x: xt(pk.x - shift) - 0.5, y: mpypH - 5 },
        { x: xt(pk.x - shift) - 0.5, y: mpypH - 20 },
        { x: xt(pk.x - shift) + 0.5, y: mpypH - 20 },
        { x: xt(pk.x - shift) + 0.5, y: mpypH - 5 },
      ]
    );
    // const faktor = layoutSt === LIST_LAYOUT.IR ? -1 : 1;
    const lineSymbol = d3.line()
      .x(d => d.x)
      .y(d => d.y);

    mpyp.enter()
      .append('path')
      .attr('class', 'mpyp')
      .attr('fill', 'none')
      .merge(mpyp)
      .attr('stroke', d => mpyColor(d))
      .attr('d', d => lineSymbol(mpypPath(d)))
      .attr('id', d => `mpyp${mpyIdTag(d)}`)
      .on('mouseover', (d) => {
        d3.selectAll(`#mpyb${mpyIdTag(d)}`)
          .attr('stroke', 'blue');
        d3.selectAll(`#mpyt1${mpyIdTag(d)}`)
          .style('fill', 'blue');
        d3.selectAll(`#mpyt2${mpyIdTag(d)}`)
          .style('fill', 'blue');
        d3.selectAll(`#mpyp${mpyIdTag(d)}`)
          .attr('stroke', 'blue');
      })
      .on('mouseout', (d) => {
        const dColor = mpyColor(d);
        d3.selectAll(`#mpyb${mpyIdTag(d)}`)
          .attr('stroke', dColor);
        d3.selectAll(`#mpyt1${mpyIdTag(d)}`)
          .style('fill', dColor);
        d3.selectAll(`#mpyt2${mpyIdTag(d)}`)
          .style('fill', dColor);
        d3.selectAll(`#mpyp${mpyIdTag(d)}`)
          .attr('stroke', dColor);
      })
      .on('click', d => this.onClickTarget(d));
  }

  drawRef(layoutSt) {
    // rescale for zoom
    const { xt, yt } = TfRescale(this);

    const ccp = this.ref.selectAll('path')
      .data(this.tSfPeaks);

    ccp.exit()
      .attr('class', 'exit')
      .remove();

    const linePath = [
      { x: -0.5, y: 10 },
      { x: -4, y: -20 },
      { x: 4, y: -20 },
      { x: 0.5, y: 10 },
    ];
    const faktor = Format.isIrLayout(layoutSt) ? -1 : 1;
    const lineSymbol = d3.line()
      .x(d => d.x)
      .y(d => faktor * d.y)(linePath);

    ccp.enter()
      .append('path')
      .attr('d', lineSymbol)
      .attr('class', 'enter-ref')
      .attr('fill', 'green')
      .attr('fill-opacity', 0.8)
      .merge(ccp)
      .attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)})`);
  }

  create({
    filterSeed, filterPeak, tTrEndPts, tSfPeaks, freq,
    editPeakSt, layoutSt, integationSt, mtplySt,
    sweepExtentSt, isUiAddIntgSt, isUiNoBrushSt,
  }) {
    this.svg = d3.select('.d3Svg');
    MountMainFrame(this, 'focus');
    MountClip(this);

    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.setTip(layoutSt);
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks, freq);
    MountCompass(this);

    this.axis = MountAxis(this);
    this.path = MountPath(this, 'steelblue');
    this.thresLine = MountThresLine(this, 'green');
    this.grid = MountGrid(this);
    this.tags = MountTags(this);
    this.ref = MountRef(this);
    MountAxisLabelX(this);
    MountAxisLabelY(this);

    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.drawLine();
      this.drawThres();
      this.drawGrid();
      this.drawRef(layoutSt);
      this.drawPeaks(editPeakSt);
      this.drawInteg(layoutSt, integationSt);
      this.drawMtply(layoutSt, mtplySt);
    }
    MountBrush(this, isUiAddIntgSt, isUiNoBrushSt);
    this.resetShouldUpdate(editPeakSt, layoutSt, integationSt, mtplySt);
  }

  update({
    filterSeed, filterPeak, tTrEndPts, tSfPeaks, freq,
    editPeakSt, layoutSt, integationSt, mtplySt,
    sweepExtentSt, isUiAddIntgSt, isUiNoBrushSt,
  }) {
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks, freq);

    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.getShouldUpdate(editPeakSt, layoutSt, integationSt, mtplySt);
      this.drawLine();
      this.drawThres();
      this.drawGrid();
      this.drawRef(layoutSt);
      this.drawPeaks(editPeakSt);
      this.drawInteg(layoutSt, integationSt);
      this.drawMtply(layoutSt, mtplySt);
    }
    MountBrush(this, isUiAddIntgSt, isUiNoBrushSt);
    this.resetShouldUpdate(editPeakSt, layoutSt, integationSt, mtplySt);
  }
}

export default LineFocus;
