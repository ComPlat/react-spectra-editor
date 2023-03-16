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
        entities = _this$props.entities,
        clickUiTargetAct = _this$props.clickUiTargetAct,
        selectUiSweepAct = _this$props.selectUiSweepAct,
        scrollUiWheelAct = _this$props.scrollUiWheelAct;

    _this.rootKlass = ".d3Line";

    _this.focus = new _multi_focus2.default({
      W: W, H: H, entities: entities, clickUiTargetAct: clickUiTargetAct, selectUiSweepAct: selectUiSweepAct, scrollUiWheelAct: scrollUiWheelAct
    });

    _this.normChange = _this.normChange.bind(_this);
    return _this;
  }

  _createClass(ViewerMulti, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          curveSt = _props.curveSt,
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
          cyclicvoltaSt = _props.cyclicvoltaSt,
          integationSt = _props.integationSt,
          mtplySt = _props.mtplySt;


      (0, _draw.drawDestroy)(this.rootKlass);
      resetAllAct(feature);

      var filterSeed = seed;
      var filterPeak = peak;

      (0, _draw.drawMain)(this.rootKlass, W, H);
      this.focus.create({
        curveSt: curveSt,
        filterSeed: filterSeed,
        filterPeak: filterPeak,
        tTrEndPts: tTrEndPts,
        tSfPeaks: tSfPeaks,
        editPeakSt: editPeakSt,
        layoutSt: layoutSt,
        sweepExtentSt: sweepExtentSt,
        isUiNoBrushSt: isUiNoBrushSt,
        cyclicvoltaSt: cyclicvoltaSt,
        integationSt: integationSt,
        mtplySt: mtplySt
      });
      (0, _draw.drawLabel)(this.rootKlass, cLabel, xLabel, yLabel);
      (0, _draw.drawDisplay)(this.rootKlass, isHidden);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props2 = this.props,
          entities = _props2.entities,
          curveSt = _props2.curveSt,
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
          cyclicvoltaSt = _props2.cyclicvoltaSt,
          integationSt = _props2.integationSt,
          mtplySt = _props2.mtplySt;

      this.normChange(prevProps);

      var filterSeed = seed;
      var filterPeak = peak;

      this.focus.update({
        entities: entities,
        curveSt: curveSt,
        filterSeed: filterSeed,
        filterPeak: filterPeak,
        tTrEndPts: tTrEndPts,
        tSfPeaks: tSfPeaks,
        editPeakSt: editPeakSt,
        layoutSt: layoutSt,
        sweepExtentSt: sweepExtentSt,
        isUiNoBrushSt: isUiNoBrushSt,
        cyclicvoltaSt: cyclicvoltaSt,
        integationSt: integationSt,
        mtplySt: mtplySt
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
          resetAllAct = _props3.resetAllAct,
          entities = _props3.entities;

      var oldEntities = prevProps.entities;
      if (oldEntities !== entities) {
        resetAllAct(feature);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: 'd3Line' });
    }
  }]);

  return ViewerMulti;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    curveSt: state.curve,
    seed: (0, _chem.Topic2Seed)(state, props),
    peak: (0, _chem.Feature2Peak)(state, props),
    tTrEndPts: (0, _chem.ToThresEndPts)(state, props),
    tSfPeaks: (0, _chem.ToShiftPeaks)(state, props),
    editPeakSt: state.editPeak.present,
    layoutSt: state.layout,
    sweepExtentSt: state.ui.sweepExtent,
    isUiNoBrushSt: _list_ui.LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
    cyclicvoltaSt: state.cyclicvolta,
    maxminPeakSt: (0, _chem.Feature2MaxMinPeak)(state, props),
    integationSt: state.integration.present,
    mtplySt: state.multiplicity.present
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
  curveSt: _propTypes2.default.object.isRequired,
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
  integationSt: _propTypes2.default.object.isRequired,
  mtplySt: _propTypes2.default.object.isRequired,
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