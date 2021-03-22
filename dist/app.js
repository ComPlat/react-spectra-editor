'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FN = exports.SpectraEditor = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('regenerator-runtime/runtime');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _index = require('./reducers/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./sagas/index');

var _index4 = _interopRequireDefault(_index3);

var _layer_init = require('./layer_init');

var _layer_init2 = _interopRequireDefault(_layer_init);

var _fn = require('./fn');

var _fn2 = _interopRequireDefault(_fn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// - - - store & middleware - - -

// import { logger } from 'redux-logger';

var sagaMiddleware = (0, _reduxSaga2.default)(); // eslint-disable-line

var middlewares = [sagaMiddleware]; // logger

var store = (0, _redux.compose)(_redux.applyMiddleware.apply(undefined, middlewares))(_redux.createStore)(_index2.default);

sagaMiddleware.run(_index4.default);

// - - - helper - - -
var ensureQuillDelta = function ensureQuillDelta(descs) {
  var isArr = Array.isArray(descs);
  return isArr ? descs : [{ insert: descs }];
};

// - - - React - - -
var SpectraEditor = function SpectraEditor(_ref) {
  var entity = _ref.entity,
      others = _ref.others,
      cLabel = _ref.cLabel,
      xLabel = _ref.xLabel,
      yLabel = _ref.yLabel,
      operations = _ref.operations,
      forecast = _ref.forecast,
      molSvg = _ref.molSvg,
      editorOnly = _ref.editorOnly,
      descriptions = _ref.descriptions,
      canChangeDescription = _ref.canChangeDescription,
      onDescriptionChanged = _ref.onDescriptionChanged;
  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(_layer_init2.default, {
      entity: entity,
      others: others,
      cLabel: cLabel,
      xLabel: xLabel,
      yLabel: yLabel,
      forecast: forecast,
      operations: operations,
      descriptions: ensureQuillDelta(descriptions),
      molSvg: molSvg,
      editorOnly: editorOnly,
      canChangeDescription: canChangeDescription,
      onDescriptionChanged: onDescriptionChanged
    })
  );
};

SpectraEditor.propTypes = {
  entity: _propTypes2.default.object.isRequired,
  others: _propTypes2.default.object,
  cLabel: _propTypes2.default.string,
  xLabel: _propTypes2.default.string,
  yLabel: _propTypes2.default.string,
  forecast: _propTypes2.default.object,
  operations: _propTypes2.default.array,
  descriptions: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
  molSvg: _propTypes2.default.string,
  editorOnly: _propTypes2.default.bool,
  canChangeDescription: _propTypes2.default.bool,
  onDescriptionChanged: _propTypes2.default.func
};

SpectraEditor.defaultProps = {
  others: { others: [], addOthersCb: false },
  cLabel: '',
  xLabel: '',
  yLabel: '',
  forecast: {},
  operations: [],
  descriptions: [],
  molSvg: '',
  editorOnly: false,
  canChangeDescription: false
};

exports.SpectraEditor = SpectraEditor;
exports.FN = _fn2.default;