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
  const { integration, multiplicity } = features;
  return {
    spectra, feature, hasEdit, integration, multiplicity,
  };
};

const extrLcMs = (entity) => {
  const { features, layout } = entity;
  let arrX = [];
  let arrY = [];
  features.forEach((spectrum) => {
    const { data, csCategory, pageValue } = spectrum;
    const isTic = csCategory === 'TIC SPECTRUM';
    // const isUvvis = csCategory === 'UVVIS SPECTRUM';
    const { x, y } = data[0];
    if (isTic) {
      arrX = x;
      arrY = y;
    } else {
      const maxY = Math.max(...y);
      arrX = [...arrX, pageValue];
      arrY = [...arrY, maxY];
    }
  });
  const topic = { x: arrX, y: arrY };
  const maxYFeature = Math.max(...arrY);
  const featureData = [{ x: arrX, y: arrY }];
  const feature = {
    maxY: maxYFeature, operation: { layout }, data: featureData, isPeaktable: false,
  };
  return { topic, feature };
};

const extrMs = (entity, thresSt, scanSt) => {
  const { layout } = entity;
  if (Format.isMsLayout(layout)) {
    const scanIdx = getScanIdx(entity, scanSt);
    const { spectra, feature, hasEdit } = extrShare(entity, thresSt, scanIdx);
    const topic = spectra[scanIdx].data[0];
    return { topic, feature, hasEdit };
  }
  const { spectra, features } = entity;
  const { topic, feature } = extrLcMs(entity);
  return {
    entity, spectra, features, topic, feature,
  };
};

const extrNi = (entity, thresSt) => {
  const scanIdx = 0;
  const {
    spectra, feature, hasEdit, integration, multiplicity,
  } = extrShare(entity, thresSt, scanIdx);
  const topic = spectra[0].data[0];
  return {
    topic, feature, hasEdit, integration, multiplicity,
  };
};

const extractParams = (entity, thresSt, scanSt) => (
  (Format.isMsLayout(entity.layout) || Format.isLCMsLayout(entity.layout))
    ? extrMs(entity, thresSt, scanSt)
    : extrNi(entity, thresSt)
);

export { extractParams }; // eslint-disable-line
