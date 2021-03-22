'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

var _action_type = require('../constants/action_type');

var _multiplicity_calc = require('../helpers/multiplicity_calc');

var _multiplicity_manual = require('../helpers/multiplicity_manual');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(selectMpy),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(addUiPeakToStack),
    _marked3 = /*#__PURE__*/regeneratorRuntime.mark(rmPanelPeakFromStack),
    _marked4 = /*#__PURE__*/regeneratorRuntime.mark(rmUiPeakFromStack),
    _marked5 = /*#__PURE__*/regeneratorRuntime.mark(resetInitNmr),
    _marked6 = /*#__PURE__*/regeneratorRuntime.mark(resetOne),
    _marked7 = /*#__PURE__*/regeneratorRuntime.mark(selectMpyType);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getMetaSt = function getMetaSt(state) {
  return state.meta;
};

var getMultiplicitySt = function getMultiplicitySt(state) {
  return state.multiplicity.present;
};

function selectMpy(action) {
  var metaSt, mpySt, _action$payload, xExtent, yExtent, dataPks, shift, stack, xL, xU, yL, yU, peaks, newXExtemt, coupling, m, newStack, payload;

  return regeneratorRuntime.wrap(function selectMpy$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(getMetaSt);

        case 2:
          metaSt = _context.sent;
          _context.next = 5;
          return (0, _effects.select)(getMultiplicitySt);

        case 5:
          mpySt = _context.sent;
          _action$payload = action.payload, xExtent = _action$payload.xExtent, yExtent = _action$payload.yExtent, dataPks = _action$payload.dataPks;
          shift = mpySt.shift, stack = mpySt.stack;
          xL = xExtent.xL, xU = xExtent.xU;
          yL = yExtent.yL, yU = yExtent.yU;
          peaks = dataPks.filter(function (p) {
            return xL <= p.x && p.x <= xU && yL <= p.y && p.y <= yU;
          });

          peaks = peaks.map(function (pk) {
            return { x: pk.x + shift, y: pk.y };
          });
          newXExtemt = { xL: xL + shift, xU: xU + shift };
          coupling = (0, _multiplicity_calc.calcMpyCoup)(peaks, metaSt);
          m = {
            peaks: peaks,
            xExtent: newXExtemt,
            yExtent: yExtent,
            mpyType: coupling.type,
            js: coupling.js
          };
          newStack = [].concat(_toConsumableArray(stack), [m]);
          payload = Object.assign({}, mpySt, { stack: newStack, smExtext: newXExtemt });
          _context.next = 19;
          return (0, _effects.put)({
            type: _action_type.UI.SWEEP.SELECT_MULTIPLICITY_RDC,
            payload: payload
          });

        case 19:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

function addUiPeakToStack(action) {
  var metaSt, mpySt, shift, stack, smExtext, _action$payload2, x, y, newPeak, xL, xU, isDuplicate, newStack, payload;

  return regeneratorRuntime.wrap(function addUiPeakToStack$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.select)(getMetaSt);

        case 2:
          metaSt = _context2.sent;
          _context2.next = 5;
          return (0, _effects.select)(getMultiplicitySt);

        case 5:
          mpySt = _context2.sent;
          shift = mpySt.shift, stack = mpySt.stack, smExtext = mpySt.smExtext;
          _action$payload2 = action.payload, x = _action$payload2.x, y = _action$payload2.y; // eslint-disable-line

          if (!(!x || !y)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt('return');

        case 10:

          x += shift;
          newPeak = { x: x, y: y };
          xL = smExtext.xL, xU = smExtext.xU;

          if (!(x < xL || xU < x)) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt('return');

        case 15:
          isDuplicate = false;
          newStack = stack.map(function (k) {
            if (k.xExtent.xL === xL && k.xExtent.xU === xU) {
              var existXs = k.peaks.map(function (pk) {
                return pk.x;
              });
              if (existXs.indexOf(newPeak.x) >= 0) {
                isDuplicate = true;
                return k;
              }
              var newPks = [].concat(_toConsumableArray(k.peaks), [newPeak]);
              var coupling = (0, _multiplicity_calc.calcMpyCoup)(newPks, metaSt);
              return Object.assign({}, k, {
                peaks: newPks,
                mpyType: coupling.type,
                js: coupling.js
              });
            }
            return k;
          });

          if (!isDuplicate) {
            _context2.next = 19;
            break;
          }

          return _context2.abrupt('return');

        case 19:
          payload = Object.assign({}, mpySt, { stack: newStack });
          _context2.next = 22;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.PEAK_ADD_BY_UI_RDC,
            payload: payload
          });

        case 22:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2);
}

var rmPeakFromStack = function rmPeakFromStack(action, metaSt, mpySt) {
  var _action$payload3 = action.payload,
      peak = _action$payload3.peak,
      xExtent = _action$payload3.xExtent;
  var stack = mpySt.stack;

  var newStack = stack.map(function (k) {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      var newPks = k.peaks.filter(function (pk) {
        return pk.x !== peak.x;
      });
      var coupling = (0, _multiplicity_calc.calcMpyCoup)(newPks, metaSt);
      return Object.assign({}, k, {
        peaks: newPks,
        mpyType: coupling.type,
        js: coupling.js
      });
    }
    return k;
  });
  newStack = newStack.filter(function (k) {
    return k.peaks.length !== 0;
  });
  if (newStack.length === 0) return Object.assign({}, mpySt, { stack: newStack, smExtext: false });
  var noSmExtext = newStack.map(function (k) {
    return k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU ? 1 : 0;
  }).reduce(function (a, s) {
    return a + s;
  }) === 0;
  var newSmExtext = noSmExtext ? newStack[0].xExtent : xExtent;
  return Object.assign({}, mpySt, { stack: newStack, smExtext: newSmExtext });
};

function rmPanelPeakFromStack(action) {
  var metaSt, mpySt, payload;
  return regeneratorRuntime.wrap(function rmPanelPeakFromStack$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _effects.select)(getMetaSt);

        case 2:
          metaSt = _context3.sent;
          _context3.next = 5;
          return (0, _effects.select)(getMultiplicitySt);

        case 5:
          mpySt = _context3.sent;
          payload = rmPeakFromStack(action, metaSt, mpySt);
          _context3.next = 9;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.PEAK_RM_BY_PANEL_RDC,
            payload: payload
          });

        case 9:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3);
}

function rmUiPeakFromStack(action) {
  var metaSt, mpySt, peak, xExtent, newAction, payload;
  return regeneratorRuntime.wrap(function rmUiPeakFromStack$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _effects.select)(getMetaSt);

        case 2:
          metaSt = _context4.sent;
          _context4.next = 5;
          return (0, _effects.select)(getMultiplicitySt);

        case 5:
          mpySt = _context4.sent;
          peak = action.payload;
          xExtent = mpySt.smExtext;
          newAction = Object.assign({}, action, { payload: { peak: peak, xExtent: xExtent } });
          payload = rmPeakFromStack(newAction, metaSt, mpySt);
          _context4.next = 12;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.PEAK_RM_BY_UI_RDC,
            payload: payload
          });

        case 12:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4);
}

function resetInitNmr(action) {
  var multiplicity, mpySt;
  return regeneratorRuntime.wrap(function resetInitNmr$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          multiplicity = action.payload.multiplicity;
          _context5.next = 3;
          return (0, _effects.select)(getMultiplicitySt);

        case 3:
          mpySt = _context5.sent;

          if (!multiplicity) {
            _context5.next = 7;
            break;
          }

          _context5.next = 7;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.RESET_ALL_RDC,
            payload: Object.assign({}, mpySt, multiplicity)
          });

        case 7:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked5);
}

function resetOne(action) {
  var xExtent, metaSt, mpySt, stack, newStack, payload;
  return regeneratorRuntime.wrap(function resetOne$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          xExtent = action.payload;
          _context6.next = 3;
          return (0, _effects.select)(getMetaSt);

        case 3:
          metaSt = _context6.sent;
          _context6.next = 6;
          return (0, _effects.select)(getMultiplicitySt);

        case 6:
          mpySt = _context6.sent;
          stack = mpySt.stack;
          newStack = stack.map(function (k) {
            if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
              var peaks = k.peaks;

              var coupling = (0, _multiplicity_calc.calcMpyCoup)(peaks, metaSt);
              return Object.assign({}, k, {
                peaks: peaks,
                mpyType: coupling.type,
                js: coupling.js
              });
            }
            return k;
          });
          payload = Object.assign({}, mpySt, { stack: newStack });
          _context6.next = 12;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.RESET_ONE_RDC,
            payload: payload
          });

        case 12:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked6);
}

function selectMpyType(action) {
  var mpySt, metaSt, _action$payload4, mpyType, xExtent, stack, newStack;

  return regeneratorRuntime.wrap(function selectMpyType$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return (0, _effects.select)(getMultiplicitySt);

        case 2:
          mpySt = _context7.sent;
          _context7.next = 5;
          return (0, _effects.select)(getMetaSt);

        case 5:
          metaSt = _context7.sent;
          _action$payload4 = action.payload, mpyType = _action$payload4.mpyType, xExtent = _action$payload4.xExtent;
          stack = mpySt.stack;
          newStack = stack.map(function (k) {
            var isTargetStack = k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU;
            if (isTargetStack) return (0, _multiplicity_manual.calcMpyManual)(k, mpyType, metaSt);
            return k;
          });
          _context7.next = 11;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.TYPE_SELECT_RDC,
            payload: Object.assign({}, mpySt, { stack: newStack })
          });

        case 11:
        case 'end':
          return _context7.stop();
      }
    }
  }, _marked7);
}

var multiplicitySagas = [(0, _effects.takeEvery)(_action_type.UI.SWEEP.SELECT_MULTIPLICITY, selectMpy), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.PEAK_ADD_BY_UI_SAG, addUiPeakToStack), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.PEAK_RM_BY_PANEL, rmPanelPeakFromStack), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.PEAK_RM_BY_UI, rmUiPeakFromStack), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.TYPE_SELECT, selectMpyType), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.RESET_ONE, resetOne), (0, _effects.takeEvery)(_action_type.MANAGER.RESET_INIT_NMR, resetInitNmr)];

exports.default = multiplicitySagas;