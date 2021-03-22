'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractParams = undefined;

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getScanIdx = function getScanIdx(entity, scanSt) {
  var target = scanSt.target,
      isAuto = scanSt.isAuto;
  var features = entity.features,
      spectra = entity.spectra;

  var defaultFeat = features.editPeak || features.autoPeak || features[0];
  var hasEdit = !!defaultFeat.scanEditTarget;
  var defaultIdx = isAuto || !hasEdit ? defaultFeat.scanAutoTarget : defaultFeat.scanEditTarget;
  var defaultCount = +spectra.length;
  var idx = +(target || defaultIdx || 0);
  if (idx > defaultCount) {
    idx = defaultCount;
  }
  return idx - 1;
};

var extrShare = function extrShare(entity, thresSt) {
  var scanIdx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var spectra = entity.spectra,
      features = entity.features;
  // const { autoPeak, editPeak } = features; // TBD

  var autoPeak = features.autoPeak || features[scanIdx] || features[0];
  var editPeak = features.editPeak || features[scanIdx] || features[0];
  var hasEdit = editPeak && editPeak.data ? editPeak.data[0].x.length > 0 : false;

  var feature = hasEdit && thresSt.isEdit ? editPeak : autoPeak;
  return { spectra: spectra, feature: feature, hasEdit: hasEdit };
};

var extrMs = function extrMs(entity, thresSt, scanSt) {
  var scanIdx = getScanIdx(entity, scanSt);

  var _extrShare = extrShare(entity, thresSt, scanIdx),
      spectra = _extrShare.spectra,
      feature = _extrShare.feature,
      hasEdit = _extrShare.hasEdit;

  var topic = spectra[scanIdx].data[0];
  return { topic: topic, feature: feature, hasEdit: hasEdit };
};

var extrNi = function extrNi(entity, thresSt) {
  var scanIdx = 0;

  var _extrShare2 = extrShare(entity, thresSt, scanIdx),
      spectra = _extrShare2.spectra,
      feature = _extrShare2.feature,
      hasEdit = _extrShare2.hasEdit;

  var topic = spectra[0].data[0];
  return { topic: topic, feature: feature, hasEdit: hasEdit };
};

var extractParams = function extractParams(entity, thresSt, scanSt) {
  return _format2.default.isMsLayout(entity.layout) ? extrMs(entity, thresSt, scanSt) : extrNi(entity, thresSt);
};

exports.extractParams = extractParams; // eslint-disable-line