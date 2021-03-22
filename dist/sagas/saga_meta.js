'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

var _action_type = require('../constants/action_type');

var _peakInterval = require('../third_party/peakInterval');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(updateMetaPeaks);

function updateMetaPeaks(action) {
  var payload, _getPeakIntervals, intervalL, intervalR, _payload$spectra$, observeFrequency, data, deltaX;

  return regeneratorRuntime.wrap(function updateMetaPeaks$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          payload = action.payload;
          _getPeakIntervals = (0, _peakInterval.getPeakIntervals)(payload), intervalL = _getPeakIntervals.intervalL, intervalR = _getPeakIntervals.intervalR;
          _payload$spectra$ = payload.spectra[0], observeFrequency = _payload$spectra$.observeFrequency, data = _payload$spectra$.data;
          deltaX = Math.abs(data[0].x[0] - data[0].x[1]);
          _context.next = 6;
          return (0, _effects.put)({
            type: _action_type.META.UPDATE_PEAKS_RDC,
            payload: {
              peaks: {
                intervalL: intervalL, intervalR: intervalR, observeFrequency: observeFrequency, deltaX: deltaX
              }
            }
          });

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

var metaSagas = [(0, _effects.takeEvery)(_action_type.META.UPDATE_PEAKS, updateMetaPeaks)];

exports.default = metaSagas;