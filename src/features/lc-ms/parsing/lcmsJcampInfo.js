/* eslint-disable import/prefer-default-export */
import { parsePageValue } from './lcmsMsPage';

export const readLcmsMzPageFromJcampInfo = (info) => {
  if (!info || info.$CSLCMSMZPAGE == null || info.$CSLCMSMZPAGE === '') return null;
  const raw = info.$CSLCMSMZPAGE;
  const scalar = Array.isArray(raw) ? raw[0] : raw;
  if (scalar == null || scalar === '') return null;
  const parsed = typeof scalar === 'number' && Number.isFinite(scalar)
    ? scalar
    : parsePageValue(String(scalar).trim());
  return Number.isFinite(parsed) ? parsed : null;
};
