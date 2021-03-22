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

var _rect_focus = require('./rect_focus');

var _rect_focus2 = _interopRequireDefault(_rect_focus);

var _draw = require('../common/draw');

var _list_ui = require('../../constants/list_ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
var H = Math.round(window.innerHeight * 0.90 * 0.85); // ROI

var ViewerRect = function (_React$Component) {
  _inherits(ViewerRect, _React$Component);

  function ViewerRect(props) {
    _classCallCheck(this, ViewerRect);

    var _this = _possibleConstructorReturn(this, (ViewerRect.__proto__ || Object.getPrototypeOf(ViewerRect)).call(this, props));

    var clickUiTargetAct = props.clickUiTargetAct,
        selectUiSweepAct = props.selectUiSweepAct,
        scrollUiWheelAct = props.scrollUiWheelAct;

    _this.rootKlass = '.d3Rect';
    _this.focus = new _rect_focus2.default({
      W: W, H: H, clickUiTargetAct: clickUiTargetAct, selectUiSweepAct: selectUiSweepAct, scrollUiWheelAct: scrollUiWheelAct
    });

    _this.normChange = _this.normChange.bind(_this);
    return _this;
  }

  _createClass(ViewerRect, [{
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
          isHidden = _props.isHidden,
          sweepExtentSt = _props.sweepExtentSt,
          isUiAddIntgSt = _props.isUiAddIntgSt,
          isUiNoBrushSt = _props.isUiNoBrushSt,
          resetAllAct = _props.resetAllAct;

      (0, _draw.drawDestroy)(this.rootKlass);
      resetAllAct(feature);

      var filterSeed = seed;
      var filterPeak = peak;

      (0, _draw.drawMain)(this.rootKlass, W, H);
      this.focus.create({
        filterSeed: filterSeed,
        filterPeak: filterPeak,
        tTrEndPts: tTrEndPts,
        tSfPeaks: tSfPeaks,
        sweepExtentSt: sweepExtentSt,
        isUiAddIntgSt: isUiAddIntgSt,
        isUiNoBrushSt: isUiNoBrushSt
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
          tTrEndPts = _props2.tTrEndPts,
          tSfPeaks = _props2.tSfPeaks,
          isHidden = _props2.isHidden,
          sweepExtentSt = _props2.sweepExtentSt,
          isUiAddIntgSt = _props2.isUiAddIntgSt,
          isUiNoBrushSt = _props2.isUiNoBrushSt;

      this.normChange(prevProps);

      var filterSeed = seed;
      var filterPeak = peak;

      this.focus.update({
        filterSeed: filterSeed,
        filterPeak: filterPeak,
        tTrEndPts: tTrEndPts,
        tSfPeaks: tSfPeaks,
        sweepExtentSt: sweepExtentSt,
        isUiAddIntgSt: isUiAddIntgSt,
        isUiNoBrushSt: isUiNoBrushSt
      });
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
      return _react2.default.createElement('div', { className: 'd3Rect' });
    }
  }]);

  return ViewerRect;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    seed: (0, _chem.Topic2Seed)(state, props),
    peak: (0, _chem.Feature2Peak)(state, props),
    tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
    tSfPeaks: (0, _chem.ToShiftPeaks)(state, props),
    sweepExtentSt: state.ui.sweepExtent,
    isUiAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
    isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0
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

ViewerRect.propTypes = {
  seed: _propTypes2.default.array.isRequired,
  peak: _propTypes2.default.array.isRequired,
  cLabel: _propTypes2.default.string.isRequired,
  xLabel: _propTypes2.default.string.isRequired,
  yLabel: _propTypes2.default.string.isRequired,
  feature: _propTypes2.default.object.isRequired,
  tTrEndPts: _propTypes2.default.array.isRequired,
  tSfPeaks: _propTypes2.default.array.isRequired,
  sweepExtentSt: _propTypes2.default.object.isRequired,
  isUiAddIntgSt: _propTypes2.default.bool.isRequired,
  isUiNoBrushSt: _propTypes2.default.bool.isRequired,
  resetAllAct: _propTypes2.default.func.isRequired,
  clickUiTargetAct: _propTypes2.default.func.isRequired,
  selectUiSweepAct: _propTypes2.default.func.isRequired,
  scrollUiWheelAct: _propTypes2.default.func.isRequired,
  isHidden: _propTypes2.default.bool.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ViewerRect);