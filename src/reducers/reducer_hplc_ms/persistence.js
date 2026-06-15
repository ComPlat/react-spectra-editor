import { normalizeSpectrumId } from './utils';

const LC_WL_STORAGE_PREFIX = 'rsEditor.lcmsUvvisWl:';
const LC_WL_GLOBAL_STORAGE_KEY = 'rsEditor.lcmsUvvisWl:last';

export const persistLcmsUvvisWavelength = (datasetKey, wavelength) => {
  if (wavelength == null) return;
  try {
    const normalized = String(normalizeSpectrumId(wavelength));
    sessionStorage.setItem(LC_WL_GLOBAL_STORAGE_KEY, normalized);
    if (datasetKey != null) {
      sessionStorage.setItem(
        `${LC_WL_STORAGE_PREFIX}${datasetKey}`,
        normalized,
      );
    }
  } catch (_e) {
    /* sessionStorage may be unavailable */
  }
};

export const readPersistedLcmsUvvisWavelength = (datasetKey) => {
  if (datasetKey == null) return null;
  try {
    const raw = sessionStorage.getItem(`${LC_WL_STORAGE_PREFIX}${datasetKey}`);
    if (raw == null || raw === '') return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  } catch (e) {
    return null;
  }
};

export const readPersistedLastLcmsUvvisWavelength = () => {
  try {
    const raw = sessionStorage.getItem(LC_WL_GLOBAL_STORAGE_KEY);
    if (raw == null || raw === '') return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  } catch (e) {
    return null;
  }
};

const LC_TIC_STORAGE_PREFIX = 'rsEditor.lcmsTic:';

export const persistLcmsTicHints = (datasetKey, partial) => {
  if (datasetKey == null) return;
  try {
    const key = `${LC_TIC_STORAGE_PREFIX}${datasetKey}`;
    let cur = {};
    const raw = sessionStorage.getItem(key);
    if (raw) {
      cur = JSON.parse(raw) || {};
    }
    sessionStorage.setItem(key, JSON.stringify({ ...cur, ...partial }));
  } catch (_e) {
    /* sessionStorage may be unavailable */
  }
};

export const readPersistedLcmsTicHints = (datasetKey) => {
  if (datasetKey == null) return {};
  try {
    const raw = sessionStorage.getItem(`${LC_TIC_STORAGE_PREFIX}${datasetKey}`);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};
