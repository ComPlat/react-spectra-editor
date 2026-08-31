import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { CURVE, MANAGER } from '../../../constants/action_type';
import { ExtractJcamp } from '../../../helpers/chem';
import nmr1HJcamp from '../../fixtures/nmr1h_jcamp';

// A crash in one saga watcher must not cancel the other unrelated watchers
// for the rest of the session - see issue #329 (reducer_shift.js's
// resetEnable threw on an entity with no `operation` on its feature, which
// took down the entire root saga since `all([...watchers])` propagates a
// child task's uncaught error to every sibling).
jest.mock('../../../reducers/reducer_shift', () => {
  const actual = jest.requireActual('../../../reducers/reducer_shift');
  return {
    __esModule: true,
    default: (state: any, action: any) => {
      if (action.type === 'RESET_SHIFT' && action.payload && action.payload.__forceThrow) {
        throw new Error('synthetic saga-isolation test crash');
      }
      return actual.default(state, action);
    },
  };
});

// eslint-disable-next-line import/first, import/newline-after-import
import rootReducer from '../../../reducers/index';
// eslint-disable-next-line import/first
import rootSaga from '../../../sagas/index';

const buildStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware),
  );
  sagaMiddleware.run(rootSaga);
  return store;
};

describe('rootSaga watcher isolation (issue #329)', () => {
  it('one watcher throwing does not stop other watchers from working', () => {
    const store = buildStore();

    // Trigger the crashing watcher: saga_manager.js's resetShift is watched
    // via takeEvery(MANAGER.RESETALL, resetShift), which forwards payload
    // through to a RESET_SHIFT dispatch - our mocked reducer throws on it.
    expect(() => {
      store.dispatch({ type: MANAGER.RESETALL, payload: { __forceThrow: true } });
    }).not.toThrow();

    // A completely unrelated watcher (saga_multi_entities.js's
    // setInitIntegrations, watching CURVE.SET_ALL_CURVES) must still work
    // after the above crash.
    const entity: any = ExtractJcamp(nmr1HJcamp);
    expect(entity.features.integration).toBeTruthy();

    store.dispatch({ type: CURVE.SET_ALL_CURVES, payload: [entity] });

    const state: any = store.getState();
    expect(state.curve.listCurves.length).toEqual(1);
    expect(state.integration.present.integrations[0]).toEqual(entity.features.integration);
  });
});
