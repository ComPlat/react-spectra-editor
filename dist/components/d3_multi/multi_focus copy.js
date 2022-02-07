'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _init = require('../../helpers/init');

var _mount = require('../../helpers/mount');

var _converter = require('../../helpers/converter');

var _brush = require('../../helpers/brush');

var _brush2 = _interopRequireDefault(_brush);

var _compass = require('../../helpers/compass');

var _list_layout = require('../../constants/list_layout');

var _format = require('../../helpers/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MultiFocus = function () {
  function MultiFocus(props) {
    _classCallCheck(this, MultiFocus);

    var W = props.W,
        H = props.H,
        clickUiTargetAct = props.clickUiTargetAct,
        selectUiSweepAct = props.selectUiSweepAct,
        scrollUiWheelAct = props.scrollUiWheelAct,
        id = props.id;


    this.jcampIdx = id;
    this.rootKlass = '.d3Line' + id;
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
    this.grid = null;
    this.tags = null;
    this.data = [];
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

  _createClass(MultiFocus, [{
    key: 'getShouldUpdate',
    value: function getShouldUpdate(nextEpSt) {
      var _shouldUpdate = this.shouldUpdate,
          prevXt = _shouldUpdate.prevXt,
          prevYt = _shouldUpdate.prevYt,
          prevEpSt = _shouldUpdate.prevEpSt,
          prevLySt = _shouldUpdate.prevLySt,
          prevTePt = _shouldUpdate.prevTePt,
          prevDtPk = _shouldUpdate.prevDtPk,
          prevSfPk = _shouldUpdate.prevSfPk,
          prevData = _shouldUpdate.prevData;

      var _TfRescale = (0, _compass.TfRescale)(this),
          xt = _TfRescale.xt,
          yt = _TfRescale.yt;

      var sameXY = xt(1.1) === prevXt && prevYt === yt(1.1);
      var sameEpSt = prevEpSt === nextEpSt;
      var sameLySt = prevLySt === this.layout;
      var sameTePt = prevTePt === this.tTrEndPts.length;
      var sameDtPk = prevDtPk === this.dataPks.length;
      var sameSfPk = prevSfPk === this.tSfPeaks.length;
      var sameData = prevData === this.data.length;
      var sameRef = prevEpSt.prevOffset === nextEpSt.prevOffset;
      this.shouldUpdate = Object.assign({}, this.shouldUpdate, {
        sameXY: sameXY, sameEpSt: sameEpSt, sameLySt: sameLySt, // eslint-disable-line
        sameTePt: sameTePt, sameDtPk: sameDtPk, sameSfPk: sameSfPk, sameData: sameData, sameRef: sameRef // eslint-disable-line
      });
    }
  }, {
    key: 'resetShouldUpdate',
    value: function resetShouldUpdate(prevEpSt) {
      var _TfRescale2 = (0, _compass.TfRescale)(this),
          xt = _TfRescale2.xt,
          yt = _TfRescale2.yt;

      var prevXt = xt(1.1);
      var prevYt = yt(1.1);
      var prevTePt = this.tTrEndPts.length;
      var prevDtPk = this.dataPks.length;
      var prevSfPk = this.tSfPeaks.length;
      var prevData = this.data.length;
      var prevLySt = this.layout;
      this.shouldUpdate = Object.assign({}, this.shouldUpdate, {
        prevXt: prevXt, prevYt: prevYt, prevEpSt: prevEpSt, prevLySt: prevLySt, // eslint-disable-line
        prevTePt: prevTePt, prevDtPk: prevDtPk, prevSfPk: prevSfPk, prevData: prevData // eslint-disable-line
      });
    }
  }, {
    key: 'setTip',
    value: function setTip() {
      this.tip = (0, _init.InitTip)();
      this.root.call(this.tip);
    }
  }, {
    key: 'setDataParams',
    value: function setDataParams(data, peaks, tTrEndPts, tSfPeaks, layout, cyclicvoltaSt) {
      this.data = [].concat(_toConsumableArray(data));
      this.dataPks = [].concat(_toConsumableArray(peaks));
      this.tTrEndPts = tTrEndPts;
      this.tSfPeaks = tSfPeaks;
      this.layout = layout;
      this.cyclicvoltaSt = cyclicvoltaSt;
    }
  }, {
    key: 'updatePathCall',
    value: function updatePathCall(xt, yt) {
      this.pathCall = d3.line().x(function (d) {
        return xt(d.x);
      }).y(function (d) {
        return yt(d.y);
      });
    }
  }, {
    key: 'setConfig',
    value: function setConfig(sweepExtentSt) {
      // Domain Calculate
      var _ref = sweepExtentSt || { xExtent: false, yExtent: false },
          xExtent = _ref.xExtent,
          yExtent = _ref.yExtent;

      if (!xExtent || !yExtent) {
        var xes = d3.extent(this.data, function (d) {
          return d.x;
        }).sort(function (a, b) {
          return a - b;
        });
        xExtent = { xL: xes[0], xU: xes[1] };
        var btm = d3.min(this.data, function (d) {
          return d.y;
        });
        var top = d3.max(this.data, function (d) {
          return d.y;
        });
        var height = top - btm;
        yExtent = {
          yL: btm - this.factor * height,
          yU: top + this.factor * height
        };
      }

      this.scales.x.domain([xExtent.xL, xExtent.xU]);
      this.scales.y.domain([yExtent.yL, yExtent.yU]);

      // rescale for zoom

      var _TfRescale3 = (0, _compass.TfRescale)(this),
          xt = _TfRescale3.xt,
          yt = _TfRescale3.yt;

      // Axis Call


      this.axisCall.x.scale(xt);
      this.axisCall.y.scale(yt);

      this.currentExtent = { xExtent: xExtent, yExtent: yExtent };
    }
  }, {
    key: 'drawLine',
    value: function drawLine() {
      var _shouldUpdate2 = this.shouldUpdate,
          sameXY = _shouldUpdate2.sameXY,
          sameRef = _shouldUpdate2.sameRef;

      if (sameXY && sameRef) return;

      var _TfRescale4 = (0, _compass.TfRescale)(this),
          xt = _TfRescale4.xt,
          yt = _TfRescale4.yt;

      this.updatePathCall(xt, yt);
      this.path.attr('d', this.pathCall(this.data));
    }
  }, {
    key: 'drawGrid',
    value: function drawGrid() {
      var sameXY = this.shouldUpdate.sameXY;

      if (sameXY) return;

      this.grid.x.call(this.axisCall.x.tickSize(-this.h, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
      this.grid.y.call(this.axisCall.y.tickSize(-this.w, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
    }
  }, {
    key: 'onClickTarget',
    value: function onClickTarget(data) {
      d3.event.stopPropagation();
      d3.event.preventDefault();
      var onPeak = true;
      var spectraList = this.cyclicvoltaSt.spectraList;

      var spectra = spectraList[this.jcampIdx];
      var voltammetryPeakIdx = spectra.selectedIdx;
      this.clickUiTargetAct(data, onPeak, voltammetryPeakIdx, this.jcampIdx);
    }
  }, {
    key: 'onClickPecker',
    value: function onClickPecker(data) {
      d3.event.stopPropagation();
      d3.event.preventDefault();
      var onPecker = true;
      var spectraList = this.cyclicvoltaSt.spectraList;

      var spectra = spectraList[this.jcampIdx];
      var voltammetryPeakIdx = spectra.selectedIdx;
      this.clickUiTargetAct(data, false, voltammetryPeakIdx, this.jcampIdx, onPecker);
    }
  }, {
    key: 'mergedPeaks',
    value: function mergedPeaks(editPeakSt) {
      if (!editPeakSt) return this.dataPks;
      var spectraList = this.cyclicvoltaSt.spectraList;

      var spectra = spectraList[this.jcampIdx];
      if (spectra) {
        this.dataPks = (0, _converter.PksEdit)(this.dataPks, editPeakSt, spectra.list);
      } else {
        this.dataPks = (0, _converter.PksEdit)(this.dataPks, editPeakSt, []);
      }

      return this.dataPks;
    }
  }, {
    key: 'setDataPecker',
    value: function setDataPecker() {
      var spectraList = this.cyclicvoltaSt.spectraList;

      var spectra = spectraList[this.jcampIdx];
      if (spectra) {
        this.dataPeckers = (0, _converter.PeckersEdit)(spectra.list);
      }
      return this.dataPeckers;
    }
  }, {
    key: 'drawPeaks',
    value: function drawPeaks(editPeakSt) {
      var _this = this;

      var _shouldUpdate3 = this.shouldUpdate,
          sameXY = _shouldUpdate3.sameXY,
          sameEpSt = _shouldUpdate3.sameEpSt,
          sameDtPk = _shouldUpdate3.sameDtPk,
          sameSfPk = _shouldUpdate3.sameSfPk;


      if (!_format2.default.isCyclicVoltaLayout(this.layout) && sameXY && sameEpSt && sameDtPk && sameSfPk) return;

      // rescale for zoom

      var _TfRescale5 = (0, _compass.TfRescale)(this),
          xt = _TfRescale5.xt,
          yt = _TfRescale5.yt;

      var dPks = this.mergedPeaks(editPeakSt);

      var mpp = this.tags.pPath.selectAll('path').data(dPks);
      mpp.exit().attr('class', 'exit').remove();

      var linePath = [{ x: -0.5, y: 10 }, { x: -0.5, y: -20 }, { x: 0.5, y: -20 }, { x: 0.5, y: 10 }];
      var lineSymbol = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      })(linePath);

      mpp.enter().append('path').attr('d', lineSymbol).attr('class', 'enter-peak').attr('fill', 'red').attr('stroke', 'pink').attr('stroke-width', 3).attr('stroke-opacity', 0.0).merge(mpp).attr('id', function (d) {
        return 'mpp' + Math.round(1000 * d.x);
      }).attr('transform', function (d) {
        return 'translate(' + xt(d.x) + ', ' + yt(d.y) + ')';
      }).on('mouseover', function (d, i, n) {
        d3.select('#mpp' + Math.round(1000 * d.x)).attr('stroke-opacity', '1.0');
        d3.select('#bpt' + Math.round(1000 * d.x)).style('fill', 'blue');
        var tipParams = { d: d, layout: _this.layout };
        _this.tip.show(tipParams, n[i]);
      }).on('mouseout', function (d, i, n) {
        d3.select('#mpp' + Math.round(1000 * d.x)).attr('stroke-opacity', '0.0');
        d3.select('#bpt' + Math.round(1000 * d.x)).style('fill', 'red');
        var tipParams = { d: d, layout: _this.layout };
        _this.tip.hide(tipParams, n[i]);
      }).on('click', function (d) {
        return _this.onClickTarget(d);
      });

      var ignoreRef = _format2.default.isHplcUvVisLayout(this.layout);
      if (ignoreRef) {
        var bpTxt = this.tags.bpTxt.selectAll('text').data(dPks);
        bpTxt.exit().attr('class', 'exit').remove();

        bpTxt.enter().append('text').attr('class', 'peak-text').attr('font-family', 'Helvetica').style('font-size', '12px').attr('fill', '#228B22').style('text-anchor', 'middle').merge(bpTxt).attr('id', function (d) {
          return 'mpp' + Math.round(1000 * d.x);
        }).text(function (d) {
          return d.x.toFixed(2);
        }).attr('transform', function (d) {
          return 'translate(' + xt(d.x) + ', ' + (yt(d.y) - 25) + ')';
        }).on('click', function (d) {
          return _this.onClickTarget(d);
        });
      }
    }
  }, {
    key: 'drawPeckers',
    value: function drawPeckers() {
      var _this2 = this;

      var _shouldUpdate4 = this.shouldUpdate,
          sameXY = _shouldUpdate4.sameXY,
          sameEpSt = _shouldUpdate4.sameEpSt,
          sameDtPk = _shouldUpdate4.sameDtPk,
          sameSfPk = _shouldUpdate4.sameSfPk;


      if (!_format2.default.isCyclicVoltaLayout(this.layout) && sameXY && sameEpSt && sameDtPk && sameSfPk) return;

      // rescale for zoom

      var _TfRescale6 = (0, _compass.TfRescale)(this),
          xt = _TfRescale6.xt,
          yt = _TfRescale6.yt;

      var dPks = this.setDataPecker();

      var mpp = this.tags.peckerPath.selectAll('path').data(dPks);
      mpp.exit().attr('class', 'exit').remove();

      var linePath = [{ x: -0.5, y: 10 }, { x: -0.5, y: -20 }, { x: 0.5, y: -20 }, { x: 0.5, y: 10 }];
      var lineSymbol = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      })(linePath);

      mpp.enter().append('path').attr('d', lineSymbol).attr('class', 'enter-peak').attr('fill', '#228B22').attr('stroke', 'pink').attr('stroke-width', 3).attr('stroke-opacity', 0.0).merge(mpp).attr('id', function (d) {
        return 'mpp' + Math.round(1000 * d.x);
      }).attr('transform', function (d) {
        return 'translate(' + xt(d.x) + ', ' + yt(d.y) + ')';
      }).on('mouseover', function (d, i, n) {
        d3.select('#mpp' + Math.round(1000 * d.x)).attr('stroke-opacity', '1.0');
        d3.select('#bpt' + Math.round(1000 * d.x)).style('fill', 'blue');
        var tipParams = { d: d, layout: _this2.layout };
        _this2.tip.show(tipParams, n[i]);
      }).on('mouseout', function (d, i, n) {
        d3.select('#mpp' + Math.round(1000 * d.x)).attr('stroke-opacity', '0.0');
        d3.select('#bpt' + Math.round(1000 * d.x)).style('fill', '#228B22');
        var tipParams = { d: d, layout: _this2.layout };
        _this2.tip.hide(tipParams, n[i]);
      }).on('click', function (d) {
        return _this2.onClickPecker(d);
      });
    }
  }, {
    key: 'create',
    value: function create(_ref2) {
      var filterSeed = _ref2.filterSeed,
          filterPeak = _ref2.filterPeak,
          tTrEndPts = _ref2.tTrEndPts,
          tSfPeaks = _ref2.tSfPeaks,
          editPeakSt = _ref2.editPeakSt,
          layoutSt = _ref2.layoutSt,
          sweepExtentSt = _ref2.sweepExtentSt,
          isUiNoBrushSt = _ref2.isUiNoBrushSt,
          cyclicvoltaSt = _ref2.cyclicvoltaSt;

      this.svg = d3.select(this.rootKlass).select('.d3Svg');
      (0, _mount.MountMainFrame)(this, 'focus');
      (0, _mount.MountClip)(this);

      this.root = d3.select(this.rootKlass).selectAll('.focus-main');
      this.scales = (0, _init.InitScale)(this, false);
      this.setTip();
      this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks, layoutSt, cyclicvoltaSt);
      (0, _compass.MountCompass)(this);

      this.axis = (0, _mount.MountAxis)(this);
      this.path = (0, _mount.MountPath)(this, 'steelblue');
      this.grid = (0, _mount.MountGrid)(this);
      this.tags = (0, _mount.MountTags)(this);
      (0, _mount.MountAxisLabelX)(this);
      (0, _mount.MountAxisLabelY)(this);

      if (this.data && this.data.length > 0) {
        this.setConfig(sweepExtentSt);
        this.drawLine();
        this.drawGrid();
        this.drawPeaks(editPeakSt);
        this.drawPeckers();
      }
      (0, _brush2.default)(this, false, isUiNoBrushSt);
      this.resetShouldUpdate(editPeakSt);
    }
  }, {
    key: 'update',
    value: function update(_ref3) {
      var filterSeed = _ref3.filterSeed,
          filterPeak = _ref3.filterPeak,
          tTrEndPts = _ref3.tTrEndPts,
          tSfPeaks = _ref3.tSfPeaks,
          editPeakSt = _ref3.editPeakSt,
          layoutSt = _ref3.layoutSt,
          sweepExtentSt = _ref3.sweepExtentSt,
          isUiNoBrushSt = _ref3.isUiNoBrushSt,
          cyclicvoltaSt = _ref3.cyclicvoltaSt;

      this.root = d3.select(this.rootKlass).selectAll('.focus-main');
      this.scales = (0, _init.InitScale)(this, false);
      this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks, layoutSt, cyclicvoltaSt);

      if (this.data && this.data.length > 0) {
        this.setConfig(sweepExtentSt);
        this.getShouldUpdate(editPeakSt);
        this.drawLine();
        this.drawGrid();
        this.drawPeaks(editPeakSt);
        this.drawPeckers();
      }
      (0, _brush2.default)(this, false, isUiNoBrushSt);
      this.resetShouldUpdate(editPeakSt);
    }
  }]);

  return MultiFocus;
}();

exports.default = MultiFocus;