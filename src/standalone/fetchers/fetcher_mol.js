import { camelizeKeys } from 'humps';

const convertMol = (target) => {
  const { mol } = target;
  const data = new FormData();
  data.append('molfile', mol);

  const promise = fetch(
    '/api/v1/chemspectra/molfile/convert',
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

const FetcherMol = {
  convertMol,
};

export default FetcherMol;
