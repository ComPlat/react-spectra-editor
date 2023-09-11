# react-spectra-editor

An editor to View and Edit Chemical Spectra data (NMR, IR and MS).

![Testing](https://github.com/ComPlat/react-spectra-editor/actions/workflows/testing.yml/badge.svg)

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

### Demo & Manual

[demo & step-by-step manual](https://github.com/ComPlat/react-spectra-editor/blob/master/DEMO_MANUAL.md)



## Acknowledgments

This project has been funded by the **[DFG]**.

[![DFG Logo]][DFG]


Funded by the [Deutsche Forschungsgemeinschaft (DFG, German Research Foundation)](https://www.dfg.de/) under the [National Research Data Infrastructure – NFDI4Chem](https://nfdi4chem.de/) – Projektnummer **441958208** since 2020.


[DFG]: https://www.dfg.de/en/
[DFG Logo]: https://www.dfg.de/zentralablage/bilder/service/logos_corporate_design/logo_negativ_267.png
