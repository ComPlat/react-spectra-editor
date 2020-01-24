import { GetFeature } from './chem';

const extractMs = (entity, scanSt) => {
  const { target, isAuto } = scanSt;
  const defaultFeat = entity.features[0];
  const hasEdit = !!defaultFeat.scanEditTarget;
  const defaultIdx = isAuto || !hasEdit
    ? defaultFeat.scanAutoTarget
    : defaultFeat.scanEditTarget;
  const defaultCount = +defaultFeat.scanCount;
  let idx = +(target || defaultIdx || 1);
  if (idx > defaultCount) { idx = defaultCount; }
  const feature = entity.features[idx - 1];
  return (
    {
      topic: feature.data[0],
      feature,
      hasEdit,
    }
  );
};

const extractNmrIr = (entity, thresSt) => {
  const { spectrum, features } = entity;
  const { autoPeak, editPeak } = features;
  const hasEdit = editPeak && editPeak.data
    ? editPeak.data[0].x.length > 0
    : false;

  const feature = hasEdit && thresSt.isEdit ? editPeak : autoPeak;
  return { topic: spectrum.data[0], feature, hasEdit };
};

const extractParams = (entity, thresSt, scanSt) => {
  const defaultFeat = GetFeature(entity);
  const layout = defaultFeat.dataType;
  const isMS = layout === 'MASS SPECTRUM';
  return isMS
    ? extractMs(entity, scanSt)
    : extractNmrIr(entity, thresSt);
};

export { extractParams }; // eslint-disable-line
