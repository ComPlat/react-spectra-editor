"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPersistedLcmsUvvisWavelength = exports.readPersistedLcmsTicHints = exports.readPersistedLastLcmsUvvisWavelength = exports.persistLcmsUvvisWavelength = exports.persistLcmsTicHints = void 0;
var _utils = require("./utils");
const LC_WL_STORAGE_PREFIX = 'rsEditor.lcmsUvvisWl:';
const LC_WL_GLOBAL_STORAGE_KEY = 'rsEditor.lcmsUvvisWl:last';
const persistLcmsUvvisWavelength = (datasetKey, wavelength) => {
  if (wavelength == null) return;
  try {
    const normalized = String((0, _utils.normalizeSpectrumId)(wavelength));
    sessionStorage.setItem(LC_WL_GLOBAL_STORAGE_KEY, normalized);
    if (datasetKey != null) {
      sessionStorage.setItem(`${LC_WL_STORAGE_PREFIX}${datasetKey}`, normalized);
    }
  } catch (_e) {
    /* sessionStorage may be unavailable */
  }
};
exports.persistLcmsUvvisWavelength = persistLcmsUvvisWavelength;
const readPersistedLcmsUvvisWavelength = datasetKey => {
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
exports.readPersistedLcmsUvvisWavelength = readPersistedLcmsUvvisWavelength;
const readPersistedLastLcmsUvvisWavelength = () => {
  try {
    const raw = sessionStorage.getItem(LC_WL_GLOBAL_STORAGE_KEY);
    if (raw == null || raw === '') return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  } catch (e) {
    return null;
  }
};
exports.readPersistedLastLcmsUvvisWavelength = readPersistedLastLcmsUvvisWavelength;
const LC_TIC_STORAGE_PREFIX = 'rsEditor.lcmsTic:';
const persistLcmsTicHints = (datasetKey, partial) => {
  if (datasetKey == null) return;
  try {
    const key = `${LC_TIC_STORAGE_PREFIX}${datasetKey}`;
    let cur = {};
    const raw = sessionStorage.getItem(key);
    if (raw) {
      cur = JSON.parse(raw) || {};
    }
    sessionStorage.setItem(key, JSON.stringify({
      ...cur,
      ...partial
    }));
  } catch (_e) {
    /* sessionStorage may be unavailable */
  }
};
exports.persistLcmsTicHints = persistLcmsTicHints;
const readPersistedLcmsTicHints = datasetKey => {
  if (datasetKey == null) return {};
  try {
    const raw = sessionStorage.getItem(`${LC_TIC_STORAGE_PREFIX}${datasetKey}`);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};
exports.readPersistedLcmsTicHints = readPersistedLcmsTicHints;