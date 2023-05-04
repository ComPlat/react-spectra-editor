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

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _styles = require('@material-ui/core/styles');

var _index = require('./panel/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./cmd_bar/index');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./d3_multi/index');

var _index6 = _interopRequireDefault(_index5);

var _curve = require('../actions/curve');

var _cyclic_voltammetry = require('../actions/cyclic_voltammetry');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = function styles() {
  return {
    root: {
      flexGrow: 1
    },
    appBar: {
      backgroundColor: '#fff',
      boxShadow: 'none'
    },
    tabLabel: {
      fontSize: '14px'
    }
  };
};

var seperatingSubLayout = function seperatingSubLayout(entities, featureCondition) {
  var storedDict = {};
  entities.forEach(function (entity) {
    var feature = entity.feature;

    var keyValue = feature[featureCondition];
    if (keyValue in storedDict) {
      storedDict[keyValue].push(entity);
    } else {
      storedDict[keyValue] = [entity];
    }
  });
  return Object.assign({}, storedDict);
};

var MultiJcampsViewer = function (_React$Component) {
  _inherits(MultiJcampsViewer, _React$Component);

  function MultiJcampsViewer(props) {
    _classCallCheck(this, MultiJcampsViewer);

    return _possibleConstructorReturn(this, (MultiJcampsViewer.__proto__ || Object.getPrototypeOf(MultiJcampsViewer)).call(this, props));
  }

  _createClass(MultiJcampsViewer, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          classes = _props.classes,
          curvSt = _props.curvSt,
          operations = _props.operations,
          entityFileNames = _props.entityFileNames,
          entities = _props.entities,
          userManualLink = _props.userManualLink;

      if (!entities || entities.length === 0) return _react2.default.createElement('div', null);

      var seperatedSubLayouts = seperatingSubLayout(entities, 'xUnit');
      var entity = entities[curvSt.curveIdx];
      var feature = entity.feature,
          topic = entity.topic,
          molSvg = entity.molSvg;


      return _react2.default.createElement(
        'div',
        { className: classes.root },
        _react2.default.createElement(_index4.default, {
          feature: feature,
          operations: operations,
          editorOnly: true,
          hideThreshold: true
        }),
        _react2.default.createElement(
          'div',
          { className: 'react-spectrum-editor' },
          _react2.default.createElement(
            _Grid2.default,
            { container: true },
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 9 },
              _react2.default.createElement(_index6.default, {
                entities: entities,
                topic: topic,
                xLabel: feature.xUnit,
                yLabel: feature.yUnit,
                feature: feature
              })
            ),
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 3, align: 'center' },
              _react2.default.createElement(_index2.default, {
                jcampIdx: curvSt.curveIdx,
                entityFileNames: entityFileNames,
                userManualLink: userManualLink,
                feature: feature,
                molSvg: molSvg,
                subLayoutsInfo: seperatedSubLayouts,
                descriptions: '',
                canChangeDescription: function canChangeDescription() {},
                onDescriptionChanged: function onDescriptionChanged() {}
              })
            )
          )
        )
      );
    }
  }]);

  return MultiJcampsViewer;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, _) {
  return (// eslint-disable-line
    {
      curvSt: state.curve,
      cyclicVoltaSt: state.cyclicvolta,
      entities: state.curve.listCurves
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setAllCurvesAct: _curve.setAllCurves,
    addNewCylicVoltaPairPeakAct: _cyclic_voltammetry.addNewCylicVoltaPairPeak,
    addCylicVoltaMaxPeakAct: _cyclic_voltammetry.addCylicVoltaMaxPeak,
    addCylicVoltaMinPeakAct: _cyclic_voltammetry.addCylicVoltaMinPeak,
    addCylicVoltaPeckerAct: _cyclic_voltammetry.addCylicVoltaPecker
  }, dispatch);
};

MultiJcampsViewer.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  multiEntities: _propTypes2.default.array.isRequired,
  entityFileNames: _propTypes2.default.array.isRequired,
  molSvg: _propTypes2.default.string.isRequired,
  setAllCurvesAct: _propTypes2.default.func.isRequired,
  curvSt: _propTypes2.default.object.isRequired,
  cyclicVoltaSt: _propTypes2.default.object.isRequired,
  addNewCylicVoltaPairPeakAct: _propTypes2.default.func.isRequired,
  addCylicVoltaMaxPeakAct: _propTypes2.default.func.isRequired,
  addCylicVoltaMinPeakAct: _propTypes2.default.func.isRequired,
  operations: _propTypes2.default.func.isRequired,
  userManualLink: _propTypes2.default.object
};

MultiJcampsViewer.defaultProps = {
  multiEntities: [],
  entityFileNames: [],
  molSvg: '',
  cLabel: '',
  xLabel: '',
  yLabel: '',
  entities: []
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(MultiJcampsViewer);