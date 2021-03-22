'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d2 = require('d3');

var d3 = _interopRequireWildcard(_d2);

var _init = require('../../helpers/init');

var _brush = require('../../helpers/brush');

var _brush2 = _interopRequireDefault(_brush);

var _mount = require('../../helpers/mount');

var _compass = require('../../helpers/compass');

var _converter = require('../../helpers/converter');

var _list_layout = require('../../constants/list_layout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RectFocus = function () {
  function RectFocus(props) {
    _classCallCheck(this, RectFocus);

    var W = props.W,
        H = props.H,
        clickUiTargetAct = props.clickUiTargetAct,
        selectUiSweepAct = props.selectUiSweepAct,
        scrollUiWheelAct = props.scrollUiWheelAct;


    this.rootKlass = '.d3Rect';
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

    this.axis = null;
    this.thresLine = null;
    this.grid = null;
    this.ref = null;
    this.ccPattern = null;
    this.data = [];
    this.dataPks = [];
    this.tTrEndPts = null;
    this.tSfPeaks = null;
    this.root = null;
    this.svg = null;
    this.bars = null;
    this.scales = (0, _init.InitScale)(this, false);
    this.axisCall = (0, _init.InitAxisCall)(5);
    this.pathCall = null;
    this.tip = null;
    this.factor = 0.125;
    this.currentExtent = null;
    this.layout = _list_layout.LIST_LAYOUT.MS;

    this.setTip = this.setTip.bind(this);
    this.setDataParams = this.setDataParams.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.drawBar = this.drawBar.bind(this);
    this.drawThres = this.drawThres.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.mergedPeaks = this.mergedPeaks.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }

  _createClass(RectFocus, [{
    key: 'setTip',
    value: function setTip() {
      this.tip = (0, _init.InitTip)();
      this.root.call(this.tip);
    }
  }, {
    key: 'setDataParams',
    value: function setDataParams(data, peaks, tTrEndPts, tSfPeaks) {
      this.data = [].concat(_toConsumableArray(data));
      this.dataPks = [].concat(_toConsumableArray(peaks));
      this.tTrEndPts = tTrEndPts;
      this.tSfPeaks = tSfPeaks;
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
        xExtent = { xL: xes[0] - 10, xU: xes[1] + 10 };
        var btm = 0; // MS baseline is always 0.
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

      var _TfRescale = (0, _compass.TfRescale)(this),
          xt = _TfRescale.xt,
          yt = _TfRescale.yt;

      // Axis Call


      this.axisCall.x.scale(xt);
      this.axisCall.y.scale(yt);

      this.currentExtent = { xExtent: xExtent, yExtent: yExtent };
    }
  }, {
    key: 'posHeight',
    value: function posHeight(gnd, val) {
      var h = gnd - val;
      return h >= 0 ? h : 0;
    }
  }, {
    key: 'barColor',
    value: function barColor(y, yRef) {
      return y >= yRef ? 'steelblue' : '#aaa';
    }
  }, {
    key: 'drawBar',
    value: function drawBar() {
      var _this = this;

      var _TfRescale2 = (0, _compass.TfRescale)(this),
          xt = _TfRescale2.xt,
          yt = _TfRescale2.yt;

      this.updatePathCall(xt, yt);

      var yRef = this.tTrEndPts[0].y;

      var bars = this.bars.selectAll('rect').data(this.data);

      bars.exit().attr('class', 'exit').remove();

      var gnd = yt(0);
      bars.enter().append('rect').attr('class', 'enter-bar').attr('width', 1.5).merge(bars).attr('fill', function (d) {
        return _this.barColor(d.y, yRef);
      }).attr('height', function (d) {
        return _this.posHeight(gnd, yt(d.y));
      }).attr('id', function (d) {
        return 'mpp' + Math.round(1000 * d.x);
      }).attr('transform', function (d) {
        return 'translate(' + xt(d.x) + ', ' + yt(d.y) + ')';
      }).on('mouseover', function (d, i, n) {
        d3.select('#mpp' + Math.round(1000 * d.x)).attr('stroke-opacity', '1.0');
        d3.select('#bpt' + Math.round(1000 * d.x)).style('fill', 'blue');
        var tipParams = { d: d, layout: _this.layout };
        _this.tip.show(tipParams, n[i]);
      }).on('mouseout', function (d, i, n) {
        d3.select('#mpp' + Math.round(1000 * d.x)).attr('stroke-opacity', '1.0');
        d3.select('#bpt' + Math.round(1000 * d.x)).style('fill', 'red');
        var tipParams = { d: d, layout: _this.layout };
        _this.tip.hide(tipParams, n[i]);
      });
    }
  }, {
    key: 'drawThres',
    value: function drawThres() {
      if (this.tTrEndPts.length > 0) {
        this.thresLine.attr('d', this.pathCall(this.tTrEndPts));
        this.thresLine.attr('visibility', 'visible');
      } else {
        this.thresLine.attr('visibility', 'hidden');
      }
    }
  }, {
    key: 'drawGrid',
    value: function drawGrid() {
      this.grid.x.call(this.axisCall.x.tickSize(-this.h, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
      this.grid.y.call(this.axisCall.y.tickSize(-this.w, 0, 0)).selectAll('line').attr('stroke', '#ddd').attr('stroke-opacity', 0.6).attr('fill', 'none');
    }
  }, {
    key: 'mergedPeaks',
    value: function mergedPeaks(editPeakSt) {
      if (!editPeakSt) return this.dataPks;
      this.dataPks = (0, _converter.PksEdit)(this.dataPks, editPeakSt);
      return this.dataPks;
    }
  }, {
    key: 'create',
    value: function create(_ref2) {
      var filterSeed = _ref2.filterSeed,
          filterPeak = _ref2.filterPeak,
          tTrEndPts = _ref2.tTrEndPts,
          tSfPeaks = _ref2.tSfPeaks,
          sweepExtentSt = _ref2.sweepExtentSt,
          isUiAddIntgSt = _ref2.isUiAddIntgSt,
          isUiNoBrushSt = _ref2.isUiNoBrushSt;

      this.svg = d3.select('.d3Svg');
      (0, _mount.MountMainFrame)(this, 'focus');
      (0, _mount.MountClip)(this);

      this.root = d3.select(this.rootKlass).selectAll('.focus-main');
      this.setTip();
      this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks);
      (0, _compass.MountCompass)(this);

      this.axis = (0, _mount.MountAxis)(this);

      var _MountThresLine = (0, _mount.MountThresLine)(this, 'green');

      var _MountThresLine2 = _slicedToArray(_MountThresLine, 1);

      this.thresLine = _MountThresLine2[0];

      this.grid = (0, _mount.MountGrid)(this);
      this.ref = (0, _mount.MountRef)(this);
      this.bars = (0, _mount.MountBars)(this);
      (0, _mount.MountAxisLabelX)(this);
      (0, _mount.MountAxisLabelY)(this);

      if (this.data && this.data.length > 0) {
        this.setConfig(sweepExtentSt);
        this.drawBar();
        this.drawThres();
        this.drawGrid();
      }
      (0, _brush2.default)(this, isUiAddIntgSt, isUiNoBrushSt);
    }
  }, {
    key: 'update',
    value: function update(_ref3) {
      var filterSeed = _ref3.filterSeed,
          filterPeak = _ref3.filterPeak,
          tTrEndPts = _ref3.tTrEndPts,
          tSfPeaks = _ref3.tSfPeaks,
          sweepExtentSt = _ref3.sweepExtentSt,
          isUiAddIntgSt = _ref3.isUiAddIntgSt,
          isUiNoBrushSt = _ref3.isUiNoBrushSt;

      this.root = d3.select(this.rootKlass).selectAll('.focus-main');
      this.setDataParams(filterSeed, filterPeak, tTrEndPts, tSfPeaks);

      if (this.data && this.data.length > 0) {
        this.setConfig(sweepExtentSt);
        this.drawBar();
        this.drawThres();
        this.drawGrid();
      }
      (0, _brush2.default)(this, isUiAddIntgSt, isUiNoBrushSt);
    }
  }]);

  return RectFocus;
}();

exports.default = RectFocus;