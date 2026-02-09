import Format from './format';
import { getLcMsInfo } from './extractEntityLCMS';

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
  const entityInfo = getLcMsInfo(entity);

  let featuresArray = [];
  if (Array.isArray(features)) {
    featuresArray = features;
  } else if (features && typeof features === 'object') {
    featuresArray = Object.values(features);
  }

  if (entityInfo.kind === 'tic') {
    const ticFeature = featuresArray.find((spectrum) => spectrum?.data?.[0]?.x?.length > 0);
    if (ticFeature?.data?.[0]) {
      const { x, y } = ticFeature.data[0];
      arrX = x;
      arrY = y;
    }
  } else {
    featuresArray.forEach((spectrum) => {
      if (!spectrum?.data?.[0]) return;
      const { y } = spectrum.data[0];
      const { pageValue } = spectrum;
      arrX.push(pageValue);
      arrY.push(Math.max(...y));
    });
  }

  return {
    topic: { x: arrX, y: arrY },
    feature: {
      maxY: arrY.length ? Math.max(...arrY) : 0,
      operation: { layout },
      data: [{ x: arrX, y: arrY }],
      isPeaktable: false,
    },
  };
};

const extrMs = (entity, thresSt, scanSt, forceLcms = false) => {
  const { layout } = entity;
  if (Format.isMsLayout(layout) && !forceLcms) {
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

const extractParams = (entity, thresSt, scanSt, options = {}) => {
  const { forceLcms = false } = options;
  const useLcms = forceLcms || Format.isLCMsLayout(entity.layout);
  return (Format.isMsLayout(entity.layout) || useLcms)
    ? extrMs(entity, thresSt, scanSt, useLcms)
    : extrNi(entity, thresSt);
};

export { extractParams }; // eslint-disable-line
