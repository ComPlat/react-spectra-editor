# Documentation

Developer documentation for `@complat/react-spectra-editor` (`react-spectra-editor`).

## Architecture

- [High-Level Overview](architecture/high-level-overview.md): package purpose, system boundaries, layers, and rendering branches
- [Frontend Architecture](architecture/frontend-architecture.md): Redux, sagas, data pipeline, multi-curve/CV, forecast, and runtime synchronization
- [Standalone ChemSpectra Client](standalone-client.md): the upload page shipped as `dist/standalone`, its backend calls, and its contract with the editor

## Diagrams

- [Diagram Generation](diagram.md): maintain and regenerate Mermaid diagrams

Regenerate all diagrams from the repository root:

```bash
yarn docs:diagrams
```

## User-Facing Guides

- [Demo & step-by-step manual](../DEMO_MANUAL.md): interactive demo usage
- [README](../README.md): installation and quick start
