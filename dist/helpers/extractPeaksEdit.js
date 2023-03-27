'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractAreaUnderCurve = exports.extractPeaksEdit = undefined;

var _converter = require('./converter');

var _chem = require('./chem');

var _shift = require('./shift');

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

var _integration = require('./integration');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var niOffset = function niOffset(shiftSt) {
  var atIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var shifts = shiftSt.shifts;

  var selectedShift = shifts[atIndex];
  if (!selectedShift) {
    return 0;
  }
  var ref = selectedShift.ref,
      peak = selectedShift.peak;

  var offset = (0, _shift.FromManualToOffset)(ref, peak);
  return offset;
};

var msOffset = function msOffset() {
  return 0;
};

var extractPeaksEdit = function extractPeaksEdit(feature, editPeakSt, thresSt, shiftSt, layoutSt) {
  var atIndex = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  var offset = _format2.default.isMsLayout(layoutSt) ? msOffset() : niOffset(shiftSt, atIndex);
  var peaks = (0, _chem.Convert2Peak)(feature, thresSt.value, offset);
  var peaksEdit = (0, _converter.PksEdit)(peaks, editPeakSt);
  return peaksEdit;
};

var getAUCValue = function getAUCValue(integrationSt, layoutSt) {
  var refArea = integrationSt.refArea,
      refFactor = integrationSt.refFactor,
      stack = integrationSt.stack;

  if (Array.isArray(stack) && stack.length > 0) {
    var data = stack.at(-1);
    var ignoreRef = _format2.default.isHplcUvVisLayout(layoutSt);
    return (0, _integration.calcArea)(data, refArea, refFactor, ignoreRef);
  }
  return 0;
};

var extractAreaUnderCurve = function extractAreaUnderCurve(allIntegrationSt, presentIntegrationSt, layoutSt) {
  if (_format2.default.isHplcUvVisLayout(layoutSt) && Array.isArray(allIntegrationSt) && presentIntegrationSt) {
    var results = [];
    allIntegrationSt.forEach(function (inte) {
      var aucVal = getAUCValue(inte, layoutSt);
      results.push(aucVal);
    });
    return results;
  }
  return null;
};

exports.extractPeaksEdit = extractPeaksEdit;
exports.extractAreaUnderCurve = extractAreaUnderCurve; // eslint-disable-line