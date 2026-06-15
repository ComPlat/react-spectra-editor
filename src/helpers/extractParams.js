import Format from './format';
import { getLcMsInfo } from './extractEntityLCMS';

const getScanIdx = (entity, scanState) => {
  const { target, isAuto } = scanState || {};
  const { features = {}, spectra = [] } = entity || {};
  const defaultFeature = features.editPeak || features.autoPeak || features[0] || {};
  const hasEdit = !!defaultFeature?.scanEditTarget;
  const defaultIdx = isAuto || !hasEdit
    ? defaultFeature?.scanAutoTarget
    : defaultFeature?.scanEditTarget;
  const defaultCount = +spectra.length;
  let idx = +(target || defaultIdx || 0);
  if (idx > defaultCount) idx = defaultCount;
  return Math.max(idx - 1, 0);
};

const extractSharedParams = (entity, thresholdState, scanIdx = 0) => {
  const { spectra = [], features = {} } = entity || {};
  const autoPeak = features.autoPeak || features[scanIdx] || features[0] || {};
  const editPeak = features.editPeak || features[scanIdx] || features[0] || {};
  const hasEdit = !!editPeak?.data?.[0]?.x?.length;

  const feature = hasEdit && thresholdState?.isEdit ? editPeak : autoPeak;
  const { integration, multiplicity } = features;
  return {
    spectra, feature, hasEdit, integration, multiplicity,
  };
};

const extractLcmsParams = (entity) => {
  const { features, layout } = entity;
  let topicX = [];
  let topicY = [];
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
      topicX = x;
      topicY = y;
    }
  } else {
    featuresArray.forEach((spectrum) => {
      if (!spectrum?.data?.[0]) return;
      const { y } = spectrum.data[0];
      const { pageValue } = spectrum;
      topicX.push(pageValue);
      topicY.push(Math.max(...y));
    });
  }

  return {
    topic: { x: topicX, y: topicY },
    feature: {
      maxY: topicY.length ? Math.max(...topicY) : 0,
      operation: { layout },
      data: [{ x: topicX, y: topicY }],
      isPeaktable: false,
    },
  };
};

const extractMsParams = (entity, thresholdState, scanState, forceLcms = false) => {
  const { layout } = entity;
  if (Format.isMsLayout(layout) && !forceLcms) {
    const scanIdx = getScanIdx(entity, scanState);
    const { spectra, feature, hasEdit } = extractSharedParams(entity, thresholdState, scanIdx);
    const topic = spectra?.[scanIdx]?.data?.[0] || { x: [], y: [] };
    return { topic, feature, hasEdit };
  }
  const { spectra, features } = entity;
  const { topic, feature } = extractLcmsParams(entity);
  return {
    entity, spectra, features, topic, feature,
  };
};

const extractNonMsParams = (entity, thresholdState) => {
  const scanIdx = 0;
  const {
    spectra, feature, hasEdit, integration, multiplicity,
  } = extractSharedParams(entity, thresholdState, scanIdx);
  const topic = spectra?.[0]?.data?.[0] || { x: [], y: [] };
  return {
    topic, feature, hasEdit, integration, multiplicity,
  };
};

const extractParams = (entity, thresholdState, scanState, options = {}) => {
  const { forceLcms = false } = options;
  const shouldUseLcmsPath = forceLcms || Format.isLCMsLayout(entity.layout);
  return (Format.isMsLayout(entity.layout) || shouldUseLcmsPath)
    ? extractMsParams(entity, thresholdState, scanState, shouldUseLcmsPath)
    : extractNonMsParams(entity, thresholdState);
};

export { extractParams }; // eslint-disable-line
