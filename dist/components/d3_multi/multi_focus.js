"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _init = require("../../helpers/init");
var _mount = require("../../helpers/mount");
var _converter = require("../../helpers/converter");
var _brush = _interopRequireDefault(require("../../helpers/brush"));
var _compass = require("../../helpers/compass");
var _list_layout = require("../../constants/list_layout");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _chem = require("../../helpers/chem");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _focus = require("../../helpers/focus");
var _integration = require("../../helpers/integration");
var _multiplicity_calc = require("../../helpers/multiplicity_calc");
var _calc = require("../../helpers/calc");
/* eslint-disable no-unused-vars, prefer-object-spread, no-mixed-operators,
no-unneeded-ternary, arrow-body-style, max-len */

const d3 = require('d3');
class MultiFocus {
  constructor(props) {
    const {
      W,
      H,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      entities
    } = props;
    this.entities = entities;
    this.jcampIdx = 0;
    this.isShowAllCurves = false;
    this.rootKlass = '.d3Line';
    this.margin = {
      t: 5,
      b: 40,
      l: 60,
      r: 5
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
    this.thresLineUp = null;
    this.thresLineDw = null;
    this.grid = null;
    this.tags = null;
    this.ref = null;
    this.data = [];
    this.otherLineData = [];
    this.pathColor = 'steelblue';
    this.dataPks = [];
    this.dataPeckers = [];
    this.tTrEndPts = null;
    this.tSfPeaks = null;
    this.root = null;
    this.svg = null;
    this.axisCall = (0, _init.InitAxisCall)(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;
    this.shouldUpdate = {};
    // this.freq = false;
    this.layout = _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY;
    this.getShouldUpdate = this.getShouldUpdate.bind(this);
    this.resetShouldUpdate = this.resetShouldUpdate.bind(this);
    this.setTip = this.setTip.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.drawThres = this.drawThres.bind(this);
    this.drawOtherLines = this.drawOtherLines.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.drawPeaks = this.drawPeaks.bind(this);
    this.drawRef = this.drawRef.bind(this);
    this.drawInteg = this.drawInteg.bind(this);
    this.drawMtply = this.drawMtply.bind(this);
    this.drawAUC = this.drawAUC.bind(this);
    this.onClickTarget = this.onClickTarget.bind(this);
    this.mergedPeaks = this.mergedPeaks.bind(this);
    this.setDataPecker = this.setDataPecker.bind(this);
    this.drawPeckers = this.drawPeckers.bind(this);
    this.onClickPecker = this.onClickPecker.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
    this.cyclicvoltaSt = null;
    this.yTransformFactor = 1.0;
  }
  getShouldUpdate(nextEpSt) {
    const {
      prevXt,
      prevYt,
      prevEpSt,
      prevLySt,
      prevTePt,
      prevDtPk,
      prevSfPk,
      prevData
    } = this.shouldUpdate;
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const sameXY = xt(1.1) === prevXt && prevYt === yt(1.1);
    const sameEpSt = prevEpSt === nextEpSt;
    const sameLySt = prevLySt === this.layout;
    const sameTePt = prevTePt === this.tTrEndPts.length;
    const sameDtPk = prevDtPk === this.dataPks.length;
    const sameSfPk = JSON.stringify(prevSfPk) === JSON.stringify(this.tSfPeaks);
    const sameData = prevData === this.data.length;
    this.shouldUpdate = Object.assign({}, this.shouldUpdate, {
      sameXY,
      sameEpSt,
      sameLySt,
      // eslint-disable-line
      sameTePt,
      sameDtPk,
      sameSfPk,
      sameData // eslint-disable-line
    });
  }
  resetShouldUpdate(prevEpSt) {
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const prevXt = xt(1.1);
    const prevYt = yt(1.1);
    const prevTePt = this.tTrEndPts.length;
    const prevDtPk = this.dataPks.length;
    const prevSfPk = this.tSfPeaks;
    const prevData = this.data.length;
    const prevLySt = this.layout;
    this.shouldUpdate = Object.assign({}, this.shouldUpdate, {
      prevXt,
      prevYt,
      prevEpSt,
      prevLySt,
      // eslint-disable-line
      prevTePt,
      prevDtPk,
      prevSfPk,
      prevData // eslint-disable-line
    });
  }
  setTip() {
    this.tip = (0, _init.InitTip)();
    this.root.call(this.tip);
  }
  computeYTransformFactor(layout, cyclicvoltaSt, feature) {
    let factor = 1.0;
    if (layout === _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY && cyclicvoltaSt && cyclicvoltaSt.useCurrentDensity) {
      const rawArea = (cyclicvoltaSt.areaValue === '' ? 1.0 : cyclicvoltaSt.areaValue) || 1.0;
      const areaUnit = cyclicvoltaSt.areaUnit || 'cm²';
      const safeArea = rawArea > 0 ? rawArea : 1.0;
      const areaInCm2 = areaUnit === 'mm²' ? safeArea / 100.0 : safeArea;
      factor = 1.0 / areaInCm2;
      const baseY = feature && feature.yUnit ? String(feature.yUnit) : 'A';
      if (/mA/i.test(baseY)) {
        factor *= 1000.0;
      }
      if (areaUnit === 'mm²') {
        factor /= 100.0;
      }
    }
    return factor;
  }
  transformYValue(y) {
    return y * this.yTransformFactor;
  }
  setDataParams(filterSeed, peaks, tTrEndPts, tSfPeaks, layout, cyclicvoltaSt, jcampIdx = 0) {
    this.data = [];
    this.otherLineData = [];
    let filterSubLayoutValue = null;
    const currFeature = this.entities && this.entities[0] ? this.entities[0].feature : null;
    this.yTransformFactor = this.computeYTransformFactor(layout, cyclicvoltaSt, currFeature);
    this.entities.forEach((entry, idx) => {
      const {
        topic,
        feature,
        color
      } = entry;
      const offset = (0, _chem.GetCyclicVoltaPreviousShift)(cyclicvoltaSt, jcampIdx);
      let currData = (0, _chem.convertTopic)(topic, layout, feature, offset);
      if (this.yTransformFactor !== 1.0) {
        currData = currData.map(p => ({
          x: p.x,
          y: this.transformYValue(p.y),
          k: p.k
        }));
      }
      if (idx === jcampIdx) {
        if (!_format.default.isCyclicVoltaLayout(layout)) {
          currData = filterSeed;
        }
        this.data = [...currData];
        this.pathColor = color;
        filterSubLayoutValue = _format.default.isSECLayout(layout) ? feature.xUnit : feature.yUnit;
      } else {
        const filterValue = _format.default.isSECLayout(layout) ? feature.xUnit : feature.yUnit;
        this.otherLineData.push({
          data: currData,
          color,
          filterSublayout: filterValue
        });
      }
    });
    if (_format.default.isSECLayout(layout) || _format.default.isGCLayout(layout)) {
      this.otherLineData = this.otherLineData.filter(data => {
        return data.filterSublayout === filterSubLayoutValue;
      });
    }
    if (this.jcampIdx === jcampIdx) {
      this.dataPks = [...peaks];
    } else {
      this.dataPks = peaks;
    }
    this.tTrEndPts = tTrEndPts;
    this.tSfPeaks = tSfPeaks;
    this.layout = layout;
    this.cyclicvoltaSt = cyclicvoltaSt;
    this.jcampIdx = jcampIdx;
  }
  updatePathCall(xt, yt) {
    this.pathCall = d3.line().x(d => xt(d.x)).y(d => yt(d.y));
  }
  setConfig(sweepExtentSt) {
    // Domain Calculate
    let {
      xExtent,
      yExtent
    } = sweepExtentSt || {
      xExtent: false,
      yExtent: false
    };
    if (!xExtent || !yExtent) {
      let allData = [...this.data];
      if (this.otherLineData) {
        this.otherLineData.forEach(lineData => {
          allData = [...allData, ...lineData.data];
        });
      }
      const xes = d3.extent(allData, d => d.x).sort((a, b) => a - b);
      xExtent = {
        xL: xes[0],
        xU: xes[1]
      };
      const btm = d3.min(allData, d => d.y);
      const top = d3.max(allData, d => d.y);
      const height = top - btm;
      yExtent = {
        yL: btm - this.factor * height,
        yU: top + this.factor * height
      };
    }
    this.scales.x.domain([xExtent.xL, xExtent.xU]);
    this.scales.y.domain([yExtent.yL, yExtent.yU]);

    // rescale for zoom
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);

    // Axis Call
    this.axisCall.x.scale(xt);
    this.axisCall.y.scale(yt);
    this.currentExtent = {
      xExtent,
      yExtent
    };
  }
  drawLine() {
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    this.updatePathCall(xt, yt);
    this.path.attr('d', this.pathCall(this.data));
    this.path.style('stroke', this.pathColor);
    if (this.layout === _list_layout.LIST_LAYOUT.AIF) {
      this.path.attr('marker-mid', 'url(#arrow-left)');
    }
  }
  drawThres() {
    if (this.tTrEndPts.length > 0) {
      const upScaled = this.tTrEndPts.map(p => ({
        x: p.x,
        y: this.transformYValue(p.y)
      }));
      this.thresLineUp.attr('d', this.pathCall(upScaled));
      this.thresLineUp.attr('visibility', 'visible');
      const [left, right] = this.tTrEndPts;
      const dwMirrorEndPts = [Object.assign({}, left, {
        y: -left.y
      }), Object.assign({}, right, {
        y: -right.y
      })];
      const dwScaled = dwMirrorEndPts.map(p => ({
        x: p.x,
        y: this.transformYValue(p.y)
      }));
      this.thresLineDw.attr('d', this.pathCall(dwScaled));
      this.thresLineDw.attr('visibility', 'visible');
    } else {
      this.thresLineUp.attr('visibility', 'hidden');
      this.thresLineDw.attr('visibility', 'hidden');
    }
  }
  drawOtherLines(layout) {
    d3.selectAll('.line-clip-compare').remove();
    if (!this.otherLineData) return null;
    this.otherLineData.forEach((entry, idx) => {
      const {
        data,
        color
      } = entry;
      const pathColor = color ? color : _format.default.mutiEntitiesColors(idx);
      const path = (0, _mount.MountComparePath)(this, pathColor, idx, 0.4);
      path.attr('d', this.pathCall(data));
      if (this.layout === _list_layout.LIST_LAYOUT.AIF && this.isShowAllCurves === true) {
        path.attr('marker-mid', 'url(#arrow-left)');
      }
    });
    return null;
  }
  drawGrid() {
    const {
      sameXY
    } = this.shouldUpdate;
    if (sameXY) return;
    this.grid.x.call(this.axisCall.x.tickSize(-this.h, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
    this.grid.y.call(this.axisCall.y.tickSize(-this.w, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
  }
  onClickTarget(event, data) {
    event.stopPropagation();
    event.preventDefault();
    const onPeak = true;
    if (this.layout === _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
      const {
        spectraList
      } = this.cyclicvoltaSt;
      const spectra = spectraList[this.jcampIdx];
      const voltammetryPeakIdx = spectra.selectedIdx;
      this.clickUiTargetAct(data, onPeak, voltammetryPeakIdx, this.jcampIdx);
    } else {
      this.clickUiTargetAct(data, onPeak, false, this.jcampIdx);
    }
  }
  onClickPecker(event, data) {
    event.stopPropagation();
    event.preventDefault();
    const onPecker = true;
    const {
      spectraList
    } = this.cyclicvoltaSt;
    const spectra = spectraList[this.jcampIdx];
    const voltammetryPeakIdx = spectra.selectedIdx;
    this.clickUiTargetAct(data, false, voltammetryPeakIdx, this.jcampIdx, onPecker);
  }
  mergedPeaks(editPeakSt) {
    if (!editPeakSt) return this.dataPks;
    const {
      spectraList
    } = this.cyclicvoltaSt;
    const spectra = spectraList[this.jcampIdx];
    if (spectra) {
      this.dataPks = [];
      this.dataPks = (0, _converter.PksEdit)(this.dataPks, editPeakSt, spectra.list);
    } else {
      const newEditPeaks = Object.assign({}, editPeakSt, {
        selectedIdx: this.jcampIdx
      });
      this.dataPks = (0, _converter.PksEdit)(this.dataPks, newEditPeaks, []);
    }
    return this.dataPks;
  }
  setDataPecker() {
    const {
      spectraList
    } = this.cyclicvoltaSt;
    const spectra = spectraList[this.jcampIdx];
    if (spectra) {
      this.dataPeckers = (0, _converter.PeckersEdit)(spectra.list);
    }
    return this.dataPeckers;
  }
  drawAUC(stack) {
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const auc = this.tags.aucPath.selectAll('path').data(stack);
    auc.exit().attr('class', 'exit').remove();
    const integCurve = border => {
      const {
        xL,
        xU
      } = border;
      const ps = this.data.filter(d => d.x > xL && d.x < xU);
      if (!ps[0]) return null;
      const point1 = ps[0];
      const point2 = ps[ps.length - 1];
      const slope = (0, _calc.calcSlope)(point1.x, point1.y, point2.x, point2.y);
      let lastDY = point1.y;
      return d3.area().x(d => xt(d.x)).y0((d, index) => {
        if (index > 0) {
          const lastD = ps[index - 1];
          const y = slope * (d.x - lastD.x) + lastDY;
          lastDY = y;
          return yt(y);
        }
        return yt(0);
      }).y1(d => yt(d.y))(ps);
    };
    auc.enter().append('path').attr('class', 'auc').attr('fill', 'red').attr('stroke', 'none').attr('fill-opacity', 0.2).attr('stroke-width', 2).merge(auc).attr('d', d => integCurve(d)).attr('id', d => `auc${(0, _focus.itgIdTag)(d)}`).on('mouseover', (event, d) => {
      d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
      d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
      d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).style('fill', 'blue');
    }).on('mouseout', (event, d) => {
      d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'none');
      d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).style('fill', 'red');
      d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).style('fill-opacity', 0.2);
    }).on('click', (event, d) => this.onClickTarget(event, d));
  }
  drawPeaks(editPeakSt) {
    const {
      sameXY,
      sameEpSt,
      sameDtPk,
      sameSfPk
    } = this.shouldUpdate;
    if (!_format.default.isCyclicVoltaLayout(this.layout) && sameXY && sameEpSt && sameDtPk && sameSfPk) return;

    // rescale for zoom
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const dPks = this.mergedPeaks(editPeakSt);
    const {
      spectraList
    } = this.cyclicvoltaSt;
    const spectra = spectraList[this.jcampIdx];
    let indexOfCVRefPeaks = [];
    if (spectra) {
      const {
        shift,
        hasRefPeak
      } = spectra;
      const {
        ref
      } = shift;
      if (ref && hasRefPeak) {
        const {
          min,
          max
        } = ref;
        indexOfCVRefPeaks = dPks.map((p, index) => {
          return p === min || p === max ? -1 : index;
        });
      }
    }
    const mpp = this.tags.pPath.selectAll('path').data(dPks);
    mpp.exit().attr('class', 'exit').remove();
    const linePath = [{
      x: -0.5,
      y: 10
    }, {
      x: -0.5,
      y: -20
    }, {
      x: 0.5,
      y: -20
    }, {
      x: 0.5,
      y: 10
    }];
    const lineSymbol = d3.line().x(d => d.x).y(d => d.y)(linePath);
    const lineRefPath = [{
      x: -0.5,
      y: 10
    }, {
      x: -4,
      y: -20
    }, {
      x: 4,
      y: -20
    }, {
      x: 0.5,
      y: 10
    }];
    const lineSymbolRef = d3.line().x(d => d.x).y(d => d.y)(lineRefPath);
    mpp.enter().append('path').attr('d', (_, index) => {
      return indexOfCVRefPeaks[index] === -1 ? lineSymbolRef : lineSymbol;
    }).attr('class', 'enter-peak').attr('fill', (_, index) => {
      return indexOfCVRefPeaks[index] === -1 ? 'blue' : 'red';
    }).attr('stroke', 'pink').attr('stroke-width', 3).attr('stroke-opacity', 0.0).merge(mpp).attr('id', d => `mpp${Math.round(1000 * d.x)}`).attr('transform', d => `translate(${xt(d.x)}, ${yt(this.transformYValue(d.y))})`).on('mouseover', (event, d) => {
      d3.select(`#mpp${Math.round(1000 * d.x)}`).attr('stroke-opacity', '1.0');
      d3.select(`#bpt${Math.round(1000 * d.x)}`).style('fill', 'blue');
      const tipParams = {
        d,
        layout: this.layout
      };
      this.tip.show(tipParams, event.target);
    }).on('mouseout', (event, d) => {
      d3.select(`#mpp${Math.round(1000 * d.x)}`).attr('stroke-opacity', '0.0');
      d3.select(`#bpt${Math.round(1000 * d.x)}`).style('fill', 'red');
      const tipParams = {
        d,
        layout: this.layout
      };
      this.tip.hide(tipParams, event.target);
    }).on('click', (event, d) => this.onClickTarget(event, d));
    const ignoreRef = _format.default.isHplcUvVisLayout(this.layout);
    if (ignoreRef) {
      const bpTxt = this.tags.bpTxt.selectAll('text').data(dPks);
      bpTxt.exit().attr('class', 'exit').remove();
      bpTxt.enter().append('text').attr('class', 'peak-text').attr('font-family', 'Helvetica').style('font-size', '12px').attr('fill', '#228B22').style('text-anchor', 'middle').merge(bpTxt).attr('id', d => `mpp${Math.round(1000 * d.x)}`).text(d => d.x.toFixed(2)).attr('transform', d => `translate(${xt(d.x)}, ${yt(this.transformYValue(d.y)) - 25})`).on('click', (event, d) => this.onClickTarget(event, d));
    }
    mpp.attr('fill', (_, index) => {
      return indexOfCVRefPeaks[index] === -1 ? 'blue' : 'red';
    });
    mpp.attr('d', (_, index) => {
      return indexOfCVRefPeaks[index] === -1 ? lineSymbolRef : lineSymbol;
    });
  }
  drawPeckers() {
    const {
      sameXY,
      sameEpSt,
      sameDtPk,
      sameSfPk
    } = this.shouldUpdate;
    if (!_format.default.isCyclicVoltaLayout(this.layout) && sameXY && sameEpSt && sameDtPk && sameSfPk) return;

    // rescale for zoom
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const dPks = this.setDataPecker();
    const mpp = this.tags.peckerPath.selectAll('path').data(dPks);
    mpp.exit().attr('class', 'exit').remove();
    const linePath = [{
      x: -0.5,
      y: 10
    }, {
      x: -0.5,
      y: -20
    }, {
      x: 0.5,
      y: -20
    }, {
      x: 0.5,
      y: 10
    }];
    const lineSymbol = d3.line().x(d => d.x).y(d => d.y)(linePath);
    mpp.enter().append('path').attr('d', lineSymbol).attr('class', 'enter-peak').attr('fill', '#228B22').attr('stroke', 'pink').attr('stroke-width', 3).attr('stroke-opacity', 0.0).merge(mpp).attr('id', d => `mpp${Math.round(1000 * d.x)}`).attr('transform', d => `translate(${xt(d.x)}, ${yt(this.transformYValue(d.y))})`).on('mouseover', (event, d) => {
      d3.select(`#mpp${Math.round(1000 * d.x)}`).attr('stroke-opacity', '1.0');
      d3.select(`#bpt${Math.round(1000 * d.x)}`).style('fill', 'blue');
      const tipParams = {
        d,
        layout: this.layout
      };
      this.tip.show(tipParams, event.target);
    }).on('mouseout', (event, d) => {
      d3.select(`#mpp${Math.round(1000 * d.x)}`).attr('stroke-opacity', '0.0');
      d3.select(`#bpt${Math.round(1000 * d.x)}`).style('fill', '#228B22');
      const tipParams = {
        d,
        layout: this.layout
      };
      this.tip.hide(tipParams, event.target);
    }).on('click', (event, d) => this.onClickPecker(event, d));
  }
  drawInteg(integationSt) {
    const {
      sameXY,
      sameLySt,
      sameItSt,
      sameData
    } = this.shouldUpdate;
    if (sameXY && sameLySt && sameItSt && sameData) return;
    const {
      integrations
    } = integationSt;
    const selectedIntegration = integrations[this.jcampIdx];
    if (selectedIntegration === false || selectedIntegration === undefined) {
      const itgs = [];
      const igbp = this.tags.igbPath.selectAll('path').data(itgs);
      igbp.exit().attr('class', 'exit').remove();
      const igcp = this.tags.igcPath.selectAll('path').data(itgs);
      igcp.exit().attr('class', 'exit').remove();
      const igtp = this.tags.igtPath.selectAll('text').data(itgs);
      igtp.exit().attr('class', 'exit').remove();
      return;
    }
    const {
      stack,
      refArea,
      refFactor,
      shift
    } = selectedIntegration;
    const isDisable = _cfg.default.btnCmdIntg(this.layout);
    const ignoreRef = _format.default.isHplcUvVisLayout(this.layout);
    const itgs = isDisable ? [] : stack;
    const igbp = this.tags.igbPath.selectAll('path').data(itgs);
    igbp.exit().attr('class', 'exit').remove();
    const igcp = this.tags.igcPath.selectAll('path').data(itgs);
    igcp.exit().attr('class', 'exit').remove();
    const igtp = this.tags.igtPath.selectAll('text').data(itgs);
    igtp.exit().attr('class', 'exit').remove();
    if (itgs.length === 0 || isDisable) {
      // remove drawn area under curve
      const auc = this.tags.aucPath.selectAll('path').data(stack);
      auc.exit().attr('class', 'exit').remove();
      auc.merge(auc);
      return;
    }
    if (ignoreRef) {
      this.drawAUC(stack);
    } else {
      // rescale for zoom
      const {
        xt
      } = (0, _compass.TfRescale)(this);
      const dh = 50;
      const integBar = data => d3.line()([[xt(data.xL - shift), dh], [xt(data.xL - shift), dh - 10], [xt(data.xL - shift), dh - 5], [xt(data.xU - shift), dh - 5], [xt(data.xU - shift), dh - 10], [xt(data.xU - shift), dh]]);
      igbp.enter().append('path').attr('class', 'igbp').attr('fill', 'none').attr('stroke', '#228B22').attr('stroke-width', 2).merge(igbp).attr('id', d => `igbp${(0, _focus.itgIdTag)(d)}`).attr('d', d => integBar(d)).on('mouseover', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', 'blue');
      }).on('mouseout', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', '#228B22');
      }).on('click', (event, d) => this.onClickTarget(event, d));
      const integCurve = border => {
        const {
          xL,
          xU
        } = border;
        const [nXL, nXU] = [xL - shift, xU - shift];
        const ps = this.data.filter(d => d.x > nXL && d.x < nXU);
        const kMax = this.data[this.data.length - 1].k;
        if (!ps[0]) return null;
        const kRef = ps[0].k;
        if (!this.reverseXAxis(this.layout)) {
          return d3.line().x(d => xt(d.x)).y(d => 100 - (kRef - d.k) * 400 / kMax)(ps);
        }
        return d3.line().x(d => xt(d.x)).y(d => 300 - (d.k - kRef) * 400 / kMax)(ps);
      };
      igcp.enter().append('path').attr('class', 'igcp').attr('fill', 'none').attr('stroke', '#228B22').attr('stroke-width', 2).merge(igcp).attr('id', d => `igbc${(0, _focus.itgIdTag)(d)}`).attr('d', d => integCurve(d)).on('mouseover', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', 'blue');
      }).on('mouseout', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', '#228B22');
      }).on('click', (event, d) => this.onClickTarget(event, d));
      igtp.enter().append('text').attr('class', 'igtp').attr('font-family', 'Helvetica').style('font-size', '12px').attr('fill', '#228B22').style('text-anchor', 'middle').merge(igtp).attr('id', d => `igtp${(0, _focus.itgIdTag)(d)}`).text(d => (0, _integration.calcArea)(d, refArea, refFactor, ignoreRef)).attr('transform', d => `translate(${xt((d.xL + d.xU) / 2 - shift)}, ${dh - 12})`).on('mouseover', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', 'blue');
      }).on('mouseout', (event, d) => {
        d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
        d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', '#228B22');
      }).on('click', (event, d) => this.onClickTarget(event, d));
    }
  }
  drawMtply(mtplySt) {
    const {
      sameXY,
      sameLySt,
      sameMySt
    } = this.shouldUpdate;
    if (sameXY && sameLySt && sameMySt) return;
    const {
      multiplicities
    } = mtplySt;
    const selectedMulti = multiplicities[this.jcampIdx];
    if (selectedMulti === false || selectedMulti === undefined) {
      const mpys = [];
      const mpyb = this.tags.mpybPath.selectAll('path').data(mpys);
      mpyb.exit().attr('class', 'exit').remove();
      const mpyt1 = this.tags.mpyt1Path.selectAll('text').data(mpys);
      mpyt1.exit().attr('class', 'exit').remove();
      const mpyt2 = this.tags.mpyt2Path.selectAll('text').data(mpys);
      mpyt2.exit().attr('class', 'exit').remove();
      let mPeaks = mpys.map(m => {
        const {
          peaks,
          xExtent
        } = m;
        return peaks.map(p => Object.assign({}, p, {
          xExtent
        }));
      });
      mPeaks = [].concat(...mPeaks);
      const mpyp = this.tags.mpypPath.selectAll('path').data(mPeaks);
      mpyp.exit().attr('class', 'exit').remove();
      return;
    }
    const {
      stack,
      smExtext,
      shift
    } = selectedMulti;
    const mpys = stack;
    const isDisable = _cfg.default.btnCmdMpy(this.layout);
    if (mpys === 0 || isDisable) return;
    // rescale for zoom
    const {
      xt
    } = (0, _compass.TfRescale)(this);
    const mpyb = this.tags.mpybPath.selectAll('path').data(mpys);
    mpyb.exit().attr('class', 'exit').remove();
    const mpyt1 = this.tags.mpyt1Path.selectAll('text').data(mpys);
    mpyt1.exit().attr('class', 'exit').remove();
    const mpyt2 = this.tags.mpyt2Path.selectAll('text').data(mpys);
    mpyt2.exit().attr('class', 'exit').remove();
    let mPeaks = mpys.map(m => {
      const {
        peaks,
        xExtent
      } = m;
      return peaks.map(p => Object.assign({}, p, {
        xExtent
      }));
    });
    mPeaks = [].concat(...mPeaks);
    const mpyp = this.tags.mpypPath.selectAll('path').data(mPeaks);
    mpyp.exit().attr('class', 'exit').remove();
    const height = this.h;
    const dh = Math.abs(0.06 * height);
    const mpyBar = data => d3.line()([[xt(data.xExtent.xL - shift), height - dh], [xt(data.xExtent.xL - shift), height - dh - 10], [xt(data.xExtent.xL - shift), height - dh - 5], [xt(data.xExtent.xU - shift), height - dh - 5], [xt(data.xExtent.xU - shift), height - dh - 10], [xt(data.xExtent.xU - shift), height - dh]]);
    const mpyColor = d => {
      const {
        xL,
        xU
      } = d.xExtent;
      return smExtext.xL === xL && smExtext.xU === xU ? 'purple' : '#DA70D6';
    };
    mpyb.enter().append('path').attr('class', 'mpyb').attr('fill', 'none').attr('stroke-width', 2).merge(mpyb).attr('stroke', d => mpyColor(d)).attr('id', d => `mpyb${(0, _focus.mpyIdTag)(d)}`).attr('d', d => mpyBar(d)).on('mouseover', (event, d) => {
      d3.selectAll(`#mpyb${(0, _focus.mpyIdTag)(d)}`).attr('stroke', 'blue');
      d3.selectAll(`#mpyt1${(0, _focus.mpyIdTag)(d)}`).style('fill', 'blue');
      d3.selectAll(`#mpyt2${(0, _focus.mpyIdTag)(d)}`).style('fill', 'blue');
      d3.selectAll(`#mpyp${(0, _focus.mpyIdTag)(d)}`).attr('stroke', 'blue');
    }).on('mouseout', (event, d) => {
      const dColor = mpyColor(d);
      d3.selectAll(`#mpyb${(0, _focus.mpyIdTag)(d)}`).attr('stroke', dColor);
      d3.selectAll(`#mpyt1${(0, _focus.mpyIdTag)(d)}`).style('fill', dColor);
      d3.selectAll(`#mpyt2${(0, _focus.mpyIdTag)(d)}`).style('fill', dColor);
      d3.selectAll(`#mpyp${(0, _focus.mpyIdTag)(d)}`).attr('stroke', dColor);
    }).on('click', (event, d) => this.onClickTarget(event, d));
    mpyt1.enter().append('text').attr('class', 'mpyt1').attr('font-family', 'Helvetica').style('font-size', '12px').style('text-anchor', 'middle').merge(mpyt1).attr('fill', d => mpyColor(d)).attr('id', d => `mpyt1${(0, _focus.mpyIdTag)(d)}`).text(d => `${(0, _multiplicity_calc.calcMpyCenter)(d.peaks, shift, d.mpyType).toFixed(3)}`).attr('transform', d => `translate(${xt((d.xExtent.xL + d.xExtent.xU) / 2 - shift)}, ${height - dh + 12})`).on('mouseover', (event, d) => {
      d3.selectAll(`#mpyb${(0, _focus.mpyIdTag)(d)}`).attr('stroke', 'blue');
      d3.selectAll(`#mpyt1${(0, _focus.mpyIdTag)(d)}`).style('fill', 'blue');
      d3.selectAll(`#mpyt2${(0, _focus.mpyIdTag)(d)}`).style('fill', 'blue');
      d3.selectAll(`#mpyp${(0, _focus.mpyIdTag)(d)}`).attr('stroke', 'blue');
    }).on('mouseout', (event, d) => {
      const dColor = mpyColor(d);
      d3.selectAll(`#mpyb${(0, _focus.mpyIdTag)(d)}`).attr('stroke', dColor);
      d3.selectAll(`#mpyt1${(0, _focus.mpyIdTag)(d)}`).style('fill', dColor);
      d3.selectAll(`#mpyt2${(0, _focus.mpyIdTag)(d)}`).style('fill', dColor);
      d3.selectAll(`#mpyp${(0, _focus.mpyIdTag)(d)}`).attr('stroke', dColor);
    }).on('click', (event, d) => this.onClickTarget(event, d));
    mpyt2.enter().append('text').attr('class', 'mpyt2').attr('font-family', 'Helvetica').style('font-size', '12px').style('text-anchor', 'middle').merge(mpyt2).attr('fill', d => mpyColor(d)).attr('id', d => `mpyt2${(0, _focus.mpyIdTag)(d)}`).text(d => `(${d.mpyType})`).attr('transform', d => `translate(${xt((d.xExtent.xL + d.xExtent.xU) / 2 - shift)}, ${height - dh + 24})`).on('mouseover', (event, d) => {
      d3.selectAll(`#mpyb${(0, _focus.mpyIdTag)(d)}`).attr('stroke', 'blue');
      d3.selectAll(`#mpyt1${(0, _focus.mpyIdTag)(d)}`).style('fill', 'blue');
      d3.selectAll(`#mpyt2${(0, _focus.mpyIdTag)(d)}`).style('fill', 'blue');
      d3.selectAll(`#mpyp${(0, _focus.mpyIdTag)(d)}`).attr('stroke', 'blue');
    }).on('mouseout', (event, d) => {
      const dColor = mpyColor(d);
      d3.selectAll(`#mpyb${(0, _focus.mpyIdTag)(d)}`).attr('stroke', dColor);
      d3.selectAll(`#mpyt1${(0, _focus.mpyIdTag)(d)}`).style('fill', dColor);
      d3.selectAll(`#mpyt2${(0, _focus.mpyIdTag)(d)}`).style('fill', dColor);
      d3.selectAll(`#mpyp${(0, _focus.mpyIdTag)(d)}`).attr('stroke', dColor);
    }).on('click', (event, d) => this.onClickTarget(event, d));
    const mpypH = height - dh;
    const mpypPath = pk => [{
      x: xt(pk.x - shift) - 0.5,
      y: mpypH - 5
    }, {
      x: xt(pk.x - shift) - 0.5,
      y: mpypH - 20
    }, {
      x: xt(pk.x - shift) + 0.5,
      y: mpypH - 20
    }, {
      x: xt(pk.x - shift) + 0.5,
      y: mpypH - 5
    }];
    // const faktor = layoutSt === LIST_LAYOUT.IR ? -1 : 1;
    const lineSymbol = d3.line().x(d => d.x).y(d => d.y);
    mpyp.enter().append('path').attr('class', 'mpyp').attr('fill', 'none').merge(mpyp).attr('stroke', d => mpyColor(d)).attr('d', d => lineSymbol(mpypPath(d))).attr('id', d => `mpyp${(0, _focus.mpyIdTag)(d)}`).on('mouseover', (event, d) => {
      d3.selectAll(`#mpyb${(0, _focus.mpyIdTag)(d)}`).attr('stroke', 'blue');
      d3.selectAll(`#mpyt1${(0, _focus.mpyIdTag)(d)}`).style('fill', 'blue');
      d3.selectAll(`#mpyt2${(0, _focus.mpyIdTag)(d)}`).style('fill', 'blue');
      d3.selectAll(`#mpyp${(0, _focus.mpyIdTag)(d)}`).attr('stroke', 'blue');
    }).on('mouseout', (event, d) => {
      const dColor = mpyColor(d);
      d3.selectAll(`#mpyb${(0, _focus.mpyIdTag)(d)}`).attr('stroke', dColor);
      d3.selectAll(`#mpyt1${(0, _focus.mpyIdTag)(d)}`).style('fill', dColor);
      d3.selectAll(`#mpyt2${(0, _focus.mpyIdTag)(d)}`).style('fill', dColor);
      d3.selectAll(`#mpyp${(0, _focus.mpyIdTag)(d)}`).attr('stroke', dColor);
    }).on('click', (event, d) => this.onClickTarget(event, d));
  }
  drawRef() {
    // rescale for zoom
    const {
      xt,
      yt
    } = (0, _compass.TfRescale)(this);
    const ccp = this.ref.selectAll('path').data(this.tSfPeaks);
    ccp.exit().attr('class', 'exit').remove();
    const linePath = [{
      x: -0.5,
      y: 10
    }, {
      x: -4,
      y: -20
    }, {
      x: 4,
      y: -20
    }, {
      x: 0.5,
      y: 10
    }];
    const faktor = _format.default.isIrLayout(this.layout) ? -1 : 1;
    const lineSymbol = d3.line().x(d => d.x).y(d => faktor * d.y)(linePath);
    ccp.enter().append('path').attr('d', lineSymbol).attr('class', 'enter-ref').attr('fill', 'green').attr('fill-opacity', 0.8).merge(ccp).attr('transform', d => `translate(${xt(d.x)}, ${yt(this.transformYValue(d.y))})`);
  }
  reverseXAxis(layoutSt) {
    return [_list_layout.LIST_LAYOUT.UVVIS, _list_layout.LIST_LAYOUT.HPLC_UVVIS, _list_layout.LIST_LAYOUT.TGA, _list_layout.LIST_LAYOUT.DSC, _list_layout.LIST_LAYOUT.XRD, _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY, _list_layout.LIST_LAYOUT.CDS, _list_layout.LIST_LAYOUT.SEC, _list_layout.LIST_LAYOUT.GC, _list_layout.LIST_LAYOUT.AIF].indexOf(layoutSt) < 0;
  }
  create({
    curveSt,
    filterSeed,
    filterPeak,
    tTrEndPts,
    tSfPeaks,
    editPeakSt,
    layoutSt,
    sweepExtentSt,
    isUiNoBrushSt,
    cyclicvoltaSt,
    integationSt,
    mtplySt
  }) {
    this.svg = d3.select(this.rootKlass).select('.d3Svg');
    (0, _mount.MountMainFrame)(this, 'focus');
    (0, _mount.MountClip)(this);
    const {
      curveIdx,
      isShowAllCurve
    } = curveSt;
    const jcampIdx = curveIdx;
    this.isShowAllCurves = isShowAllCurve;
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = (0, _init.InitScale)(this, this.reverseXAxis(layoutSt));
    this.setTip();
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks, layoutSt, cyclicvoltaSt, jcampIdx);
    (0, _compass.MountCompass)(this);
    this.axis = (0, _mount.MountAxis)(this);
    this.path = (0, _mount.MountPath)(this, this.pathColor);
    [this.thresLineUp, this.thresLineDw] = (0, _mount.MountThresLine)(this, 'green');
    this.grid = (0, _mount.MountGrid)(this);
    this.tags = (0, _mount.MountTags)(this);
    this.ref = (0, _mount.MountRef)(this);
    (0, _mount.MountAxisLabelX)(this);
    (0, _mount.MountAxisLabelY)(this);
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.drawLine();
      this.drawThres();
      this.drawGrid();
      this.drawOtherLines(layoutSt);
      this.drawPeaks(editPeakSt);
      this.drawRef();
      this.drawPeckers();
      this.drawInteg(integationSt);
      this.drawMtply(mtplySt);
    }
    (0, _brush.default)(this, false, isUiNoBrushSt);
    this.resetShouldUpdate(editPeakSt);
  }
  update({
    entities,
    curveSt,
    filterSeed,
    filterPeak,
    tTrEndPts,
    tSfPeaks,
    editPeakSt,
    layoutSt,
    sweepExtentSt,
    isUiNoBrushSt,
    cyclicvoltaSt,
    integationSt,
    mtplySt
  }) {
    this.root = d3.select(this.rootKlass).selectAll('.focus-main');
    this.scales = (0, _init.InitScale)(this, this.reverseXAxis(layoutSt));
    const {
      curveIdx,
      isShowAllCurve
    } = curveSt;
    const jcampIdx = curveIdx;
    this.isShowAllCurves = isShowAllCurve;
    this.entities = entities;
    this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks, layoutSt, cyclicvoltaSt, jcampIdx);
    if (this.data && this.data.length > 0) {
      this.setConfig(sweepExtentSt);
      this.getShouldUpdate(editPeakSt);
      this.drawLine();
      this.drawThres();
      this.drawGrid();
      this.drawOtherLines(layoutSt);
      this.drawPeaks(editPeakSt);
      this.drawRef();
      this.drawPeckers();
      this.drawInteg(integationSt);
      this.drawMtply(mtplySt);
    }
    (0, _brush.default)(this, false, isUiNoBrushSt);
    this.resetShouldUpdate(editPeakSt);
  }
}
var _default = exports.default = MultiFocus;