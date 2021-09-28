import Format from './format';

const getScanIdx = (entity, scanSt) => {
  const { target, isAuto } = scanSt;
  const { features, spectra } = entity;
  const defaultFeat = features.editPeak || features.autoPeak || features[0];
  const hasEdit = !!defaultFeat.scanEditTarget;
  const defaultIdx = isAuto || !hasEdit
    ? defaultFeat.scanAutoTarget
    : defaultFeat.scanEditTarget;
  const defaultCount = +spectra.length;
  let idx = +(target || defaultIdx || 0);
  if (idx > defaultCount) { idx = defaultCount; }
  return idx - 1;
};

const extrShare = (entity, thresSt, scanIdx = 0) => {
  const { spectra, features } = entity;
  // const { autoPeak, editPeak } = features; // TBD
  const autoPeak = features.autoPeak || features[scanIdx] || features[0];
  const editPeak = features.editPeak || features[scanIdx] || features[0];
  const hasEdit = editPeak && editPeak.data
    ? editPeak.data[0].x.length > 0
    : false;

  const feature = hasEdit && thresSt.isEdit ? editPeak : autoPeak;
  const integration = features.integration;
  const multiplicity = features.multiplicity;
  return { spectra, feature, hasEdit, integration, multiplicity };
};

const extrMs = (entity, thresSt, scanSt) => {
  const scanIdx = getScanIdx(entity, scanSt);
  const { spectra, feature, hasEdit } = extrShare(entity, thresSt, scanIdx);
  const topic = spectra[scanIdx].data[0];
  return { topic, feature, hasEdit };
};

const extrNi = (entity, thresSt) => {
  const scanIdx = 0;
  const { spectra, feature, hasEdit, integration, multiplicity } = extrShare(entity, thresSt, scanIdx);
  const topic = spectra[0].data[0];
  return { topic, feature, hasEdit, integration, multiplicity };
};

const extractParams = (entity, thresSt, scanSt) => (
  Format.isMsLayout(entity.layout)
    ? extrMs(entity, thresSt, scanSt)
    : extrNi(entity, thresSt)
);

export { extractParams }; // eslint-disable-line
