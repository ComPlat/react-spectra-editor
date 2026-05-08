# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn start              # Dev server (CRA)
yarn storybook          # Storybook on port 3001

# Build & compile
yarn build              # CRA production build
yarn compile            # Babel transpile src/ → dist/ (npm package output)

# Tests
yarn test               # Unit tests (Jest/Enzyme, excludes fixtures)
yarn test:coverage      # Unit tests with coverage
yarn e2e                # Cypress interactive runner (requires app running separately)

# Run a single test file
yarn test --testNamePattern="<pattern>" <path/to/file.test.js>
```

Lint: ESLint with airbnb config (`.eslintrc.js`). CI runs `yarn test` and Cypress E2E on every push.

## Architecture

This is a React/Redux library for viewing and editing chemical spectra (NMR, IR, MS, UV/Vis, CV, XRD, GC, DSC, etc.), published as `@complat/react-spectra-editor`. The compiled entry point for npm consumers is `dist/app.js` (produced by `yarn compile`).

### Entry points

- `src/app.js` — Root `SpectraEditor` component with Redux `Provider` and MUI `StyledEngineProvider`. This is what npm consumers import.
- `src/index.js` — Dev demo page that mounts `SpectraEditor` with fixture data for all spectra types.
- `src/layer_init.js` — Initializes reducer/layout based on spectrum entity type.
- `src/layer_prism.js` — Main rendering layer orchestrating visualization.

### State management

Redux with redux-saga for side effects and redux-undo for undo/redo:

- `src/actions/` — Action creators (UI, submission, peaks, shifts, multiplicity, integration, etc.)
- `src/reducers/` — Reducers per domain; `undo_redo_config.js` configures undo/redo scope
- `src/sagas/` — Side-effect handlers (peak editing, multiplicity, multi-entity operations)

### Visualization

All rendering is D3-based:

- `src/components/d3_line/` — Line graph (most spectra types)
- `src/components/d3_rect/` — Rectangle/area graph
- `src/components/d3_multi/` — Multi-layer rendering for overlaid spectra

### Core helpers (`src/helpers/`)

Business logic lives here, not in components:

- `chem.js` — JCAMP extraction and parsing (wraps `jcampconverter`)
- `format.js` — Data formatting and spectrum-type detection
- `integration.js` — Integration peak calculation
- `multiplicity.js` — NMR multiplicity analysis
- `compass.js`, `brush.js` — D3 interaction (zoom, brush selection)
- `cfg.js` — Configuration resolution
- `mount.js` — Initialization utilities

### Constants (`src/constants/`)

Action type strings, layout definitions, axes, spectrum type detectors, shift tables, wavelength tables, viewer type enums.

### Tests

- `src/__tests__/units/` — Unit tests (Jest + Enzyme + @testing-library/react)
- `src/__tests__/fixtures/` — Sample JCAMP files for all supported spectrum types
- `cypress/` — E2E specs

### Key dependencies

| Concern | Library |
|---|---|
| State | redux, react-redux, redux-saga, redux-undo, reselect |
| UI | @mui/material v5, @emotion/react |
| Visualization | d3 v7, d3-tip |
| Spectra parsing | jcampconverter |
| Signal processing | ml-savitzky-golay-generalized |
| Component testing | Enzyme 3 (React 17 adapter), @testing-library/react |

### Jest quirks

`node_modules` transforms are forced for d3, d3-array, internmap, delaunator, and robust-predicates (ESM-only packages — see `transformIgnorePatterns` in `package.json`).

### rebuild.sh

Development utility for syncing `dist/` into a local Chemotion ELN instance. Not part of the standard CI pipeline.
