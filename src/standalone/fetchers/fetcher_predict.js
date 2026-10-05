const getParamsNmr = ({
  molfile, peaks, layout, shift,
}) => {
  const jsonPeaks = JSON.stringify(peaks);
  const jsonShift = JSON.stringify(shift);
  const data = new FormData();
  data.append('molfile', molfile);
  data.append('layout', layout);
  data.append('peaks', jsonPeaks);
  data.append('shift', jsonShift);

  const url = '/api/v1/chemspectra/predict/nmr_peaks_form';

  return { url, data };
};

const getParamsIr = ({ molfile, spectrum }) => {
  const data = new FormData();
  data.append('molfile', molfile);
  data.append('spectrum', spectrum);

  const url = '/api/v1/chemspectra/predict/infrared';

  return { url, data };
};

const predict = (payload) => {
  const { layout } = payload;
  const params = layout === 'IR'
    ? getParamsIr(payload)
    : getParamsNmr(payload);
  const { url, data } = params;

  const promise = fetch(
    url,
    {
      credentials: 'same-origin',
      method: 'post',
      body: data,
    },
  ).then(response => response.json())
    .then(json => json)
    .catch((err) => {
      console.log(err); // eslint-disable-line
    });

  return promise;
};

const FetcherPredict = {
  predict,
};

export default FetcherPredict;
