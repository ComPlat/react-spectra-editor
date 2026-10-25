"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _humps = require("humps");
// The backend reads an absent field as "none" and parses several as JSON. A value the editor
// does not have (undefined) would otherwise go out as the string "undefined", which fails
// to parse.
const appendDefined = (data, key, value) => {
  if (value !== undefined) data.append(key, value);
};
const convertFile = target => {
  const {
    file,
    mass,
    mol
  } = target;
  const data = new FormData();
  data.append('file', file);
  data.append('molfile', mol);
  data.append('mass', mass);
  const promise = fetch('/api/v1/chemspectra/file/convert', {
    credentials: 'same-origin',
    method: 'post',
    body: data
  }).then(response => response.json()).then(json => (0, _humps.camelizeKeys)(json)).catch(err => {
    console.log(err); // eslint-disable-line
  });
  return promise;
};
const saveFile = target => {
  const {
    src,
    dst,
    filename,
    mol,
    dstList,
    peakStr,
    shift,
    mass,
    scan,
    thres,
    predict,
    integration,
    multiplicity,
    waveLength,
    cyclicvolta,
    dscMetaData
  } = target;
  const data = new FormData();
  data.append('src', src);
  data.append('dst', dst);
  appendDefined(data, 'molfile', mol);
  appendDefined(data, 'filename', filename);
  appendDefined(data, 'peaks_str', peakStr);
  if (shift) {
    appendDefined(data, 'shift_select_x', shift.peak.x);
    appendDefined(data, 'shift_ref_name', shift.ref.name);
    appendDefined(data, 'shift_ref_value', shift.ref.value);
  }
  appendDefined(data, 'mass', mass);
  appendDefined(data, 'scan', scan);
  appendDefined(data, 'thres', thres);
  appendDefined(data, 'predict', predict);
  appendDefined(data, 'integration', integration);
  appendDefined(data, 'multiplicity', multiplicity);
  appendDefined(data, 'wave_length', waveLength);
  appendDefined(data, 'cyclic_volta', cyclicvolta);
  appendDefined(data, 'dsc_meta_data', dscMetaData);
  if (dstList) {
    dstList.forEach(dstFile => {
      data.append('dst_list', dstFile);
    });
  }
  const promise = fetch('/api/v1/chemspectra/file/save', {
    credentials: 'same-origin',
    method: 'post',
    body: data
  }).then(response => {
    // A refusal is { error } as JSON, not a zip: report it instead of downloading it.
    if (!response.ok) {
      return response.json().catch(() => ({})).then(body => ({
        ok: false,
        error: body && body.error
      }));
    }
    return response.blob().then(blob => {
      const a = document.createElement('a');
      a.style = 'display: none';
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${filename}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
      return {
        ok: true
      };
    });
  }).catch(err => {
    console.log(err); // eslint-disable-line
    return {
      ok: false
    };
  });
  return promise;
};
const refreshFile = target => {
  const {
    src,
    dst,
    filename,
    dstList,
    mol,
    peakStr,
    shift,
    mass,
    scan,
    thres,
    predict,
    integration,
    multiplicity,
    waveLength,
    cyclicvolta
  } = target;
  const data = new FormData();
  data.append('src', src);
  data.append('dst', dst);
  appendDefined(data, 'molfile', mol);
  appendDefined(data, 'filename', filename);
  appendDefined(data, 'peaks_str', peakStr);
  appendDefined(data, 'shift_select_x', shift.peak.x);
  appendDefined(data, 'shift_ref_name', shift.ref.name);
  appendDefined(data, 'shift_ref_value', shift.ref.value);
  appendDefined(data, 'mass', mass);
  appendDefined(data, 'scan', scan);
  appendDefined(data, 'thres', thres);
  appendDefined(data, 'predict', predict);
  appendDefined(data, 'integration', integration);
  appendDefined(data, 'multiplicity', multiplicity);
  appendDefined(data, 'wave_length', waveLength);
  appendDefined(data, 'cyclic_volta', cyclicvolta);
  if (dstList) {
    dstList.forEach(dstFile => {
      data.append('dst_list', dstFile);
    });
  }
  const promise = fetch('/api/v1/chemspectra/file/refresh', {
    credentials: 'same-origin',
    method: 'post',
    body: data
  }).then(response => response.json()).then(json => (0, _humps.camelizeKeys)(json)).catch(err => {
    console.log(err); // eslint-disable-line
  });
  return promise;
};
const FetcherFile = {
  convertFile,
  saveFile,
  refreshFile
};
var _default = exports.default = FetcherFile;