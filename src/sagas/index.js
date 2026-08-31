import { all, spawn } from 'redux-saga/effects';
import editPeakSagas from './saga_edit_peak';
import managerSagas from './saga_manager';
import uiSagas from './saga_ui';
import metaSagas from './saga_meta';
import multiplicitySagas from './saga_multiplicity';
import multiEntitiesSagas from './saga_multi_entities';

const watchers = [
  ...editPeakSagas,
  ...managerSagas,
  ...uiSagas,
  ...metaSagas,
  ...multiplicitySagas,
  ...multiEntitiesSagas,
];

export default function* rootSaga() {
  // Each watcher gets its own spawn so an uncaught error in one (e.g. a
  // malformed action payload reaching a single reducer/saga) only kills
  // that watcher, instead of propagating up through `all` and cancelling
  // every other watcher in the app for the rest of the session.
  yield all(watchers.map((watcher) => spawn(function* isolate() {
    yield watcher;
  })));
}
