'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _chem = require('../../helpers/chem');

var _manager = require('../../actions/manager');

var _ui = require('../../actions/ui');

var _list_ui = require('../../constants/list_ui');

var _cyclic_voltammetry = require('../../actions/cyclic_voltammetry');

var _multi_focus = require('./multi_focus');

var _multi_focus2 = _interopRequireDefault(_multi_focus);

var _draw = require('../common/draw');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
var H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI


var ViewerMulti = function (_React$Component) {
  _inherits(ViewerMulti, _React$Component);

  function ViewerMulti(props) {
    _classCallCheck(this, ViewerMulti);

    var _this = _possibleConstructorReturn(this, (ViewerMulti.__proto__ || Object.getPrototypeOf(ViewerMulti)).call(this, props));

    var _this$props = _this.props,
        id = _this$props.id,
        clickUiTargetAct = _this$props.clickUiTargetAct,
        selectUiSweepAct = _this$props.selectUiSweepAct,
        scrollUiWheelAct = _this$props.scrollUiWheelAct;

    _this.rootKlass = '.d3Line' + id;

    _this.focus = new _multi_focus2.default({
      W: W, H: H, id: id, clickUiTargetAct: clickUiTargetAct, selectUiSweepAct: selectUiSweepAct, scrollUiWheelAct: scrollUiWheelAct
    });

    _this.normChange = _this.normChange.bind(_this);
    _this.initMaxMinPeaks = _this.initMaxMinPeaks.bind(_this);
    return _this;
  }

  _createClass(ViewerMulti, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          seed = _props.seed,
          peak = _props.peak,
          cLabel = _props.cLabel,
          xLabel = _props.xLabel,
          yLabel = _props.yLabel,
          feature = _props.feature,
          tTrEndPts = _props.tTrEndPts,
          tSfPeaks = _props.tSfPeaks,
          editPeakSt = _props.editPeakSt,
          layoutSt = _props.layoutSt,
          sweepExtentSt = _props.sweepExtentSt,
          isUiNoBrushSt = _props.isUiNoBrushSt,
          isHidden = _props.isHidden,
          resetAllAct = _props.resetAllAct,
          cyclicvoltaSt = _props.cyclicvoltaSt;

      (0, _draw.drawDestroy)(this.rootKlass);
      resetAllAct(feature);
      this.initMaxMinPeaks();

      var filterSeed = seed;
      var filterPeak = peak;

      (0, _draw.drawMain)(this.rootKlass, W, H);
      this.focus.create({
        filterSeed: filterSeed,
        filterPeak: filterPeak,
        tTrEndPts: tTrEndPts,
        tSfPeaks: tSfPeaks,
        editPeakSt: editPeakSt,
        layoutSt: layoutSt,
        sweepExtentSt: sweepExtentSt,
        isUiNoBrushSt: isUiNoBrushSt,
        cyclicvoltaSt: cyclicvoltaSt
      });
      (0, _draw.drawLabel)(this.rootKlass, cLabel, xLabel, yLabel);
      (0, _draw.drawDisplay)(this.rootKlass, isHidden);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props2 = this.props,
          seed = _props2.seed,
          peak = _props2.peak,
          cLabel = _props2.cLabel,
          xLabel = _props2.xLabel,
          yLabel = _props2.yLabel,
          tTrEndPts = _props2.tTrEndPts,
          tSfPeaks = _props2.tSfPeaks,
          editPeakSt = _props2.editPeakSt,
          layoutSt = _props2.layoutSt,
          sweepExtentSt = _props2.sweepExtentSt,
          isUiNoBrushSt = _props2.isUiNoBrushSt,
          isHidden = _props2.isHidden,
          cyclicvoltaSt = _props2.cyclicvoltaSt;

      this.normChange(prevProps);

      this.initMaxMinPeaks();

      var filterSeed = seed;
      var filterPeak = peak;

      this.focus.update({
        filterSeed: filterSeed,
        filterPeak: filterPeak,
        tTrEndPts: tTrEndPts,
        tSfPeaks: tSfPeaks,
        editPeakSt: editPeakSt,
        layoutSt: layoutSt,
        sweepExtentSt: sweepExtentSt,
        isUiNoBrushSt: isUiNoBrushSt,
        cyclicvoltaSt: cyclicvoltaSt
      });
      (0, _draw.drawLabel)(this.rootKlass, cLabel, xLabel, yLabel);
      (0, _draw.drawDisplay)(this.rootKlass, isHidden);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (0, _draw.drawDestroy)(this.rootKlass);
    }
  }, {
    key: 'normChange',
    value: function normChange(prevProps) {
      var _props3 = this.props,
          feature = _props3.feature,
          resetAllAct = _props3.resetAllAct;

      var oldFeature = prevProps.feature;
      if (oldFeature !== feature) {
        resetAllAct(feature);
      }
    }
  }, {
    key: 'initMaxMinPeaks',
    value: function initMaxMinPeaks() {
      var _props4 = this.props,
          entities = _props4.entities,
          id = _props4.id,
          cyclicvoltaSt = _props4.cyclicvoltaSt,
          maxminPeakSt = _props4.maxminPeakSt,
          addNewCylicVoltaPairPeakAct = _props4.addNewCylicVoltaPairPeakAct,
          addCylicVoltaMaxPeakAct = _props4.addCylicVoltaMaxPeakAct,
          addCylicVoltaMinPeakAct = _props4.addCylicVoltaMinPeakAct;

      if (cyclicvoltaSt && maxminPeakSt) {
        var spectraList = cyclicvoltaSt.spectraList;

        var spectra = spectraList[id];
        if (spectra) {
          var list = spectra.list;

          if (list.length === 0) {
            maxminPeakSt.max.forEach(function (maxPeak, idx) {
              addNewCylicVoltaPairPeakAct(id);
              var minPeak = maxminPeakSt.min[idx];
              addCylicVoltaMaxPeakAct({ peak: maxPeak, index: idx, jcampIdx: id });
              addCylicVoltaMinPeakAct({ peak: minPeak, index: idx, jcampIdx: id });
            });
          }
        } else {
          addNewCylicVoltaPairPeakAct(id);
          maxminPeakSt.max.forEach(function (maxPeak, idx) {
            addNewCylicVoltaPairPeakAct(id);
            var minPeak = maxminPeakSt.min[idx];
            addCylicVoltaMaxPeakAct({ peak: maxPeak, index: idx, jcampIdx: id });
            addCylicVoltaMinPeakAct({ peak: minPeak, index: idx, jcampIdx: id });
          });
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var id = this.props.id;

      return _react2.default.createElement('div', { className: 'd3Line' + id });
    }
  }]);

  return ViewerMulti;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    seed: (0, _chem.Topic2Seed)(state, props),
    peak: (0, _chem.Feature2Peak)(state, props),
    tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
    tSfPeaks: (0, _chem.ToShiftPeaks)(state, props),
    editPeakSt: state.editPeak.present,
    layoutSt: state.layout,
    sweepExtentSt: state.ui.sweepExtent,
    isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
    cyclicvoltaSt: state.cyclicvolta,
    maxminPeakSt: (0, _chem.Feature2MaxMinPeak)(state, props)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    resetAllAct: _manager.resetAll,
    clickUiTargetAct: _ui.clickUiTarget,
    selectUiSweepAct: _ui.selectUiSweep,
    scrollUiWheelAct: _ui.scrollUiWheel,
    addNewCylicVoltaPairPeakAct: _cyclic_voltammetry.addNewCylicVoltaPairPeak,
    addCylicVoltaMaxPeakAct: _cyclic_voltammetry.addCylicVoltaMaxPeak,
    addCylicVoltaMinPeakAct: _cyclic_voltammetry.addCylicVoltaMinPeak
  }, dispatch);
};

ViewerMulti.propTypes = {
  id: _propTypes2.default.any.isRequired,
  entities: _propTypes2.default.array.isRequired,
  seed: _propTypes2.default.array.isRequired,
  peak: _propTypes2.default.array.isRequired,
  xLabel: _propTypes2.default.string.isRequired,
  yLabel: _propTypes2.default.string.isRequired,
  feature: _propTypes2.default.object.isRequired,
  tTrEndPts: _propTypes2.default.array.isRequired,
  tSfPeaks: _propTypes2.default.array.isRequired,
  editPeakSt: _propTypes2.default.object.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  sweepExtentSt: _propTypes2.default.object.isRequired,
  isUiNoBrushSt: _propTypes2.default.bool.isRequired,
  resetAllAct: _propTypes2.default.func.isRequired,
  clickUiTargetAct: _propTypes2.default.func.isRequired,
  selectUiSweepAct: _propTypes2.default.func.isRequired,
  scrollUiWheelAct: _propTypes2.default.func.isRequired,
  isHidden: _propTypes2.default.bool,
  cyclicvoltaSt: _propTypes2.default.object.isRequired,
  maxminPeakSt: _propTypes2.default.object,
  addNewCylicVoltaPairPeakAct: _propTypes2.default.func.isRequired,
  addCylicVoltaMaxPeakAct: _propTypes2.default.func.isRequired,
  addCylicVoltaMinPeakAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ViewerMulti);