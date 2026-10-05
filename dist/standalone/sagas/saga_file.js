"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("base-64"));
var _effects = require("redux-saga/effects");
var _app = require("../../app");
var _action_type = require("../constants/action_type");
var _util_file = require("../utils/util_file");
var _fetcher_file = _interopRequireDefault(require("../fetchers/fetcher_file"));
function* analysisFile(action) {
  const {
    payload
  } = action;
  const {
    file
  } = payload;
  const isValidExt = (0, _util_file.VerifyJcampExt)(file) || (0, _util_file.VerifyMsExt)(file);
  const isValidSize = (0, _util_file.VerifySize)(file);
  if (isValidExt && isValidSize) {
    yield (0, _effects.put)({
      type: _action_type.FILE.ADD_DONE,
      payload
    });
  } else {
    yield (0, _effects.put)({
      type: _action_type.FILE.ADD_FAIL,
      payload
    });
  }
}
const getFileSrc = state => state.file.src;
const getMolMass = state => state.mol.mass;
const getMolSrc = state => state.mol.src;
function* convertFile(action) {
  const {
    payload
  } = action;
  const file = payload.file || (yield (0, _effects.select)(getFileSrc));
  const mass = payload.file || (yield (0, _effects.select)(getMolMass));
  const mol = yield (0, _effects.select)(getMolSrc);
  const rsp = yield (0, _effects.call)(_fetcher_file.default.convertFile, {
    file,
    mass,
    mol
  });
  if (rsp && rsp.status) {
    const {
      jcamp,
      img,
      listJcamps
    } = rsp;
    if (jcamp) {
      const origData = _base.default.decode(jcamp);
      const jcampData = _app.FN.ExtractJcamp(origData);
      const dst = new File([origData], 'dst.jcamp');
      yield (0, _effects.put)({
        type: _action_type.FILE.CONVERT_DONE,
        payload: {
          file,
          img,
          jcamp: jcampData,
          dst
        }
      });
    } else if (listJcamps) {
      const jcampList = listJcamps.map(itemJcamp => {
        const origData = _base.default.decode(itemJcamp);
        const jcampData = _app.FN.ExtractJcamp(origData);
        return jcampData;
      });
      const dstList = listJcamps.map((itemJcamp, idx) => {
        const origData = _base.default.decode(itemJcamp);
        const dst = new File([origData], `dst_${idx}.jcamp`);
        return dst;
      });
      yield (0, _effects.put)({
        type: _action_type.FILE.CONVERT_DONE,
        payload: {
          file,
          jcampList,
          dstList
        }
      });
    } else {
      yield (0, _effects.put)({
        type: _action_type.FILE.CONVERT_FAIL,
        payload
      });
    }
  } else {
    yield (0, _effects.put)({
      type: _action_type.FILE.CONVERT_FAIL,
      payload
    });
  }
}
const getFileDst = state => state.file.dst;
const getListFileDst = state => state.file.dstList;
function* saveFile(action) {
  const {
    payload
  } = action;
  const src = yield (0, _effects.select)(getFileSrc);
  const dst = yield (0, _effects.select)(getFileDst);
  const mol = yield (0, _effects.select)(getMolSrc);
  const dstList = yield (0, _effects.select)(getListFileDst);
  const {
    name
  } = src;
  const filename = name.split('.').slice(0, -1).join('.');
  const target = {
    ...payload,
    src,
    dst,
    filename,
    mol,
    dstList
  };
  yield (0, _effects.call)(_fetcher_file.default.saveFile, target);
  yield (0, _effects.put)({
    type: _action_type.FILE.SAVE_DONE
  });
}
function* refreshFile(action) {
  // similar to saveFile
  const {
    payload
  } = action;
  const src = yield (0, _effects.select)(getFileSrc);
  const dst = yield (0, _effects.select)(getFileDst);
  const mol = yield (0, _effects.select)(getMolSrc);
  const {
    name
  } = src;
  const filename = name.split('.').slice(0, -1).join('.');
  const target = {
    ...payload,
    src,
    dst,
    filename,
    mol
  };

  // similar to convertFile
  const rsp = yield (0, _effects.call)(_fetcher_file.default.refreshFile, target);
  if (rsp && rsp.status) {
    const {
      jcamp,
      img
    } = rsp;
    const origData = _base.default.decode(jcamp);
    const jcampData = _app.FN.ExtractJcamp(origData);
    const refreshedDst = new File([origData], 'dst.jcamp');
    yield (0, _effects.put)({
      type: _action_type.FILE.CONVERT_DONE,
      payload: {
        file: src,
        img,
        jcamp: jcampData,
        dst: refreshedDst
      }
    });
  } else {
    yield (0, _effects.put)({
      type: _action_type.FILE.CONVERT_FAIL,
      payload
    });
  }
}
const fileSagas = [(0, _effects.takeEvery)(_action_type.FILE.ADD_INIT, analysisFile), (0, _effects.takeEvery)(_action_type.FORM.SUBMIT, convertFile), (0, _effects.takeEvery)(_action_type.FILE.SAVE_INIT, saveFile), (0, _effects.takeEvery)(_action_type.FILE.REFRESH_INIT, refreshFile)];
var _default = exports.default = fileSagas;