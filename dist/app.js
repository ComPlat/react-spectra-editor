"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FN", {
  enumerable: true,
  get: function get() {
    return _fn.default;
  }
});
exports.SpectraEditor = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
require("regenerator-runtime/runtime");
var _reduxSaga = _interopRequireDefault(require("redux-saga"));
var _index = _interopRequireDefault(require("./reducers/index"));
var _index2 = _interopRequireDefault(require("./sagas/index"));
var _layer_init = _interopRequireDefault(require("./layer_init"));
var _fn = _interopRequireDefault(require("./fn"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/function-component-definition, react/require-default-props */

// eslint-disable-line

// import { logger } from 'redux-logger';

// - - - store & middleware - - -
const sagaMiddleware = (0, _reduxSaga.default)();
const middlewares = [sagaMiddleware]; // logger

const store = (0, _redux.compose)((0, _redux.applyMiddleware)(...middlewares))(_redux.createStore)(_index.default);
sagaMiddleware.run(_index2.default);

// - - - helper - - -
const ensureQuillDelta = descs => {
  const isArr = Array.isArray(descs);
  return isArr ? descs : [{
    insert: descs
  }];
};

// - - - React - - -
const SpectraEditor = _ref => {
  let {
    entity,
    others,
    cLabel,
    xLabel,
    yLabel,
    operations,
    forecast,
    molSvg,
    editorOnly,
    descriptions,
    exactMass,
    canChangeDescription,
    onDescriptionChanged,
    multiEntities,
    multiMolSvgs,
    entityFileNames,
    userManualLink
  } = _ref;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRedux.Provider, {
    store: store,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.StyledEngineProvider, {
      injectFirst: true,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_layer_init.default, {
        entity: entity,
        multiEntities: multiEntities,
        entityFileNames: entityFileNames,
        userManualLink: userManualLink,
        others: others,
        cLabel: cLabel,
        xLabel: xLabel,
        yLabel: yLabel,
        forecast: forecast,
        operations: operations,
        descriptions: ensureQuillDelta(descriptions),
        molSvg: molSvg,
        multiMolSvgs: multiMolSvgs,
        editorOnly: editorOnly,
        exactMass: exactMass,
        canChangeDescription: canChangeDescription,
        onDescriptionChanged: onDescriptionChanged
      })
    })
  });
};
exports.SpectraEditor = SpectraEditor;
SpectraEditor.propTypes = {
  entity: _propTypes.default.object.isRequired,
  multiEntities: _propTypes.default.array,
  entityFileNames: _propTypes.default.array,
  others: _propTypes.default.object,
  cLabel: _propTypes.default.string,
  xLabel: _propTypes.default.string,
  yLabel: _propTypes.default.string,
  forecast: _propTypes.default.object,
  operations: _propTypes.default.array,
  descriptions: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
  molSvg: _propTypes.default.string,
  multiMolSvgs: _propTypes.default.array,
  editorOnly: _propTypes.default.bool,
  canChangeDescription: _propTypes.default.bool,
  onDescriptionChanged: _propTypes.default.func,
  userManualLink: _propTypes.default.object,
  exactMass: _propTypes.default.string
};
SpectraEditor.defaultProps = {
  others: {
    others: [],
    addOthersCb: false
  },
  multiEntities: false,
  entityFileNames: false,
  cLabel: '',
  xLabel: '',
  yLabel: '',
  forecast: {},
  operations: [],
  descriptions: [],
  molSvg: '',
  exactMass: '',
  multiMolSvgs: [],
  editorOnly: false,
  canChangeDescription: false,
  userManualLink: {}
};