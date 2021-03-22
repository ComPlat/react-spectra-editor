'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

var _action_type = require('../constants/action_type');

var _list_ui = require('../constants/list_ui');

var _list_layout = require('../constants/list_layout');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(selectUiSweep),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(scrollUiWheel),
    _marked3 = /*#__PURE__*/regeneratorRuntime.mark(clickUiTarget);

var getUiSt = function getUiSt(state) {
  return state.ui;
};

var calcPeaks = function calcPeaks(payload) {
  var xExtent = payload.xExtent,
      yExtent = payload.yExtent,
      dataPks = payload.dataPks;

  if (!dataPks) return [];
  var xL = xExtent.xL,
      xU = xExtent.xU;
  var yL = yExtent.yL,
      yU = yExtent.yU;

  var peaks = dataPks.filter(function (p) {
    return xL <= p.x && p.x <= xU && yL <= p.y && p.y <= yU;
  });
  return peaks;
};

function selectUiSweep(action) {
  var uiSt, payload, peaks, newPayload;
  return regeneratorRuntime.wrap(function selectUiSweep$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(getUiSt);

        case 2:
          uiSt = _context.sent;
          payload = action.payload;
          _context.t0 = uiSt.sweepType;
          _context.next = _context.t0 === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN ? 7 : _context.t0 === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET ? 10 : _context.t0 === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD ? 13 : _context.t0 === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD ? 16 : 25;
          break;

        case 7:
          _context.next = 9;
          return (0, _effects.put)({
            type: _action_type.UI.SWEEP.SELECT_ZOOMIN,
            payload: payload
          });

        case 9:
          return _context.abrupt('break', 26);

        case 10:
          _context.next = 12;
          return (0, _effects.put)({
            type: _action_type.UI.SWEEP.SELECT_ZOOMRESET,
            payload: payload
          });

        case 12:
          return _context.abrupt('break', 26);

        case 13:
          _context.next = 15;
          return (0, _effects.put)({
            type: _action_type.UI.SWEEP.SELECT_INTEGRATION,
            payload: payload
          });

        case 15:
          return _context.abrupt('break', 26);

        case 16:
          peaks = calcPeaks(payload); // eslint-disable-line

          if (!(peaks.length === 0)) {
            _context.next = 19;
            break;
          }

          return _context.abrupt('break', 26);

        case 19:
          newPayload = Object.assign({}, payload, { peaks: peaks }); // eslint-disable-line

          _context.next = 22;
          return (0, _effects.put)({
            type: _action_type.UI.SWEEP.SELECT_INTEGRATION,
            payload: newPayload
          });

        case 22:
          _context.next = 24;
          return (0, _effects.put)({
            type: _action_type.UI.SWEEP.SELECT_MULTIPLICITY,
            payload: newPayload
          });

        case 24:
          return _context.abrupt('break', 26);

        case 25:
          return _context.abrupt('break', 26);

        case 26:
          return _context.abrupt('return', null);

        case 27:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

var getLayoutSt = function getLayoutSt(state) {
  return state.layout;
};

function scrollUiWheel(action) {
  var layoutSt, payload, xExtent, yExtent, direction, yL, yU, yeL, yeU, scale, nextExtent, nyeL, nyeU, h, nytL, nytU;
  return regeneratorRuntime.wrap(function scrollUiWheel$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.select)(getLayoutSt);

        case 2:
          layoutSt = _context2.sent;
          payload = action.payload;
          xExtent = payload.xExtent, yExtent = payload.yExtent, direction = payload.direction;
          yL = yExtent.yL, yU = yExtent.yU;
          yeL = yL + (yU - yL) * 0.1, yeU = yU - (yU - yL) * 0.1;
          scale = direction ? 0.8 : 1.25;
          nextExtent = { xExtent: false, yExtent: false };
          nyeL = 0, nyeU = 1, h = 1, nytL = 0, nytU = 1;
          _context2.t0 = layoutSt;
          _context2.next = _context2.t0 === _list_layout.LIST_LAYOUT.IR ? 13 : _context2.t0 === _list_layout.LIST_LAYOUT.RAMAN ? 13 : _context2.t0 === _list_layout.LIST_LAYOUT.MS ? 20 : _context2.t0 === _list_layout.LIST_LAYOUT.UVVIS ? 27 : _context2.t0 === _list_layout.LIST_LAYOUT.TGA ? 27 : 27;
          break;

        case 13:
          nyeL = yeL + (yeU - yeL) * (1 - scale);
          nyeU = yeU;

          h = nyeU - nyeL;
          nytL = nyeL - 0.125 * h;
          nytU = nyeU + 0.125 * h;

          nextExtent = { xExtent: xExtent, yExtent: { yL: nytL, yU: nytU } };
          return _context2.abrupt('break', 34);

        case 20:
          nyeL = 0;
          nyeU = yeL + (yeU - yeL) * scale;

          h = nyeU - nyeL;
          nytL = nyeL - 0.125 * h;
          nytU = nyeU + 0.125 * h;

          nextExtent = { xExtent: xExtent, yExtent: { yL: nytL, yU: nytU } };
          return _context2.abrupt('break', 34);

        case 27:
          nyeL = yeL;
          nyeU = yeL + (yeU - yeL) * scale;

          h = nyeU - nyeL;
          nytL = nyeL - 0.125 * h;
          nytU = nyeU + 0.125 * h;

          nextExtent = { xExtent: xExtent, yExtent: { yL: nytL, yU: nytU } };
          return _context2.abrupt('break', 34);

        case 34:
          _context2.next = 36;
          return (0, _effects.put)({
            type: _action_type.UI.SWEEP.SELECT_ZOOMIN,
            payload: nextExtent
          });

        case 36:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2);
}

var getUiSweepType = function getUiSweepType(state) {
  return state.ui.sweepType;
};

function clickUiTarget(action) {
  var payload, onPeak, uiSweepType, xExtent, xL, xU;
  return regeneratorRuntime.wrap(function clickUiTarget$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          payload = action.payload, onPeak = action.onPeak;
          _context3.next = 3;
          return (0, _effects.select)(getUiSweepType);

        case 3:
          uiSweepType = _context3.sent;

          if (!(uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_ADD && !onPeak)) {
            _context3.next = 9;
            break;
          }

          _context3.next = 7;
          return (0, _effects.put)({
            type: _action_type.EDITPEAK.ADD_POSITIVE,
            payload: payload
          });

        case 7:
          _context3.next = 54;
          break;

        case 9:
          if (!(uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_DELETE && onPeak)) {
            _context3.next = 14;
            break;
          }

          _context3.next = 12;
          return (0, _effects.put)({
            type: _action_type.EDITPEAK.ADD_NEGATIVE,
            payload: payload
          });

        case 12:
          _context3.next = 54;
          break;

        case 14:
          if (!(uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT && onPeak)) {
            _context3.next = 19;
            break;
          }

          _context3.next = 17;
          return (0, _effects.put)({
            type: _action_type.SHIFT.SET_PEAK,
            payload: payload
          });

        case 17:
          _context3.next = 54;
          break;

        case 19:
          if (!(uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_RM && onPeak)) {
            _context3.next = 24;
            break;
          }

          _context3.next = 22;
          return (0, _effects.put)({
            type: _action_type.INTEGRATION.RM_ONE,
            payload: payload
          });

        case 22:
          _context3.next = 54;
          break;

        case 24:
          if (!(uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM && onPeak)) {
            _context3.next = 29;
            break;
          }

          _context3.next = 27;
          return (0, _effects.put)({
            type: _action_type.INTEGRATION.RM_ONE,
            payload: payload
          });

        case 27:
          _context3.next = 54;
          break;

        case 29:
          if (!(uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF && onPeak)) {
            _context3.next = 34;
            break;
          }

          _context3.next = 32;
          return (0, _effects.put)({
            type: _action_type.INTEGRATION.SET_REF,
            payload: payload
          });

        case 32:
          _context3.next = 54;
          break;

        case 34:
          if (!(uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_CLICK && onPeak)) {
            _context3.next = 46;
            break;
          }

          xExtent = payload.xExtent, xL = payload.xL, xU = payload.xU;

          if (!xExtent) {
            _context3.next = 41;
            break;
          }

          _context3.next = 39;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.ONE_CLICK_BY_UI,
            payload: xExtent
          });

        case 39:
          _context3.next = 44;
          break;

        case 41:
          if (!(xL && xU)) {
            _context3.next = 44;
            break;
          }

          _context3.next = 44;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.ONE_CLICK_BY_UI,
            payload: { xL: xL, xU: xU }
          });

        case 44:
          _context3.next = 54;
          break;

        case 46:
          if (!(uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD)) {
            _context3.next = 51;
            break;
          }

          _context3.next = 49;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.PEAK_ADD_BY_UI_SAG,
            payload: payload
          });

        case 49:
          _context3.next = 54;
          break;

        case 51:
          if (!(uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM && onPeak)) {
            _context3.next = 54;
            break;
          }

          _context3.next = 54;
          return (0, _effects.put)({
            type: _action_type.MULTIPLICITY.PEAK_RM_BY_UI,
            payload: payload
          });

        case 54:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3);
}

var managerSagas = [(0, _effects.takeEvery)(_action_type.UI.CLICK_TARGET, clickUiTarget), (0, _effects.takeEvery)(_action_type.UI.SWEEP.SELECT, selectUiSweep), (0, _effects.takeEvery)(_action_type.UI.WHEEL.SCROLL, scrollUiWheel)];

exports.default = managerSagas;