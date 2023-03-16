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
  var metaSt, mpySt, _action$payload, newData, curveIdx, multiplicities, selectedMulti, xExtent, yExtent, dataPks, _selectedMulti, shift, stack, xL, xU, yL, yU, peaks, newXExtemt, coupling, m, newStack, newSelectedMulti, payload;

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
          _action$payload = action.payload, newData = _action$payload.newData, curveIdx = _action$payload.curveIdx;
          multiplicities = mpySt.multiplicities;
          selectedMulti = multiplicities[curveIdx];

          if (selectedMulti === false || selectedMulti === undefined) {
            selectedMulti = {
              stack: [],
              shift: 0,
              smExtext: false,
              edited: false
            };
          }

          xExtent = newData.xExtent, yExtent = newData.yExtent, dataPks = newData.dataPks;
          _selectedMulti = selectedMulti, shift = _selectedMulti.shift, stack = _selectedMulti.stack;
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
          newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack, smExtext: newXExtemt });

          multiplicities[curveIdx] = newSelectedMulti;

          payload = Object.assign({}, mpySt, { multiplicities: multiplicities, selectedIdx: curveIdx });
          _context.next = 25;
          return (0, _effects.put)({
            type: _action_type.UI.SWEEP.SELECT_MULTIPLICITY_RDC,
            payload: payload
          });

        case 25:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

function addUiPeakToStack(action) {
  var metaSt, mpySt, selectedIdx, multiplicities, selectedMulti, shift, stack, smExtext, _action$payload2, x, y, newPeak, xL, xU, isDuplicate, newStack, newSelectedMulti, payload;

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
          selectedIdx = mpySt.selectedIdx, multiplicities = mpySt.multiplicities;
          selectedMulti = multiplicities[selectedIdx];
          shift = selectedMulti.shift, stack = selectedMulti.stack, smExtext = selectedMulti.smExtext;
          _action$payload2 = action.payload, x = _action$payload2.x, y = _action$payload2.y; // eslint-disable-line

          if (!(!x || !y)) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt('return');

        case 12:

          x += shift;
          newPeak = { x: x, y: y };
          xL = smExtext.xL, xU = smExtext.xU;

          if (!(x < xL || xU < x)) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt('return');

        case 17:
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
            _context2.next = 21;
            break;
          }

          return _context2.abrupt('return');

        case 21:
          newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack });

          multiplicities[selectedIdx] = newSelectedMulti;

          payload = Object.assign({}, mpySt, { multiplicities: multiplicities });
          _context2.next = 26;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.PEAK_ADD_BY_UI_RDC,
            payload: payload
          });

        case 26:
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
  var selectedIdx = mpySt.selectedIdx,
      multiplicities = mpySt.multiplicities;

  var selectedMulti = multiplicities[selectedIdx];

  var stack = selectedMulti.stack;

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

  if (newStack.length === 0) {
    var _newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack, smExtext: false });
    multiplicities[selectedIdx] = _newSelectedMulti;
    return Object.assign({}, mpySt, { multiplicities: multiplicities });
  }
  var noSmExtext = newStack.map(function (k) {
    return k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU ? 1 : 0;
  }).reduce(function (a, s) {
    return a + s;
  }) === 0;
  var newSmExtext = noSmExtext ? newStack[0].xExtent : xExtent;

  var newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack, smExtext: newSmExtext });
  multiplicities[selectedIdx] = newSelectedMulti;
  return Object.assign({}, mpySt, { multiplicities: multiplicities });
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
  var metaSt, mpySt, selectedIdx, multiplicities, selectedMulti, peak, xExtent, newAction, payload;
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
          selectedIdx = mpySt.selectedIdx, multiplicities = mpySt.multiplicities;
          selectedMulti = multiplicities[selectedIdx];
          peak = action.payload;
          xExtent = selectedMulti.smExtext;
          newAction = Object.assign({}, action, { payload: { peak: peak, xExtent: xExtent } });
          payload = rmPeakFromStack(newAction, metaSt, mpySt);
          _context4.next = 14;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.PEAK_RM_BY_UI_RDC,
            payload: payload
          });

        case 14:
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
  var xExtent, metaSt, mpySt, selectedIdx, multiplicities, selectedMulti, stack, newStack, newSelectedMulti, payload;
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
          selectedIdx = mpySt.selectedIdx, multiplicities = mpySt.multiplicities;
          selectedMulti = multiplicities[selectedIdx];
          stack = selectedMulti.stack;
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
          newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack });

          multiplicities[selectedIdx] = newSelectedMulti;

          payload = Object.assign({}, mpySt, { multiplicities: multiplicities });
          _context6.next = 16;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.RESET_ONE_RDC,
            payload: payload
          });

        case 16:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked6);
}

function selectMpyType(action) {
  var mpySt, metaSt, selectedIdx, multiplicities, selectedMulti, _action$payload4, mpyType, xExtent, stack, newStack, newSelectedMulti, payload;

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
          selectedIdx = mpySt.selectedIdx, multiplicities = mpySt.multiplicities;
          selectedMulti = multiplicities[selectedIdx];
          _action$payload4 = action.payload, mpyType = _action$payload4.mpyType, xExtent = _action$payload4.xExtent;
          stack = selectedMulti.stack;
          newStack = stack.map(function (k) {
            var isTargetStack = k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU;
            if (isTargetStack) return (0, _multiplicity_manual.calcMpyManual)(k, mpyType, metaSt);
            return k;
          });
          newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack });

          multiplicities[selectedIdx] = newSelectedMulti;

          payload = Object.assign({}, mpySt, { multiplicities: multiplicities });
          _context7.next = 16;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.TYPE_SELECT_RDC,
            payload: payload
          });

        case 16:
        case 'end':
          return _context7.stop();
      }
    }
  }, _marked7);
}

var multiplicitySagas = [(0, _effects.takeEvery)(_action_type.UI.SWEEP.SELECT_MULTIPLICITY, selectMpy), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.PEAK_ADD_BY_UI_SAG, addUiPeakToStack), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.PEAK_RM_BY_PANEL, rmPanelPeakFromStack), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.PEAK_RM_BY_UI, rmUiPeakFromStack), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.TYPE_SELECT, selectMpyType), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.RESET_ONE, resetOne), (0, _effects.takeEvery)(_action_type.MANAGER.RESET_INIT_NMR, resetInitNmr)];

exports.default = multiplicitySagas;