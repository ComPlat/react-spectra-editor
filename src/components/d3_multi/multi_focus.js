import * as d3 from 'd3';
import {
  InitScale, InitAxisCall, InitTip,
} from '../../helpers/init';
import {
  MountPath, MountGrid, MountAxis, MountAxisLabelX, MountAxisLabelY,
  MountClip, MountMainFrame, MountTags, MountComparePath
} from '../../helpers/mount';
import { PksEdit, PeckersEdit } from '../../helpers/converter';
import MountBrush from '../../helpers/brush';
import { TfRescale, MountCompass } from '../../helpers/compass';
import { LIST_LAYOUT } from '../../constants/list_layout';
import Format from '../../helpers/format';
import {
  convertTopic
} from '../../helpers/chem';

class MultiFocus {
  constructor(props) {
    const {
      W, H, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct, entities
    } = props;

    this.entities = entities;
    this.jcampIdx = 0;
    this.rootKlass = ".d3Line";
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
    this.otherLineData = [];
    this.pathColor = 'steelblue';
    this.dataPks = [];
    this.dataPeckers = [];
    this.tTrEndPts = null;
    this.tSfPeaks = null;
    this.root = null;
    this.svg = null;
    this.axisCall = InitAxisCall(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;
    this.shouldUpdate = {};
    // this.freq = false;
    this.layout = LIST_LAYOUT.CYCLIC_VOLTAMMETRY;

    this.getShouldUpdate = this.getShouldUpdate.bind(this);
    this.resetShouldUpdate = this.resetShouldUpdate.bind(this);
    this.setTip = this.setTip.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.drawOtherLines = this.drawOtherLines.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.drawPeaks = this.drawPeaks.bind(this);
    this.onClickTarget = this.onClickTarget.bind(this);
    this.mergedPeaks = this.mergedPeaks.bind(this);
    this.setDataPecker = this.setDataPecker.bind(this);
    this.drawPeckers = this.drawPeckers.bind(this);
    this.onClickPecker = this.onClickPecker.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
    this.cyclicvoltaSt = null;
  }

  getShouldUpdate(nextEpSt) {
    const {
      prevXt, prevYt, prevEpSt, prevLySt,
      prevTePt, prevDtPk, prevSfPk, prevData,
    } = this.shouldUpdate;
    const { xt, yt } = TfRescale(this);
    const sameXY = xt(1.1) === prevXt && prevYt === yt(1.1);
    const sameEpSt = prevEpSt === nextEpSt;
    const sameLySt = prevLySt === this.layout;
    const sameTePt = prevTePt === this.tTrEndPts.length;
    const sameDtPk = prevDtPk === this.dataPks.length;
    const sameSfPk = prevSfPk === this.tSfPeaks.length;
    const sameData = prevData === this.data.length;
    this.shouldUpdate = Object.assign(
      {},
      this.shouldUpdate,
      {
        sameXY, sameEpSt, sameLySt, // eslint-disable-line
        sameTePt, sameDtPk, sameSfPk, sameData, // eslint-disable-line
      },
    );
  }

  resetShouldUpdate(prevEpSt) {
    const { xt, yt } = TfRescale(this);
    const prevXt = xt(1.1);
    const prevYt = yt(1.1);
    const prevTePt = this.tTrEndPts.length;
    const prevDtPk = this.dataPks.length;
    const prevSfPk = this.tSfPeaks.length;
    const prevData = this.data.length;
    const prevLySt = this.layout;
    this.shouldUpdate = Object.assign(
      {},
      this.shouldUpdate,
      {
        prevXt, prevYt, prevEpSt, prevLySt, // eslint-disable-line
        prevTePt, prevDtPk, prevSfPk, prevData, // eslint-disable-line
      },
    );
  }

  setTip() {
    this.tip = InitTip();
    this.root.call(this.tip);
  }

  setDataParams(peaks, tTrEndPts, tSfPeaks, layout, cyclicvoltaSt, jcampIdx=0) {
    this.jcampIdx = jcampIdx;
    this.data = [];
    this.otherLineData = [];
    this.entities.forEach((entry, idx) => {
      const { topic, feature, color } = entry;
      const currData = convertTopic(topic, layout, feature, 0);
      if (idx === this.jcampIdx) {
        this.data = [...currData];
        this.pathColor = color;
      }
      else {
        this.otherLineData.push({ data: currData, color });
      }
    });
    
    this.dataPks = [...peaks];
    this.tTrEndPts = tTrEndPts;
    this.tSfPeaks = tSfPeaks;
    this.layout = layout;
    this.cyclicvoltaSt = cyclicvoltaSt;
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
      let allData = [...this.data];
      if (this.otherLineData) {
        this.otherLineData.forEach((lineData) => {
          allData = [...allData, ...lineData.data];
        });
      }
      
      const xes = d3.extent(allData, d => d.x).sort((a, b) => a - b);
      xExtent = { xL: xes[0], xU: xes[1] };
      const btm = d3.min(allData, d => d.y);
      const top = d3.max(allData, d => d.y);
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
    const { xt, yt } = TfRescale(this);
    this.updatePathCall(xt, yt);
    this.path.attr('d', this.pathCall(this.data));
    this.path.style('stroke', this.pathColor);
  }

  drawOtherLines(layout) {
    d3.selectAll('.line-clip-compare').remove();
    if (!this.otherLineData) return null;
    this.otherLineData.forEach((entry, idx) => {
      const { data, color } = entry;
      const pathColor = color ? color : Format.mutiEntitiesColors(idx);
      const path = MountComparePath(this, pathColor, idx, 0.4);
      path.attr('d', this.pathCall(data));
    });
    return null;
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
    const { spectraList } = this.cyclicvoltaSt;
    const spectra = spectraList[this.jcampIdx];
    const voltammetryPeakIdx = spectra.selectedIdx;
    this.clickUiTargetAct(data, onPeak, voltammetryPeakIdx, this.jcampIdx);
  }

  onClickPecker(data) {
    d3.event.stopPropagation();
    d3.event.preventDefault();
    const onPecker = true;
    const { spectraList } = this.cyclicvoltaSt;
    const spectra = spectraList[this.jcampIdx];
    const voltammetryPeakIdx = spectra.selectedIdx;
    this.clickUiTargetAct(data, false, voltammetryPeakIdx, this.jcampIdx, onPecker);
  }

  mergedPeaks(editPeakSt) {
    if (!editPeakSt) return this.dataPks;
    const { spectraList } = this.cyclicvoltaSt;
    const spectra = spectraList[this.jcampIdx];
    if (spectra) {
      this.dataPks = [];
      this.dataPks = PksEdit(this.dataPks, editPeakSt, spectra.list);
    }
    else {
      this.dataPks = PksEdit(this.dataPks, editPeakSt, []);
    }
    
    return this.dataPks;
  }

  setDataPecker() {
    const { spectraList } = this.cyclicvoltaSt;
    const spectra = spectraList[this.jcampIdx];
    if (spectra) {
      this.dataPeckers = PeckersEdit(spectra.list);
    }
    return this.dataPeckers;
  }

  drawPeaks(editPeakSt) {
    const {
      sameXY, sameEpSt, sameDtPk, sameSfPk,
    } = this.shouldUpdate;

    if (!Format.isCyclicVoltaLayout(this.layout) && sameXY && sameEpSt && sameDtPk && sameSfPk) return;

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
        const tipParams = { d, layout: this.layout };
        this.tip.show(tipParams, n[i]);
      })
      .on('mouseout', (d, i, n) => {
        d3.select(`#mpp${Math.round(1000 * d.x)}`)
          .attr('stroke-opacity', '0.0');
        d3.select(`#bpt${Math.round(1000 * d.x)}`)
          .style('fill', 'red');
        const tipParams = { d, layout: this.layout };
        this.tip.hide(tipParams, n[i]);
      })
      .on('click', d => this.onClickTarget(d));

    
    const ignoreRef = Format.isHplcUvVisLayout(this.layout);
    if (ignoreRef) {
      const bpTxt = this.tags.bpTxt.selectAll('text').data(dPks);
      bpTxt.exit()
        .attr('class', 'exit')
        .remove();
  
      bpTxt.enter()
      .append('text')
      .attr('class', 'peak-text')
      .attr('font-family', 'Helvetica')
      .style('font-size', '12px')
      .attr('fill', '#228B22')
      .style('text-anchor', 'middle')
      .merge(bpTxt)
      .attr('id', d => `mpp${Math.round(1000 * d.x)}`)
      .text(d => d.x.toFixed(2))
      .attr('transform', d => `translate(${xt(d.x)}, ${yt(d.y)-25})`)
      .on('click', d => this.onClickTarget(d));
    }
  }

  drawPeckers() {
    const {
      sameXY, sameEpSt, sameDtPk, sameSfPk,
    } = this.shouldUpdate;

    if (!Format.isCyclicVoltaLayout(this.layout) && sameXY && sameEpSt && sameDtPk && sameSfPk) return;

    // rescale for zoom
    const { xt, yt } = TfRescale(this);
    const dPks = this.setDataPecker();

    const mpp = this.tags.peckerPath.selectAll('path').data(dPks);
    mpp.exit()
      .attr('class', 'exit')
      .remove();

    const linePath = [
      { x: -0.5, y: 10 },
      { x: -0.5, y: -20 },
      { x: 0.5, y: -20 },
      { x: 0.5, y: 10 },
    ];
    const lineSymbol = d3.line()
      .x(d => d.x)
      .y(d => d.y)(linePath);

    mpp.enter()
      .append('path')
      .attr('d', lineSymbol)
      .attr('class', 'enter-peak')
      .attr('fill', '#228B22')
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
        const tipParams = { d, layout: this.layout };
        this.tip.show(tipParams, n[i]);
      })
      .on('mouseout', (d, i, n) => {
        d3.select(`#mpp${Math.round(1000 * d.x)}`)
          .attr('stroke-opacity', '0.0');
        d3.select(`#bpt${Math.round(1000 * d.x)}`)
          .style('fill', '#228B22');
        const tipParams = { d, layout: this.layout };
        this.tip.hide(tipParams, n[i]);
      })
      .on('click', d => this.onClickPecker(d));

  }

  create({
    curveSt,
    filterSeed, filterPeak, tTrEndPts, tSfPeaks,
    editPeakSt, layoutSt,
    sweepExtentSt, isUiNoBrushSt,
    cyclicvoltaSt
  }) {
    this.svg = d3.select(this.rootKlass).select('.d3Svg');
    MountMainFrame(this, 'focus');
    MountClip(this);

    const { curveIdx } = curveSt;
    const jcampIdx = curveIdx;

    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = InitScale(this, false);
    this.setTip();
    this.setDataParams(filterPeak, tTrEndPts, tSfPeaks, layoutSt, cyclicvoltaSt, jcampIdx);
    MountCompass(this);

    this.axis = MountAxis(this);
    this.path = MountPath(this, this.pathColor);
    this.grid = MountGrid(this);
    this.tags = MountTags(this);
    MountAxisLabelX(this);
    MountAxisLabelY(this);

    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.drawLine();
      this.drawGrid();
      this.drawOtherLines(layoutSt);
      this.drawPeaks(editPeakSt);
      this.drawPeckers();
    }
    MountBrush(this, false, isUiNoBrushSt);
    this.resetShouldUpdate(editPeakSt);
  }

  update({
    entities, curveSt,
    filterSeed, filterPeak, tTrEndPts, tSfPeaks,
    editPeakSt, layoutSt,
    sweepExtentSt, isUiNoBrushSt, cyclicvoltaSt
  }) {
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = InitScale(this, false);

    const { curveIdx } = curveSt;
    const jcampIdx = curveIdx;
    this.entities = entities;

    this.setDataParams(filterPeak, tTrEndPts, tSfPeaks, layoutSt, cyclicvoltaSt, jcampIdx);

    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.getShouldUpdate(editPeakSt);
      this.drawLine();
      this.drawGrid();
      this.drawOtherLines(layoutSt);
      this.drawPeaks(editPeakSt);
      this.drawPeckers();
    }
    MountBrush(this, false, isUiNoBrushSt);
    this.resetShouldUpdate(editPeakSt);
  }
}

export default MultiFocus;