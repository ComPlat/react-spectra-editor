// Shared helpers for the standalone ChemSpectra client tests. Lives under fixtures/
// because everything else in __tests__ is collected as a test suite.

const encodeJcamp = (source) => Buffer.from(source).toString('base64');

// Replaces global.fetch with a plain function (CRA's jest config resets jest.fn
// implementations before each test) that records every call and answers from `routes`,
// a map of URL suffix -> JSON body.
const installFetch = (routes = {}) => {
  const calls = [];
  global.fetch = (url, options) => {
    calls.push({ url, options });
    const suffix = Object.keys(routes).find((key) => url.endsWith(key));
    const body = suffix ? routes[suffix] : {};
    return Promise.resolve({
      json: () => Promise.resolve(body),
      blob: () => Promise.resolve(new Blob(['zip'])),
    });
  };
  return calls;
};

const formEntries = (formData) => {
  const out = {};
  formData.forEach((value, key) => {
    out[key] = out[key] === undefined ? value : [].concat(out[key], value);
  });
  return out;
};

export { encodeJcamp, installFetch, formEntries };
