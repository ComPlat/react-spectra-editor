import { camelizeKeys } from 'humps';

const convertFile = (target) => {
  const { file, mass, mol } = target;
  const data = new FormData();
  data.append('file', file);
  data.append('molfile', mol);
  data.append('mass', mass);

  const promise = fetch(
    '/api/v1/chemspectra/file/convert',
    {
      credentials: 'same-origin',
      method: 'post',
      body: data,
    },
  ).then(response => response.json())
    .then(json => camelizeKeys(json))
    .catch((err) => {
      console.log(err); // eslint-disable-line
    });

  return promise;
};

const saveFile = (target) => {
  const {
    src, dst, filename, mol, dstList, peakStr, shift, mass, scan, thres, predict,
    integration, multiplicity, waveLength, cyclicvolta, dscMetaData,
  } = target;

  const data = new FormData();
  data.append('src', src);
  data.append('dst', dst);
  data.append('molfile', mol);
  data.append('filename', filename);
  data.append('peaks_str', peakStr);
  if (shift) {
    data.append('shift_select_x', shift.peak.x);
    data.append('shift_ref_name', shift.ref.name);
    data.append('shift_ref_value', shift.ref.value);
  }
  data.append('mass', mass);
  data.append('scan', scan);
  data.append('thres', thres);
  data.append('predict', predict);
  data.append('integration', integration);
  data.append('multiplicity', multiplicity);
  data.append('wave_length', waveLength);
  data.append('cyclic_volta', cyclicvolta);
  data.append('dsc_meta_data', dscMetaData);

  if (dstList) {
    dstList.forEach((dstFile) => {
      data.append('dst_list', dstFile);
    });
  }

  const promise = fetch(
    '/api/v1/chemspectra/file/save',
    {
      credentials: 'same-origin',
      method: 'post',
      body: data,
    },
  ).then(response => response.blob())
    .then((blob) => {
      const a = document.createElement('a');
      a.style = 'display: none';
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${filename}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line
    });

  return promise;
};

const refreshFile = (target) => {
  const {
    src, dst, filename, dstList, mol, peakStr, shift, mass, scan, thres, predict,
    integration, multiplicity, waveLength, cyclicvolta,
  } = target;

  const data = new FormData();
  data.append('src', src);
  data.append('dst', dst);
  data.append('molfile', mol);
  data.append('filename', filename);
  data.append('peaks_str', peakStr);
  data.append('shift_select_x', shift.peak.x);
  data.append('shift_ref_name', shift.ref.name);
  data.append('shift_ref_value', shift.ref.value);
  data.append('mass', mass);
  data.append('scan', scan);
  data.append('thres', thres);
  data.append('predict', predict);
  data.append('integration', integration);
  data.append('multiplicity', multiplicity);
  data.append('wave_length', waveLength);
  data.append('cyclic_volta', cyclicvolta);

  if (dstList) {
    dstList.forEach((dstFile) => {
      data.append('dst_list', dstFile);
    });
  }

  const promise = fetch(
    '/api/v1/chemspectra/file/refresh',
    {
      credentials: 'same-origin',
      method: 'post',
      body: data,
    },
  ).then(response => response.json())
    .then(json => camelizeKeys(json))
    .catch((err) => {
      console.log(err); // eslint-disable-line
    });

  return promise;
};

const FetcherFile = {
  convertFile, saveFile, refreshFile,
};

export default FetcherFile;
