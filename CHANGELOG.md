# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
