'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractPeaksEdit = undefined;

var _converter = require('./converter');

var _chem = require('./chem');

var _shift = require('./shift');

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var niOffset = function niOffset(shiftSt) {
  var ref = shiftSt.ref,
      peak = shiftSt.peak;

  var offset = (0, _shift.FromManualToOffset)(ref, peak);
  return offset;
};

var msOffset = function msOffset() {
  return 0;
};

var extractPeaksEdit = function extractPeaksEdit(feature, editPeakSt, thresSt, shiftSt, layoutSt) {
  var offset = _format2.default.isMsLayout(layoutSt) ? msOffset() : niOffset(shiftSt);
  var peaks = (0, _chem.Convert2Peak)(feature, thresSt.value, offset);
  var peaksEdit = (0, _converter.PksEdit)(peaks, editPeakSt);
  return peaksEdit;
};

exports.extractPeaksEdit = extractPeaksEdit; // eslint-disable-line