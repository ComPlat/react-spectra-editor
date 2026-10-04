# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.8.5] - 2026-10-04

### Fixed
- A JCAMP whose `##DATA TYPE` the editor doesn't recognise now opens in the neutral PLAIN layout, with a non-reversed x-axis, instead of keeping the previous spectrum's layout and its NMR controls. Gel permeation chromatography is now read as SEC. The MS bar chart no longer crashes when a threshold comes out empty, and LC/MS panes no longer grow without bound in an unsized host (#336)
- NMR: opening a spectrum without multiplets right after one with multiplets no longer leaves the previous spectrum's multiplet bars and labels on the chart (#342)

[1.8.5]: https://github.com/ComPlat/react-spectra-editor/releases/tag/v1.8.5

## [1.8.4] - 2026-09-25

### Fixed
- NMR: simulated peaks returned by the host's Refresh Simulation now show in place, without reopening the editor (#339)

[1.8.4]: https://github.com/ComPlat/react-spectra-editor/releases/tag/v1.8.4

## [1.8.3] - 2026-09-24

### Fixed
- Multi-curve: opening a spectrum no longer loops into "Maximum update depth exceeded" when the host rebuilds its entity on every render, and Clear All Peaks now persists (#330)
- The editor fits the space its host gives it: charts draw at their container's size, the toolbar wraps with Layout first and Submit last in every layout, and the info panel scrolls as one (#335)

### Dependencies
- Bump fast-uri 3.1.5 → 3.1.7 (#332)
- Bump browserslist 4.28.2 → 4.28.7 (#333)

[1.8.3]: https://github.com/ComPlat/react-spectra-editor/releases/tag/v1.8.3

## [1.8.2] - 2026-08-27

### Fixed
- LC/MS retention time is normalized to minutes and the UV and TIC panes share an aligned domain (#323)
- LC/MS: a UV/VIS axis delivered in seconds behind a MINUTES label is corrected (#326)
- LC/MS: the three-graph stack, the toolbar and the panel now fit their container (#325)
- CV: an incomplete feature no longer takes the whole editor down (#327)

[1.8.2]: https://github.com/ComPlat/react-spectra-editor/releases/tag/v1.8.2

## [1.8.1] - 2026-08-25

### Fixed
- LC/MS layout detection: a plain MS jcamp is no longer rendered with the LC/MS layout (#322)

### Dependencies
- Bump shell-quote 1.8.4 → 1.10.0 (#319)
- Bump fast-uri 3.1.2 → 3.1.5 (#320)

[1.8.1]: https://github.com/ComPlat/react-spectra-editor/releases/tag/v1.8.1

## [1.8.0] - 2026-06-29

### Added
- LC/MS visualization support for OpenLab and Chemstation data (#289)
- Two-click integration: creation, split, and visual split with JCAMP persistence (#303)
- Developer architecture documentation (#307)

### Fixed
- LC/MS review regressions B1, B4–B7 (#316):
  - peak-add restored on non-LC/MS layouts (NMR/IR/MS)
  - `Convert2Peak` honours stored LC/MS peaks (with offset) instead of recomputing
  - CV current-density factor corrected for areas in mm² (chart, panel and submit/export)
  - crash guards for the UV-Vis viewer update path and `drawBar`

### CI / Build
- GitHub Actions moved to node24 action runtimes; Node pinned to 22.23.1 (#315)

### Dependencies
- Bump http-proxy-middleware 2.0.9 → 2.0.10 (#311)
- Bump tmp 0.2.4 → 0.2.7 (#306)

[1.8.0]: https://github.com/ComPlat/react-spectra-editor/releases/tag/v1.8.0
