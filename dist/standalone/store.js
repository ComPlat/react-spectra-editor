"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _redux = require("redux");
var _reduxSaga = _interopRequireDefault(require("redux-saga"));
var _index = _interopRequireDefault(require("./reducers/index"));
var _index2 = _interopRequireDefault(require("./sagas/index"));
// A fresh store with its saga running. Nothing here runs at import time, so
// importing the standalone client has no side effects until it first renders.
const createClientStore = () => {
  const sagaMiddleware = (0, _reduxSaga.default)();
  const store = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore)(_index.default);
  sagaMiddleware.run(_index2.default);
  return store;
};
var _default = exports.default = createClientStore; // eslint-disable-line