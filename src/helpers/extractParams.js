import Format from './format';

const getScanIdx = (entity, scanSt) => {
  const { target, isAuto } = scanSt;
  const defaultFeat = entity.features.editPeak || entity.features.autoPeak;
  const hasEdit = !!defaultFeat.scanEditTarget;
  const defaultIdx = isAuto || !hasEdit
    ? defaultFeat.scanAutoTarget
    : defaultFeat.scanEditTarget;
  const defaultCount = +entity.spectra.length;
  let idx = +(target || defaultIdx || 0);
  if (idx > defaultCount) { idx = defaultCount; }
  return idx - 1;
};

const extrShare = (entity, thresSt) => {
  const { spectra, features } = entity;
  const { autoPeak, editPeak } = features;
  const hasEdit = editPeak && editPeak.data
    ? editPeak.data[0].x.length > 0
    : false;

  const feature = hasEdit && thresSt.isEdit ? editPeak : autoPeak;
  return { spectra, feature, hasEdit };
};

const extrMs = (entity, thresSt, scanSt) => {
  const { spectra, feature, hasEdit } = extrShare(entity, thresSt);
  const scanIdx = getScanIdx(entity, scanSt);
  const topic = spectra[scanIdx].data[0];
  return { topic, feature, hasEdit };
};

const extrNi = (entity, thresSt) => {
  const { spectra, feature, hasEdit } = extrShare(entity, thresSt);
  const topic = spectra[0].data[0];
  return { topic, feature, hasEdit };
};

const extractParams = (entity, thresSt, scanSt) => (
  Format.isMsLayout(entity.layout)
    ? extrMs(entity, thresSt, scanSt)
    : extrNi(entity, thresSt)
);

export { extractParams }; // eslint-disable-line
