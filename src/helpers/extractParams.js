import Format from './format';
import { catToString } from './extractEntityLCMS';

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
  if (idx > defaultCount) idx = defaultCount;
  return idx - 1;
};

const extrShare = (entity, thresSt, scanIdx = 0) => {
  const { spectra, features } = entity;
  const autoPeak = features.autoPeak || features[scanIdx] || features[0];
  const editPeak = features.editPeak || features[scanIdx] || features[0];
  const hasEdit = editPeak && editPeak.data ? editPeak.data[0].x.length > 0 : false;

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

  const featuresArray = Array.isArray(features)
    ? features
    : (features && typeof features === 'object')
        ? Object.values(features)
        : [];

  featuresArray.forEach((spectrum) => {
    if (!spectrum?.data?.[0]) return;

    const cat = catToString(spectrum.csCategory);
    const { x, y }   = spectrum.data[0];
    const pageValue  = spectrum.pageValue;

    if (cat.includes('TIC')) {
      arrX = x;
      arrY = y;
    } else {
      arrX.push(pageValue);
      arrY.push(Math.max(...y));
    }
  });

  return {
    topic:   { x: arrX, y: arrY },
    feature: {
      maxY:       arrY.length ? Math.max(...arrY) : 0,
      operation:  { layout },
      data:       [{ x: arrX, y: arrY }],
      isPeaktable:false,
    },
  };
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
