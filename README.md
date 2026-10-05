# react-spectra-editor

An editor to View and Edit Chemical Spectra data (NMR, IR, MS, UV, CV and XRD).

![GitHub package.json version](https://img.shields.io/github/package-json/v/ComPlat/react-spectra-editor)
![Testing](https://github.com/ComPlat/react-spectra-editor/actions/workflows/testing.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Usage

#### Installing from npm
With yarn
```
$ yarn add @complat/react-spectra-editor
```

Or with npm
```
$ npm i @complat/react-spectra-editor
```

#### Installing from github source
```
$ yarn add https://github.com/ComPlat/react-spectra-editor
```

#### Allows users manual edit spectra's description
1. Set *canChangeDescription* to be ***true***
2. Handle changed value on function *onDescriptionChanged*. The content is formatted with [Delta Object](https://quilljs.com/docs/delta/)

#### Running Demo
```
$ yarn install

$ yarn start
```

#### Standalone ChemSpectra client
The ChemSpectra upload page (spectrum, molfile and prediction-JSON inputs around the editor), formerly published as `@complat/chem-spectra-client`, ships with the editor as a separate entry point. The main entry does not load it.
```
import { ChemSpectraClient } from '@complat/react-spectra-editor/dist/standalone';

<ChemSpectraClient />            // full page: molfile, spectrum and prediction inputs
<ChemSpectraClient editorOnly /> // spectrum input only
```
It talks to a [chem-spectra-app](https://github.com/ComPlat/chem-spectra-app) backend, served from the same origin, with these calls:
`POST /api/v1/chemspectra/file/convert`, `file/save` and `file/refresh`, `molfile/convert`, and `predict/nmr_peaks_form` and `predict/infrared`.

To try it locally, one command serves the UI and proxies the backend calls above to a chem-spectra-app. Set `CHEM_SPECTRA_APP_URL` to point it at any backend, local or remote (default `http://0.0.0.0:3007`); `PORT` changes the UI port (default 3006):
```
$ yarn install

$ yarn start:standalone                                   # backend on localhost:3007
$ CHEM_SPECTRA_APP_URL=https://your-backend yarn start:standalone
$ yarn start:standalone:editor                            # the editorOnly variant
```

### Demo & Manual

[demo & step-by-step manual](https://github.com/ComPlat/react-spectra-editor/blob/master/DEMO_MANUAL.md)

### Documentation

- [Developer documentation](docs/README.md): architecture and diagrams

### Testing
#### Unit test
```
$ yarn test
```

#### E2E test
```
$ yarn start
```

Open another terminal
```
$ yarn e2e
```


## Acknowledgments

This project has been funded by the **[DFG]**.

[![DFG Logo]][DFG]


Funded by the [Deutsche Forschungsgemeinschaft (DFG, German Research Foundation)](https://www.dfg.de/) under the [National Research Data Infrastructure – NFDI4Chem](https://nfdi4chem.de/) – Projektnummer **441958208** since 2020.

Funded by the [Helmholtz Association](https://www.helmholtz.de/en/) under the program Biointerfaces (BIF-TM); currently supported by the Helmholtz program Information (until 2027).


[DFG]: https://www.dfg.de/en/
[DFG Logo]: https://chemotion.net/img/logos/DFG_logo.png
