'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _styles = require('@material-ui/core/styles');

var _submit = require('./actions/submit');

var _manager = require('./actions/manager');

var _meta = require('./actions/meta');

var _jcamp = require('./actions/jcamp');

var _layer_prism = require('./layer_prism');

var _layer_prism2 = _interopRequireDefault(_layer_prism);

var _format = require('./helpers/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = function styles() {
  return {};
};

var LayerInit = function (_React$Component) {
  _inherits(LayerInit, _React$Component);

  function LayerInit(props) {
    _classCallCheck(this, LayerInit);

    var _this = _possibleConstructorReturn(this, (LayerInit.__proto__ || Object.getPrototypeOf(LayerInit)).call(this, props));

    _this.normChange = _this.normChange.bind(_this);
    _this.execReset = _this.execReset.bind(_this);
    _this.initReducer = _this.initReducer.bind(_this);
    _this.updateOthers = _this.updateOthers.bind(_this);
    return _this;
  }

  _createClass(LayerInit, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.execReset();
      this.initReducer();
      this.updateOthers();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.normChange(prevProps);
      this.updateOthers();
    }
  }, {
    key: 'normChange',
    value: function normChange(prevProps) {
      var prevFeatures = prevProps.entity.features;
      var prevPeak = prevFeatures.editPeak || prevFeatures.autoPeak;
      var entity = this.props.entity;

      var nextFeatures = entity.features;
      var nextPeak = nextFeatures.editPeak || nextFeatures.autoPeak;

      if (prevPeak !== nextPeak) {
        this.execReset();
      }
    }
  }, {
    key: 'execReset',
    value: function execReset() {
      var _props = this.props,
          entity = _props.entity,
          updateMetaPeaksAct = _props.updateMetaPeaksAct,
          resetInitCommonAct = _props.resetInitCommonAct,
          resetInitMsAct = _props.resetInitMsAct,
          resetInitNmrAct = _props.resetInitNmrAct,
          resetInitCommonWithIntergationAct = _props.resetInitCommonWithIntergationAct;

      resetInitCommonAct();
      var layout = entity.layout,
          features = entity.features;

      if (_format2.default.isMsLayout(layout)) {
        // const { autoPeak, editPeak } = features; // TBD
        var autoPeak = features.autoPeak || features[0];
        var editPeak = features.editPeak || features[0];
        var baseFeat = editPeak || autoPeak;
        resetInitMsAct(baseFeat);
      }
      if (_format2.default.isNmrLayout(layout)) {
        var integration = features.integration,
            multiplicity = features.multiplicity,
            simulation = features.simulation;

        updateMetaPeaksAct(entity);
        resetInitNmrAct({
          integration: integration, multiplicity: multiplicity, simulation: simulation
        });
      } else if (_format2.default.isUvVisLayout(layout)) {
        var _integration = features.integration;

        updateMetaPeaksAct(entity);
        resetInitCommonWithIntergationAct({
          integration: _integration
        });
      }
    }
  }, {
    key: 'initReducer',
    value: function initReducer() {
      var _props2 = this.props,
          operations = _props2.operations,
          updateOperationAct = _props2.updateOperationAct;

      updateOperationAct(operations[0]);
    }
  }, {
    key: 'updateOthers',
    value: function updateOthers() {
      var _props3 = this.props,
          others = _props3.others,
          addOthersAct = _props3.addOthersAct;

      addOthersAct(others);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          entity = _props4.entity,
          cLabel = _props4.cLabel,
          xLabel = _props4.xLabel,
          yLabel = _props4.yLabel,
          forecast = _props4.forecast,
          operations = _props4.operations,
          descriptions = _props4.descriptions,
          molSvg = _props4.molSvg,
          editorOnly = _props4.editorOnly,
          canChangeDescription = _props4.canChangeDescription,
          onDescriptionChanged = _props4.onDescriptionChanged;

      var target = entity.spectra[0];

      var xxLabel = !xLabel && xLabel === '' ? 'X (' + target.xUnit + ')' : xLabel;
      var yyLabel = !yLabel && yLabel === '' ? 'Y (' + target.yUnit + ')' : yLabel;

      return _react2.default.createElement(_layer_prism2.default, {
        entity: entity,
        cLabel: cLabel,
        xLabel: xxLabel,
        yLabel: yyLabel,
        forecast: forecast,
        operations: operations,
        descriptions: descriptions,
        molSvg: molSvg,
        editorOnly: editorOnly,
        canChangeDescription: canChangeDescription,
        onDescriptionChanged: onDescriptionChanged
      });
    }
  }]);

  return LayerInit;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {}
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    resetInitCommonAct: _manager.resetInitCommon,
    resetInitNmrAct: _manager.resetInitNmr,
    resetInitMsAct: _manager.resetInitMs,
    resetInitCommonWithIntergationAct: _manager.resetInitCommonWithIntergation,
    updateOperationAct: _submit.updateOperation,
    updateMetaPeaksAct: _meta.updateMetaPeaks,
    addOthersAct: _jcamp.addOthers
  }, dispatch);
};

LayerInit.propTypes = {
  entity: _propTypes2.default.object.isRequired,
  others: _propTypes2.default.object.isRequired,
  cLabel: _propTypes2.default.string.isRequired,
  xLabel: _propTypes2.default.string.isRequired,
  yLabel: _propTypes2.default.string.isRequired,
  molSvg: _propTypes2.default.string.isRequired,
  editorOnly: _propTypes2.default.bool.isRequired,
  forecast: _propTypes2.default.object.isRequired,
  operations: _propTypes2.default.array.isRequired,
  descriptions: _propTypes2.default.array.isRequired,
  resetInitCommonAct: _propTypes2.default.func.isRequired,
  resetInitNmrAct: _propTypes2.default.func.isRequired,
  resetInitMsAct: _propTypes2.default.func.isRequired,
  resetInitCommonWithIntergationAct: _propTypes2.default.func.isRequired,
  updateOperationAct: _propTypes2.default.func.isRequired,
  updateMetaPeaksAct: _propTypes2.default.func.isRequired,
  addOthersAct: _propTypes2.default.func.isRequired,
  canChangeDescription: _propTypes2.default.bool.isRequired,
  onDescriptionChanged: _propTypes2.default.func
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(LayerInit));