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

var _chem = require('../../helpers/chem');

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _focus = require('../../helpers/focus');

var _integration = require('../../helpers/integration');

var _multiplicity_calc = require('../../helpers/multiplicity_calc');

var _calc = require('../../helpers/calc');

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
        entities = props.entities;


    this.entities = entities;
    this.jcampIdx = 0;
    this.rootKlass = ".d3Line";
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
      this.shouldUpdate = Object.assign({}, this.shouldUpdate, {
        sameXY: sameXY, sameEpSt: sameEpSt, sameLySt: sameLySt, // eslint-disable-line
        sameTePt: sameTePt, sameDtPk: sameDtPk, sameSfPk: sameSfPk, sameData: sameData // eslint-disable-line
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
    value: function setDataParams(peaks, tTrEndPts, tSfPeaks, layout, cyclicvoltaSt) {
      var _this = this;

      var jcampIdx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

      this.jcampIdx = jcampIdx;
      this.data = [];
      this.otherLineData = [];
      this.entities.forEach(function (entry, idx) {
        var topic = entry.topic,
            feature = entry.feature,
            color = entry.color;

        var currData = (0, _chem.convertTopic)(topic, layout, feature, 0);
        if (idx === _this.jcampIdx) {
          _this.data = [].concat(_toConsumableArray(currData));
          _this.pathColor = color;
        } else {
          _this.otherLineData.push({ data: currData, color: color });
        }
      });

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
        var allData = [].concat(_toConsumableArray(this.data));
        if (this.otherLineData) {
          this.otherLineData.forEach(function (lineData) {
            allData = [].concat(_toConsumableArray(allData), _toConsumableArray(lineData.data));
          });
        }

        var xes = d3.extent(allData, function (d) {
          return d.x;
        }).sort(function (a, b) {
          return a - b;
        });
        xExtent = { xL: xes[0], xU: xes[1] };
        var btm = d3.min(allData, function (d) {
          return d.y;
        });
        var top = d3.max(allData, function (d) {
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
      var _TfRescale4 = (0, _compass.TfRescale)(this),
          xt = _TfRescale4.xt,
          yt = _TfRescale4.yt;

      this.updatePathCall(xt, yt);
      this.path.attr('d', this.pathCall(this.data));
      this.path.style('stroke', this.pathColor);
    }
  }, {
    key: 'drawOtherLines',
    value: function drawOtherLines(layout) {
      var _this2 = this;

      d3.selectAll('.line-clip-compare').remove();
      if (!this.otherLineData) return null;
      this.otherLineData.forEach(function (entry, idx) {
        var data = entry.data,
            color = entry.color;

        var pathColor = color ? color : _format2.default.mutiEntitiesColors(idx);
        var path = (0, _mount.MountComparePath)(_this2, pathColor, idx, 0.4);
        path.attr('d', _this2.pathCall(data));
      });
      return null;
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
      if (this.layout === _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
        var spectraList = this.cyclicvoltaSt.spectraList;

        var spectra = spectraList[this.jcampIdx];
        var voltammetryPeakIdx = spectra.selectedIdx;
        this.clickUiTargetAct(data, onPeak, voltammetryPeakIdx, this.jcampIdx);
      } else {
        this.clickUiTargetAct(data, onPeak, false, this.jcampIdx);
      }
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
        this.dataPks = [];
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
    key: 'drawAUC',
    value: function drawAUC(stack) {
      var _this3 = this;

      var _TfRescale5 = (0, _compass.TfRescale)(this),
          xt = _TfRescale5.xt,
          yt = _TfRescale5.yt;

      var auc = this.tags.aucPath.selectAll('path').data(stack);
      auc.exit().attr('class', 'exit').remove();

      var integCurve = function integCurve(border) {
        var xL = border.xL,
            xU = border.xU;

        var ps = _this3.data.filter(function (d) {
          return d.x > xL && d.x < xU;
        });
        if (!ps[0]) return null;

        var point1 = ps[0];
        var point2 = ps[ps.length - 1];
        var slope = (0, _calc.calcSlope)(point1.x, point1.y, point2.x, point2.y);
        var lastDY = point1.y;

        return d3.area().x(function (d) {
          return xt(d.x);
        }).y0(function (d, index) {
          if (index > 0) {
            var lastD = ps[index - 1];
            var y = slope * (d.x - lastD.x) + lastDY;
            lastDY = y;
            return yt(y);
          }
          return yt(0);
        }).y1(function (d) {
          return yt(d.y);
        })(ps);
      };

      auc.enter().append('path').attr('class', 'auc').attr('fill', 'red').attr('stroke', 'none').attr('fill-opacity', 0.2).attr('stroke-width', 2).merge(auc).attr('d', function (d) {
        return integCurve(d);
      }).attr('id', function (d) {
        return 'auc' + (0, _focus.itgIdTag)(d);
      }).on('mouseover', function (d) {
        d3.select('#auc' + (0, _focus.itgIdTag)(d)).attr('stroke', 'blue');
        d3.select('#auc' + (0, _focus.itgIdTag)(d)).attr('stroke', 'blue');
        d3.select('#auc' + (0, _focus.itgIdTag)(d)).style('fill', 'blue');
      }).on('mouseout', function (d) {
        d3.select('#auc' + (0, _focus.itgIdTag)(d)).attr('stroke', 'none');
        d3.select('#auc' + (0, _focus.itgIdTag)(d)).style('fill', 'red');
        d3.select('#auc' + (0, _focus.itgIdTag)(d)).style('fill-opacity', 0.2);
      }).on('click', function (d) {
        return _this3.onClickTarget(d);
      });
    }
  }, {
    key: 'drawPeaks',
    value: function drawPeaks(editPeakSt) {
      var _this4 = this;

      var _shouldUpdate2 = this.shouldUpdate,
          sameXY = _shouldUpdate2.sameXY,
          sameEpSt = _shouldUpdate2.sameEpSt,
          sameDtPk = _shouldUpdate2.sameDtPk,
          sameSfPk = _shouldUpdate2.sameSfPk;


      if (!_format2.default.isCyclicVoltaLayout(this.layout) && sameXY && sameEpSt && sameDtPk && sameSfPk) return;

      // rescale for zoom

      var _TfRescale6 = (0, _compass.TfRescale)(this),
          xt = _TfRescale6.xt,
          yt = _TfRescale6.yt;

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
        var tipParams = { d: d, layout: _this4.layout };
        _this4.tip.show(tipParams, n[i]);
      }).on('mouseout', function (d, i, n) {
        d3.select('#mpp' + Math.round(1000 * d.x)).attr('stroke-opacity', '0.0');
        d3.select('#bpt' + Math.round(1000 * d.x)).style('fill', 'red');
        var tipParams = { d: d, layout: _this4.layout };
        _this4.tip.hide(tipParams, n[i]);
      }).on('click', function (d) {
        return _this4.onClickTarget(d);
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
          return _this4.onClickTarget(d);
        });
      }
    }
  }, {
    key: 'drawPeckers',
    value: function drawPeckers() {
      var _this5 = this;

      var _shouldUpdate3 = this.shouldUpdate,
          sameXY = _shouldUpdate3.sameXY,
          sameEpSt = _shouldUpdate3.sameEpSt,
          sameDtPk = _shouldUpdate3.sameDtPk,
          sameSfPk = _shouldUpdate3.sameSfPk;


      if (!_format2.default.isCyclicVoltaLayout(this.layout) && sameXY && sameEpSt && sameDtPk && sameSfPk) return;

      // rescale for zoom

      var _TfRescale7 = (0, _compass.TfRescale)(this),
          xt = _TfRescale7.xt,
          yt = _TfRescale7.yt;

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
        var tipParams = { d: d, layout: _this5.layout };
        _this5.tip.show(tipParams, n[i]);
      }).on('mouseout', function (d, i, n) {
        d3.select('#mpp' + Math.round(1000 * d.x)).attr('stroke-opacity', '0.0');
        d3.select('#bpt' + Math.round(1000 * d.x)).style('fill', '#228B22');
        var tipParams = { d: d, layout: _this5.layout };
        _this5.tip.hide(tipParams, n[i]);
      }).on('click', function (d) {
        return _this5.onClickPecker(d);
      });
    }
  }, {
    key: 'drawInteg',
    value: function drawInteg(integationSt) {
      var _this6 = this;

      var _shouldUpdate4 = this.shouldUpdate,
          sameXY = _shouldUpdate4.sameXY,
          sameLySt = _shouldUpdate4.sameLySt,
          sameItSt = _shouldUpdate4.sameItSt,
          sameData = _shouldUpdate4.sameData;

      if (sameXY && sameLySt && sameItSt && sameData) return;

      var integrations = integationSt.integrations;

      var selectedIntegration = integrations[this.jcampIdx];
      if (selectedIntegration === false || selectedIntegration === undefined) {
        var _itgs = [];
        var _igbp = this.tags.igbPath.selectAll('path').data(_itgs);
        _igbp.exit().attr('class', 'exit').remove();
        var _igcp = this.tags.igcPath.selectAll('path').data(_itgs);
        _igcp.exit().attr('class', 'exit').remove();

        var _igtp = this.tags.igtPath.selectAll('text').data(_itgs);
        _igtp.exit().attr('class', 'exit').remove();
        return;
      }

      var stack = selectedIntegration.stack,
          refArea = selectedIntegration.refArea,
          refFactor = selectedIntegration.refFactor,
          shift = selectedIntegration.shift;


      var isDisable = _cfg2.default.btnCmdIntg(this.layout);
      var ignoreRef = _format2.default.isHplcUvVisLayout(this.layout);
      var itgs = isDisable ? [] : stack;

      var igbp = this.tags.igbPath.selectAll('path').data(itgs);
      igbp.exit().attr('class', 'exit').remove();
      var igcp = this.tags.igcPath.selectAll('path').data(itgs);
      igcp.exit().attr('class', 'exit').remove();

      var igtp = this.tags.igtPath.selectAll('text').data(itgs);
      igtp.exit().attr('class', 'exit').remove();

      if (itgs.length === 0 || isDisable) {
        // remove drawn area under curve
        var auc = this.tags.aucPath.selectAll('path').data(stack);
        auc.exit().attr('class', 'exit').remove();
        auc.merge(auc);
        return;
      }

      if (ignoreRef) {
        this.drawAUC(stack);
      } else {

        // rescale for zoom
        var _TfRescale8 = (0, _compass.TfRescale)(this),
            xt = _TfRescale8.xt;

        var dh = 50;
        var integBar = function integBar(data) {
          return d3.line()([[xt(data.xL - shift), dh], [xt(data.xL - shift), dh - 10], [xt(data.xL - shift), dh - 5], [xt(data.xU - shift), dh - 5], [xt(data.xU - shift), dh - 10], [xt(data.xU - shift), dh]]);
        };

        igbp.enter().append('path').attr('class', 'igbp').attr('fill', 'none').attr('stroke', '#228B22').attr('stroke-width', 2).merge(igbp).attr('id', function (d) {
          return 'igbp' + (0, _focus.itgIdTag)(d);
        }).attr('d', function (d) {
          return integBar(d);
        }).on('mouseover', function (d) {
          d3.select('#igbp' + (0, _focus.itgIdTag)(d)).attr('stroke', 'blue');
          d3.select('#igbc' + (0, _focus.itgIdTag)(d)).attr('stroke', 'blue');
          d3.select('#igtp' + (0, _focus.itgIdTag)(d)).style('fill', 'blue');
        }).on('mouseout', function (d) {
          d3.select('#igbp' + (0, _focus.itgIdTag)(d)).attr('stroke', '#228B22');
          d3.select('#igbc' + (0, _focus.itgIdTag)(d)).attr('stroke', '#228B22');
          d3.select('#igtp' + (0, _focus.itgIdTag)(d)).style('fill', '#228B22');
        }).on('click', function (d) {
          return _this6.onClickTarget(d);
        });

        var integCurve = function integCurve(border) {
          var xL = border.xL,
              xU = border.xU;
          var nXL = xL - shift,
              nXU = xU - shift;

          var ps = _this6.data.filter(function (d) {
            return d.x > nXL && d.x < nXU;
          });
          var kMax = _this6.data[_this6.data.length - 1].k;
          if (!ps[0]) return null;
          var kRef = ps[0].k;
          if (!_this6.reverseXAxis(_this6.layout)) {
            return d3.line().x(function (d) {
              return xt(d.x);
            }).y(function (d) {
              return 100 - (kRef - d.k) * 400 / kMax;
            })(ps);
          }
          return d3.line().x(function (d) {
            return xt(d.x);
          }).y(function (d) {
            return 300 - (d.k - kRef) * 400 / kMax;
          })(ps);
        };

        igcp.enter().append('path').attr('class', 'igcp').attr('fill', 'none').attr('stroke', '#228B22').attr('stroke-width', 2).merge(igcp).attr('id', function (d) {
          return 'igbc' + (0, _focus.itgIdTag)(d);
        }).attr('d', function (d) {
          return integCurve(d);
        }).on('mouseover', function (d) {
          d3.select('#igbp' + (0, _focus.itgIdTag)(d)).attr('stroke', 'blue');
          d3.select('#igbc' + (0, _focus.itgIdTag)(d)).attr('stroke', 'blue');
          d3.select('#igtp' + (0, _focus.itgIdTag)(d)).style('fill', 'blue');
        }).on('mouseout', function (d) {
          d3.select('#igbp' + (0, _focus.itgIdTag)(d)).attr('stroke', '#228B22');
          d3.select('#igbc' + (0, _focus.itgIdTag)(d)).attr('stroke', '#228B22');
          d3.select('#igtp' + (0, _focus.itgIdTag)(d)).style('fill', '#228B22');
        }).on('click', function (d) {
          return _this6.onClickTarget(d);
        });

        igtp.enter().append('text').attr('class', 'igtp').attr('font-family', 'Helvetica').style('font-size', '12px').attr('fill', '#228B22').style('text-anchor', 'middle').merge(igtp).attr('id', function (d) {
          return 'igtp' + (0, _focus.itgIdTag)(d);
        }).text(function (d) {
          return (0, _integration.calcArea)(d, refArea, refFactor, ignoreRef);
        }).attr('transform', function (d) {
          return 'translate(' + xt((d.xL + d.xU) / 2 - shift) + ', ' + (dh - 12) + ')';
        }).on('mouseover', function (d) {
          d3.select('#igbp' + (0, _focus.itgIdTag)(d)).attr('stroke', 'blue');
          d3.select('#igbc' + (0, _focus.itgIdTag)(d)).attr('stroke', 'blue');
          d3.select('#igtp' + (0, _focus.itgIdTag)(d)).style('fill', 'blue');
        }).on('mouseout', function (d) {
          d3.select('#igbp' + (0, _focus.itgIdTag)(d)).attr('stroke', '#228B22');
          d3.select('#igbc' + (0, _focus.itgIdTag)(d)).attr('stroke', '#228B22');
          d3.select('#igtp' + (0, _focus.itgIdTag)(d)).style('fill', '#228B22');
        }).on('click', function (d) {
          return _this6.onClickTarget(d);
        });
      }
    }
  }, {
    key: 'drawMtply',
    value: function drawMtply(mtplySt) {
      var _ref3,
          _this7 = this;

      var _shouldUpdate5 = this.shouldUpdate,
          sameXY = _shouldUpdate5.sameXY,
          sameLySt = _shouldUpdate5.sameLySt,
          sameMySt = _shouldUpdate5.sameMySt;

      if (sameXY && sameLySt && sameMySt) return;

      var multiplicities = mtplySt.multiplicities;

      var selectedMulti = multiplicities[this.jcampIdx];

      if (selectedMulti === false || selectedMulti === undefined) {
        var _ref2;

        var _mpys = [];
        var _mpyb = this.tags.mpybPath.selectAll('path').data(_mpys);
        _mpyb.exit().attr('class', 'exit').remove();
        var _mpyt = this.tags.mpyt1Path.selectAll('text').data(_mpys);
        _mpyt.exit().attr('class', 'exit').remove();
        var _mpyt2 = this.tags.mpyt2Path.selectAll('text').data(_mpys);
        _mpyt2.exit().attr('class', 'exit').remove();
        var _mPeaks = _mpys.map(function (m) {
          var peaks = m.peaks,
              xExtent = m.xExtent;

          return peaks.map(function (p) {
            return Object.assign({}, p, { xExtent: xExtent });
          });
        });
        _mPeaks = (_ref2 = []).concat.apply(_ref2, _toConsumableArray(_mPeaks));
        var _mpyp = this.tags.mpypPath.selectAll('path').data(_mPeaks);
        _mpyp.exit().attr('class', 'exit').remove();
        return;
      }

      var stack = selectedMulti.stack,
          smExtext = selectedMulti.smExtext,
          shift = selectedMulti.shift;

      var mpys = stack;
      var isDisable = _cfg2.default.btnCmdMpy(this.layout);
      if (mpys === 0 || isDisable) return;
      // rescale for zoom

      var _TfRescale9 = (0, _compass.TfRescale)(this),
          xt = _TfRescale9.xt;

      var mpyb = this.tags.mpybPath.selectAll('path').data(mpys);
      mpyb.exit().attr('class', 'exit').remove();
      var mpyt1 = this.tags.mpyt1Path.selectAll('text').data(mpys);
      mpyt1.exit().attr('class', 'exit').remove();
      var mpyt2 = this.tags.mpyt2Path.selectAll('text').data(mpys);
      mpyt2.exit().attr('class', 'exit').remove();
      var mPeaks = mpys.map(function (m) {
        var peaks = m.peaks,
            xExtent = m.xExtent;

        return peaks.map(function (p) {
          return Object.assign({}, p, { xExtent: xExtent });
        });
      });
      mPeaks = (_ref3 = []).concat.apply(_ref3, _toConsumableArray(mPeaks));
      var mpyp = this.tags.mpypPath.selectAll('path').data(mPeaks);
      mpyp.exit().attr('class', 'exit').remove();

      var height = this.h;
      var dh = Math.abs(0.06 * height);
      var mpyBar = function mpyBar(data) {
        return d3.line()([[xt(data.xExtent.xL - shift), height - dh], [xt(data.xExtent.xL - shift), height - dh - 10], [xt(data.xExtent.xL - shift), height - dh - 5], [xt(data.xExtent.xU - shift), height - dh - 5], [xt(data.xExtent.xU - shift), height - dh - 10], [xt(data.xExtent.xU - shift), height - dh]]);
      };

      var mpyColor = function mpyColor(d) {
        var _d$xExtent = d.xExtent,
            xL = _d$xExtent.xL,
            xU = _d$xExtent.xU;

        return smExtext.xL === xL && smExtext.xU === xU ? 'purple' : '#DA70D6';
      };

      mpyb.enter().append('path').attr('class', 'mpyb').attr('fill', 'none').attr('stroke-width', 2).merge(mpyb).attr('stroke', function (d) {
        return mpyColor(d);
      }).attr('id', function (d) {
        return 'mpyb' + (0, _focus.mpyIdTag)(d);
      }).attr('d', function (d) {
        return mpyBar(d);
      }).on('mouseover', function (d) {
        d3.selectAll('#mpyb' + (0, _focus.mpyIdTag)(d)).attr('stroke', 'blue');
        d3.selectAll('#mpyt1' + (0, _focus.mpyIdTag)(d)).style('fill', 'blue');
        d3.selectAll('#mpyt2' + (0, _focus.mpyIdTag)(d)).style('fill', 'blue');
        d3.selectAll('#mpyp' + (0, _focus.mpyIdTag)(d)).attr('stroke', 'blue');
      }).on('mouseout', function (d) {
        var dColor = mpyColor(d);
        d3.selectAll('#mpyb' + (0, _focus.mpyIdTag)(d)).attr('stroke', dColor);
        d3.selectAll('#mpyt1' + (0, _focus.mpyIdTag)(d)).style('fill', dColor);
        d3.selectAll('#mpyt2' + (0, _focus.mpyIdTag)(d)).style('fill', dColor);
        d3.selectAll('#mpyp' + (0, _focus.mpyIdTag)(d)).attr('stroke', dColor);
      }).on('click', function (d) {
        return _this7.onClickTarget(d);
      });

      mpyt1.enter().append('text').attr('class', 'mpyt1').attr('font-family', 'Helvetica').style('font-size', '12px').style('text-anchor', 'middle').merge(mpyt1).attr('fill', function (d) {
        return mpyColor(d);
      }).attr('id', function (d) {
        return 'mpyt1' + (0, _focus.mpyIdTag)(d);
      }).text(function (d) {
        return '' + (0, _multiplicity_calc.calcMpyCenter)(d.peaks, shift, d.mpyType).toFixed(3);
      }).attr('transform', function (d) {
        return 'translate(' + xt((d.xExtent.xL + d.xExtent.xU) / 2 - shift) + ', ' + (height - dh + 12) + ')';
      }).on('mouseover', function (d) {
        d3.selectAll('#mpyb' + (0, _focus.mpyIdTag)(d)).attr('stroke', 'blue');
        d3.selectAll('#mpyt1' + (0, _focus.mpyIdTag)(d)).style('fill', 'blue');
        d3.selectAll('#mpyt2' + (0, _focus.mpyIdTag)(d)).style('fill', 'blue');
        d3.selectAll('#mpyp' + (0, _focus.mpyIdTag)(d)).attr('stroke', 'blue');
      }).on('mouseout', function (d) {
        var dColor = mpyColor(d);
        d3.selectAll('#mpyb' + (0, _focus.mpyIdTag)(d)).attr('stroke', dColor);
        d3.selectAll('#mpyt1' + (0, _focus.mpyIdTag)(d)).style('fill', dColor);
        d3.selectAll('#mpyt2' + (0, _focus.mpyIdTag)(d)).style('fill', dColor);
        d3.selectAll('#mpyp' + (0, _focus.mpyIdTag)(d)).attr('stroke', dColor);
      }).on('click', function (d) {
        return _this7.onClickTarget(d);
      });

      mpyt2.enter().append('text').attr('class', 'mpyt2').attr('font-family', 'Helvetica').style('font-size', '12px').style('text-anchor', 'middle').merge(mpyt2).attr('fill', function (d) {
        return mpyColor(d);
      }).attr('id', function (d) {
        return 'mpyt2' + (0, _focus.mpyIdTag)(d);
      }).text(function (d) {
        return '(' + d.mpyType + ')';
      }).attr('transform', function (d) {
        return 'translate(' + xt((d.xExtent.xL + d.xExtent.xU) / 2 - shift) + ', ' + (height - dh + 24) + ')';
      }).on('mouseover', function (d) {
        d3.selectAll('#mpyb' + (0, _focus.mpyIdTag)(d)).attr('stroke', 'blue');
        d3.selectAll('#mpyt1' + (0, _focus.mpyIdTag)(d)).style('fill', 'blue');
        d3.selectAll('#mpyt2' + (0, _focus.mpyIdTag)(d)).style('fill', 'blue');
        d3.selectAll('#mpyp' + (0, _focus.mpyIdTag)(d)).attr('stroke', 'blue');
      }).on('mouseout', function (d) {
        var dColor = mpyColor(d);
        d3.selectAll('#mpyb' + (0, _focus.mpyIdTag)(d)).attr('stroke', dColor);
        d3.selectAll('#mpyt1' + (0, _focus.mpyIdTag)(d)).style('fill', dColor);
        d3.selectAll('#mpyt2' + (0, _focus.mpyIdTag)(d)).style('fill', dColor);
        d3.selectAll('#mpyp' + (0, _focus.mpyIdTag)(d)).attr('stroke', dColor);
      }).on('click', function (d) {
        return _this7.onClickTarget(d);
      });

      var mpypH = height - dh;
      var mpypPath = function mpypPath(pk) {
        return [{ x: xt(pk.x - shift) - 0.5, y: mpypH - 5 }, { x: xt(pk.x - shift) - 0.5, y: mpypH - 20 }, { x: xt(pk.x - shift) + 0.5, y: mpypH - 20 }, { x: xt(pk.x - shift) + 0.5, y: mpypH - 5 }];
      };
      // const faktor = layoutSt === LIST_LAYOUT.IR ? -1 : 1;
      var lineSymbol = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      });

      mpyp.enter().append('path').attr('class', 'mpyp').attr('fill', 'none').merge(mpyp).attr('stroke', function (d) {
        return mpyColor(d);
      }).attr('d', function (d) {
        return lineSymbol(mpypPath(d));
      }).attr('id', function (d) {
        return 'mpyp' + (0, _focus.mpyIdTag)(d);
      }).on('mouseover', function (d) {
        d3.selectAll('#mpyb' + (0, _focus.mpyIdTag)(d)).attr('stroke', 'blue');
        d3.selectAll('#mpyt1' + (0, _focus.mpyIdTag)(d)).style('fill', 'blue');
        d3.selectAll('#mpyt2' + (0, _focus.mpyIdTag)(d)).style('fill', 'blue');
        d3.selectAll('#mpyp' + (0, _focus.mpyIdTag)(d)).attr('stroke', 'blue');
      }).on('mouseout', function (d) {
        var dColor = mpyColor(d);
        d3.selectAll('#mpyb' + (0, _focus.mpyIdTag)(d)).attr('stroke', dColor);
        d3.selectAll('#mpyt1' + (0, _focus.mpyIdTag)(d)).style('fill', dColor);
        d3.selectAll('#mpyt2' + (0, _focus.mpyIdTag)(d)).style('fill', dColor);
        d3.selectAll('#mpyp' + (0, _focus.mpyIdTag)(d)).attr('stroke', dColor);
      }).on('click', function (d) {
        return _this7.onClickTarget(d);
      });
    }
  }, {
    key: 'drawRef',
    value: function drawRef() {
      // rescale for zoom
      var _TfRescale10 = (0, _compass.TfRescale)(this),
          xt = _TfRescale10.xt,
          yt = _TfRescale10.yt;

      var ccp = this.ref.selectAll('path').data(this.tSfPeaks);

      ccp.exit().attr('class', 'exit').remove();

      var linePath = [{ x: -0.5, y: 10 }, { x: -4, y: -20 }, { x: 4, y: -20 }, { x: 0.5, y: 10 }];
      var faktor = _format2.default.isIrLayout(this.layout) ? -1 : 1;
      var lineSymbol = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return faktor * d.y;
      })(linePath);

      ccp.enter().append('path').attr('d', lineSymbol).attr('class', 'enter-ref').attr('fill', 'green').attr('fill-opacity', 0.8).merge(ccp).attr('transform', function (d) {
        return 'translate(' + xt(d.x) + ', ' + yt(d.y) + ')';
      });
    }
  }, {
    key: 'reverseXAxis',
    value: function reverseXAxis(layoutSt) {
      return [_list_layout.LIST_LAYOUT.UVVIS, _list_layout.LIST_LAYOUT.HPLC_UVVIS, _list_layout.LIST_LAYOUT.TGA, _list_layout.LIST_LAYOUT.XRD, _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY].indexOf(layoutSt) < 0;
    }
  }, {
    key: 'create',
    value: function create(_ref4) {
      var curveSt = _ref4.curveSt,
          filterSeed = _ref4.filterSeed,
          filterPeak = _ref4.filterPeak,
          tTrEndPts = _ref4.tTrEndPts,
          tSfPeaks = _ref4.tSfPeaks,
          editPeakSt = _ref4.editPeakSt,
          layoutSt = _ref4.layoutSt,
          sweepExtentSt = _ref4.sweepExtentSt,
          isUiNoBrushSt = _ref4.isUiNoBrushSt,
          cyclicvoltaSt = _ref4.cyclicvoltaSt,
          integationSt = _ref4.integationSt,
          mtplySt = _ref4.mtplySt;

      this.svg = d3.select(this.rootKlass).select('.d3Svg');
      (0, _mount.MountMainFrame)(this, 'focus');
      (0, _mount.MountClip)(this);

      var curveIdx = curveSt.curveIdx;

      var jcampIdx = curveIdx;

      this.root = d3.select(this.rootKlass).selectAll('.focus-main');
      this.scales = (0, _init.InitScale)(this, this.reverseXAxis(layoutSt));
      this.setTip();
      this.setDataParams(filterPeak, tTrEndPts, tSfPeaks, layoutSt, cyclicvoltaSt, jcampIdx);
      (0, _compass.MountCompass)(this);

      this.axis = (0, _mount.MountAxis)(this);
      this.path = (0, _mount.MountPath)(this, this.pathColor);
      this.grid = (0, _mount.MountGrid)(this);
      this.tags = (0, _mount.MountTags)(this);
      this.ref = (0, _mount.MountRef)(this);
      (0, _mount.MountAxisLabelX)(this);
      (0, _mount.MountAxisLabelY)(this);

      if (this.data && this.data.length > 0) {
        this.setConfig(sweepExtentSt);
        this.drawLine();
        this.drawGrid();
        this.drawOtherLines(layoutSt);
        this.drawPeaks(editPeakSt);
        this.drawRef();
        this.drawPeckers();
        this.drawInteg(integationSt);
        this.drawMtply(mtplySt);
      }
      (0, _brush2.default)(this, false, isUiNoBrushSt);
      this.resetShouldUpdate(editPeakSt);
    }
  }, {
    key: 'update',
    value: function update(_ref5) {
      var entities = _ref5.entities,
          curveSt = _ref5.curveSt,
          filterSeed = _ref5.filterSeed,
          filterPeak = _ref5.filterPeak,
          tTrEndPts = _ref5.tTrEndPts,
          tSfPeaks = _ref5.tSfPeaks,
          editPeakSt = _ref5.editPeakSt,
          layoutSt = _ref5.layoutSt,
          sweepExtentSt = _ref5.sweepExtentSt,
          isUiNoBrushSt = _ref5.isUiNoBrushSt,
          cyclicvoltaSt = _ref5.cyclicvoltaSt,
          integationSt = _ref5.integationSt,
          mtplySt = _ref5.mtplySt;

      this.root = d3.select(this.rootKlass).selectAll('.focus-main');
      this.scales = (0, _init.InitScale)(this, this.reverseXAxis(layoutSt));

      var curveIdx = curveSt.curveIdx;

      var jcampIdx = curveIdx;
      this.entities = entities;

      this.setDataParams(filterPeak, tTrEndPts, tSfPeaks, layoutSt, cyclicvoltaSt, jcampIdx);

      if (this.data && this.data.length > 0) {
        this.setConfig(sweepExtentSt);
        this.getShouldUpdate(editPeakSt);
        this.drawLine();
        this.drawGrid();
        this.drawOtherLines(layoutSt);
        this.drawPeaks(editPeakSt);
        this.drawRef();
        this.drawPeckers();
        this.drawInteg(integationSt);
        this.drawMtply(mtplySt);
      }
      (0, _brush2.default)(this, false, isUiNoBrushSt);
      this.resetShouldUpdate(editPeakSt);
    }
  }]);

  return MultiFocus;
}();

exports.default = MultiFocus;