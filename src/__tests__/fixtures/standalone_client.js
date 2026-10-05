// Shared helpers for the standalone ChemSpectra client tests. Lives under fixtures/
// because everything else in __tests__ is collected as a test suite.

const encodeJcamp = (source) => Buffer.from(source).toString('base64');

// A route answer that refuses the request the way chem-spectra-app does: HTTP 422 with
// { error } in the body.
const refusal = (error) => ({ refusedWith: 422, body: { error } });

// Replaces global.fetch with a plain function (CRA's jest config resets jest.fn
// implementations before each test) that records every call and answers from `routes`,
// a map of URL suffix -> JSON body (200) or refusal(...) (422).
const installFetch = (routes = {}) => {
  const calls = [];
  global.fetch = (url, options) => {
    calls.push({ url, options });
    const suffix = Object.keys(routes).find((key) => url.endsWith(key));
    const answer = suffix ? routes[suffix] : {};
    const refused = answer && answer.refusedWith;
    const body = refused ? answer.body : answer;
    return Promise.resolve({
      ok: !refused,
      status: refused || 200,
      json: () => Promise.resolve(body),
      blob: () => Promise.resolve(new Blob([refused ? JSON.stringify(body) : 'zip'])),
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

export {
  encodeJcamp, installFetch, formEntries, refusal,
};
