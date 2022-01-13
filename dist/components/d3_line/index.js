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

var _line_focus = require('./line_focus');

var _line_focus2 = _interopRequireDefault(_line_focus);

var _draw = require('../common/draw');

var _list_ui = require('../../constants/list_ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
var H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

var ViewerLine = function (_React$Component) {
  _inherits(ViewerLine, _React$Component);

  function ViewerLine(props) {
    _classCallCheck(this, ViewerLine);

    var _this = _possibleConstructorReturn(this, (ViewerLine.__proto__ || Object.getPrototypeOf(ViewerLine)).call(this, props));

    var clickUiTargetAct = props.clickUiTargetAct,
        selectUiSweepAct = props.selectUiSweepAct,
        scrollUiWheelAct = props.scrollUiWheelAct;

    _this.rootKlass = '.d3Line';
    _this.focus = new _line_focus2.default({
      W: W, H: H, clickUiTargetAct: clickUiTargetAct, selectUiSweepAct: selectUiSweepAct, scrollUiWheelAct: scrollUiWheelAct
    });

    _this.normChange = _this.normChange.bind(_this);
    return _this;
  }

  _createClass(ViewerLine, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          seed = _props.seed,
          peak = _props.peak,
          cLabel = _props.cLabel,
          xLabel = _props.xLabel,
          yLabel = _props.yLabel,
          feature = _props.feature,
          freq = _props.freq,
          comparisons = _props.comparisons,
          tTrEndPts = _props.tTrEndPts,
          tSfPeaks = _props.tSfPeaks,
          editPeakSt = _props.editPeakSt,
          layoutSt = _props.layoutSt,
          integationSt = _props.integationSt,
          mtplySt = _props.mtplySt,
          sweepExtentSt = _props.sweepExtentSt,
          isUiAddIntgSt = _props.isUiAddIntgSt,
          isUiNoBrushSt = _props.isUiNoBrushSt,
          isHidden = _props.isHidden,
          wavelength = _props.wavelength,
          resetAllAct = _props.resetAllAct;

      (0, _draw.drawDestroy)(this.rootKlass);
      resetAllAct(feature);

      var filterSeed = seed;
      var filterPeak = peak;

      (0, _draw.drawMain)(this.rootKlass, W, H);
      this.focus.create({
        filterSeed: filterSeed,
        filterPeak: filterPeak,
        freq: freq,
        comparisons: comparisons,
        tTrEndPts: tTrEndPts,
        tSfPeaks: tSfPeaks,
        editPeakSt: editPeakSt,
        layoutSt: layoutSt,
        integationSt: integationSt,
        mtplySt: mtplySt,
        sweepExtentSt: sweepExtentSt,
        isUiAddIntgSt: isUiAddIntgSt,
        isUiNoBrushSt: isUiNoBrushSt,
        wavelength: wavelength
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
          freq = _props2.freq,
          comparisons = _props2.comparisons,
          tTrEndPts = _props2.tTrEndPts,
          tSfPeaks = _props2.tSfPeaks,
          editPeakSt = _props2.editPeakSt,
          layoutSt = _props2.layoutSt,
          integationSt = _props2.integationSt,
          mtplySt = _props2.mtplySt,
          sweepExtentSt = _props2.sweepExtentSt,
          isUiAddIntgSt = _props2.isUiAddIntgSt,
          isUiNoBrushSt = _props2.isUiNoBrushSt,
          isHidden = _props2.isHidden,
          wavelength = _props2.wavelength;

      this.normChange(prevProps);

      var filterSeed = seed;
      var filterPeak = peak;

      this.focus.update({
        filterSeed: filterSeed,
        filterPeak: filterPeak,
        freq: freq,
        comparisons: comparisons,
        tTrEndPts: tTrEndPts,
        tSfPeaks: tSfPeaks,
        editPeakSt: editPeakSt,
        layoutSt: layoutSt,
        integationSt: integationSt,
        mtplySt: mtplySt,
        sweepExtentSt: sweepExtentSt,
        isUiAddIntgSt: isUiAddIntgSt,
        isUiNoBrushSt: isUiNoBrushSt,
        wavelength: wavelength
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
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: 'd3Line' });
    }
  }]);

  return ViewerLine;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    seed: (0, _chem.Topic2Seed)(state, props),
    peak: (0, _chem.Feature2Peak)(state, props),
    freq: (0, _chem.ToFrequency)(state, props),
    comparisons: (0, _chem.GetComparisons)(state, props),
    tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
    tSfPeaks: (0, _chem.ToShiftPeaks)(state, props),
    editPeakSt: state.editPeak.present,
    layoutSt: state.layout,
    integationSt: state.integration.present,
    mtplySt: state.multiplicity.present,
    sweepExtentSt: state.ui.sweepExtent,
    isUiAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
    isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
    wavelength: state.wavelength
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    resetAllAct: _manager.resetAll,
    clickUiTargetAct: _ui.clickUiTarget,
    selectUiSweepAct: _ui.selectUiSweep,
    scrollUiWheelAct: _ui.scrollUiWheel
  }, dispatch);
};

ViewerLine.propTypes = {
  seed: _propTypes2.default.array.isRequired,
  peak: _propTypes2.default.array.isRequired,
  freq: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]).isRequired,
  comparisons: _propTypes2.default.array.isRequired,
  cLabel: _propTypes2.default.string.isRequired,
  xLabel: _propTypes2.default.string.isRequired,
  yLabel: _propTypes2.default.string.isRequired,
  feature: _propTypes2.default.object.isRequired,
  tTrEndPts: _propTypes2.default.array.isRequired,
  tSfPeaks: _propTypes2.default.array.isRequired,
  editPeakSt: _propTypes2.default.object.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  integationSt: _propTypes2.default.object.isRequired,
  mtplySt: _propTypes2.default.object.isRequired,
  sweepExtentSt: _propTypes2.default.object.isRequired,
  isUiAddIntgSt: _propTypes2.default.bool.isRequired,
  isUiNoBrushSt: _propTypes2.default.bool.isRequired,
  resetAllAct: _propTypes2.default.func.isRequired,
  clickUiTargetAct: _propTypes2.default.func.isRequired,
  selectUiSweepAct: _propTypes2.default.func.isRequired,
  scrollUiWheelAct: _propTypes2.default.func.isRequired,
  isHidden: _propTypes2.default.bool.isRequired,
  wavelength: _propTypes2.default.object.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ViewerLine);