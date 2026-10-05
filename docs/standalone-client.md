# Standalone ChemSpectra Client

`ChemSpectraClient` is the ChemSpectra upload page: a spectrum, molfile and prediction-JSON input
around the editor, with no login and no persistence. It was published separately as
`@complat/chem-spectra-client`, which pinned an old editor release. It now lives in this package,
under [`src/standalone/`](../src/standalone), and always uses this package's editor.

## Using it

```js
import { ChemSpectraClient } from '@complat/react-spectra-editor/dist/standalone';

<ChemSpectraClient />            // full page: molfile, spectrum and prediction inputs
<ChemSpectraClient editorOnly /> // spectrum input only
```

- It is a separate entry point. The main entry (`dist/app.js`) loads nothing from
  `standalone/`, so hosts that embed only the editor are unaffected.
- It talks to a [chem-spectra-app](https://github.com/ComPlat/chem-spectra-app) backend on the
  same origin. In chemotion_ELN, the `/chemspectra` and `/chemspectra-editor` pages serve it, and
  the ELN's public `/api/v1/chemspectra/*` routes forward to chem-spectra-app.
- It ships no CSS: nothing under `src/standalone/` may import a stylesheet, because babel does
  not copy `.css` into `dist/` and the import would break a host's build.

## Running it locally

One command serves the page and proxies the backend calls to a chem-spectra-app:

```bash
yarn start:standalone                                    # backend on http://0.0.0.0:3007
CHEM_SPECTRA_APP_URL=https://your-backend yarn start:standalone
PORT=3010 yarn start:standalone                          # UI port (default 3006)
yarn start:standalone:editor                             # the editorOnly variant
```

`src/index.js` renders the client when `REACT_APP_DEMO=standalone`, and the editor demo otherwise.
[`src/setupProxy.js`](../src/setupProxy.js) forwards `/api/v1/chemspectra` to
`CHEM_SPECTRA_APP_URL`, and only for the standalone start; it is dev-server only and never
compiled into `dist/`.

## How it is built

| Part | Files | Role |
|---|---|---|
| Entry | `index.js`, `store.js` | `ChemSpectraClient` and `createClientStore()`. The store and its root saga are created on the first render, once per page, not on import. |
| Page | `frame.js`, `components/input_*.js`, `notice.js`, `loading.js` | Dropzones for the spectrum, molfile and prediction JSON, the submit form, notices and the loading overlay. |
| Editor host | `components/content.js` | Renders `SpectraEditor` with the converted file, builds its `operations`, `forecast` and `others`, and shows written peaks or multiplicities in a text area. |
| State | `reducers/` | `file`, `mol`, `predict`, `desc`, `jcamp` (comparison spectra), `notice`, `loading`, `form`. |
| Effects | `sagas/`, `fetchers/` | Upload checks and every backend call. |

The client has its own Redux store; the editor keeps its own, as it does in any host.

## Backend calls

All are `POST` with `FormData` and `credentials: 'same-origin'`:

| Endpoint | Sent by | Returns |
|---|---|---|
| `/api/v1/chemspectra/file/convert` | submitting a spectrum, adding a comparison spectrum | base64 JCAMP (`jcamp`) or a list (`list_jcamps`), plus a preview image |
| `/api/v1/chemspectra/file/save` | the **save** operation | a zip, downloaded as `<filename>.zip` |
| `/api/v1/chemspectra/file/refresh` | the editor's **Refresh Simulation** | a refreshed JCAMP |
| `/api/v1/chemspectra/molfile/convert` | dropping a `.mol` file | SVG, SMILES and mass |
| `/api/v1/chemspectra/predict/infrared`, `/predict/nmr_peaks_form` | the editor's **Predict** | prediction results |

Save posts `src`, `dst`, `molfile`, `filename`, `peaks_str`, `shift_select_x`, `shift_ref_name`,
`shift_ref_value`, `mass`, `scan`, `thres`, `predict`, `integration`, `multiplicity`,
`wave_length`, `cyclic_volta`, `dsc_meta_data` and, for multi-spectrum uploads, `dst_list`. The
unit tests pin this list field by field.

## Contract with the editor

- **Operations** (write peaks, write multiplicity, save) receive the Submit payload
  `{ spectra_list: [perCurvePayload, ...], curveSt: { curveIdx } }`. In each per-curve payload
  the shift, integration and multiplicity are the selected entry, not whole lists.
  `resolveOperationParams` in `content.js` picks the selected curve and rebuilds the index-keyed
  lists the formatting helpers expect.
- **Save** posts the selected curve's own integration and multiplicity entry, which is what
  chem-spectra-app reads. A curve the editor holds no entry for is posted as `{}` (none), never
  another curve's data. This is the normal case for cyclic voltammetry, where the editor keeps
  one integration and one multiplicity entry but a shift per curve. See `buildSavePayload`.
- **Forecast** callbacks (`btnCb` for prediction, `refreshCb` for simulation refresh) receive the
  flat payload with whole lists, unchanged from older releases.

The contract tests in
[`src/__tests__/units/standalone/`](../src/__tests__/units/standalone) render the real editor and
click its Submit, Predict and Refresh buttons, with only drawing and `fetch` stubbed, so a
reshaped payload fails a test.

## Known limitations

- No LC/MS: save sends no `lcms_*` fields, and the editor's LC/MS page requests are not wired.
- Saving a multi-spectrum upload sends the selected curve, with the other converted files as
  `dst_list`, as the old client did. The ELN saves every curve in `spectra_list`.
