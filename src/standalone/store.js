import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers/index';
import sagas from './sagas/index';

// A fresh store with its saga running. Nothing here runs at import time, so
// importing the standalone client has no side effects until it first renders.
const createClientStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = compose(
    applyMiddleware(sagaMiddleware),
  )(createStore)(reducers);
  sagaMiddleware.run(sagas);
  return store;
};

export default createClientStore; // eslint-disable-line
