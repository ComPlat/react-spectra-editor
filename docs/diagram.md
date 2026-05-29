# Diagram Generation

Developer reference for maintaining documentation diagrams in `docs/diagrams/`.

## Purpose

Documentation diagrams are generated automatically from Mermaid source files. The source files are versioned so diagrams can be reviewed and edited as code, while generated image files are used by Markdown documentation.

## Folder Structure

```text
docs/diagrams/
  config/
    mermaid-config.json
  generate.sh
  generated/
    application-composition.svg
    data-transformation-pipeline.svg
    frontend-context-map.svg
    multi-curve-architecture.svg
    redux-architecture.svg
    rendering-branches.svg
    rendering-pipeline.svg
    runtime-synchronization-flow.svg
    saga-orchestration.svg
  src/
    application-composition.mmd
    data-transformation-pipeline.mmd
    frontend-context-map.mmd
    multi-curve-architecture.mmd
    redux-architecture.mmd
    rendering-branches.mmd
    rendering-pipeline.mmd
    runtime-synchronization-flow.mmd
    saga-orchestration.mmd
```

`docs/diagrams/src/` contains Mermaid source files (`.mmd`). Edit these files when a diagram needs to change.

`docs/diagrams/generated/` contains generated SVG diagrams. Every Mermaid source is generated as SVG.

`docs/diagrams/config/mermaid-config.json` defines shared Mermaid theme settings (fonts, colors, flowchart spacing) applied to every generated diagram.

## How to Generate Diagrams

Run this command from the repository root:

```bash
bash docs/diagrams/generate.sh
```

Or:

```bash
yarn docs:diagrams
```

This regenerates all SVG diagrams from every `.mmd` file in `docs/diagrams/src/`.

## How It Works

- The generation script uses Mermaid CLI through `npx`.
- Mermaid CLI is downloaded and run on demand; it is not a project dependency.
- The script keeps npm and Puppeteer caches outside the repository under `~/.cache/react-spectra-editor/` (override with `REACT_SPECTRA_EDITOR_CACHE`).
- Shared styling is applied through `docs/diagrams/config/mermaid-config.json`.

Equivalent manual command pattern:

```bash
for file in docs/diagrams/src/*.mmd; do
  npx --yes --package @mermaid-js/mermaid-cli mmdc \
    -i "$file" \
    -o "docs/diagrams/generated/$(basename "${file%.mmd}.svg")" \
    -c docs/diagrams/config/mermaid-config.json
done
```

## How to Add or Modify a Diagram

1. Create or edit a `.mmd` file in `docs/diagrams/src/`.
2. Run the generation script:

   ```bash
   bash docs/diagrams/generate.sh
   ```

3. Reference the generated image in Markdown under `docs/architecture/`.

Use centered HTML image tags for large architecture diagrams. Keep diagrams fluid, readable on narrow screens, and capped in height:

```html
<div align="center" style="overflow-x: auto;">
  <img src="../diagrams/generated/redux-architecture.svg" alt="Redux Architecture" width="100%" style="width: 100%; min-width: 1000px; max-height: 840px; height: auto; object-fit: contain;">
</div>
```

For simpler overview diagrams, standard Markdown image syntax is also used:

```markdown
![Application Composition](../diagrams/generated/application-composition.svg)
```

Use PNG only when targeting tools that do not reliably render SVG. This repository currently references SVG diagrams only; do not add PNG files unless Markdown documentation needs them.

## Rules

- Do not manually edit generated images.
- Always modify `.mmd` source files.
- Add new documentation diagrams as `.mmd` files in `docs/diagrams/src/`.
- Regenerate SVG files after changing any `.mmd` source.
- Center large diagrams in architecture pages and include `width="100%"` as the GitHub fallback. Keep `width: 100%; min-width: 1000px; max-height: 840px; height: auto; object-fit: contain;` for local previews that preserve inline styles.
- Do not keep generated PNG files unless Markdown documentation references them.
- Do not add `@mermaid-js/mermaid-cli` as a project dependency; generation stays on-demand through `npx`.
- Keep diagrams simple and readable.
- Mark unconfirmed behavior in the Mermaid source as `TODO: Confirm <specific behavior, integration, or deployment detail>`.

## Diagram Usage in Documentation

| Diagram | Referenced in |
|---|---|
| `frontend-context-map` | [high-level-overview.md](architecture/high-level-overview.md) |
| `application-composition` | [high-level-overview.md](architecture/high-level-overview.md) |
| `rendering-branches` | [high-level-overview.md](architecture/high-level-overview.md) |
| `redux-architecture` | [frontend-architecture.md](architecture/frontend-architecture.md) |
| `saga-orchestration` | [frontend-architecture.md](architecture/frontend-architecture.md) |
| `rendering-pipeline` | [frontend-architecture.md](architecture/frontend-architecture.md) |
| `data-transformation-pipeline` | [frontend-architecture.md](architecture/frontend-architecture.md) |
| `multi-curve-architecture` | [frontend-architecture.md](architecture/frontend-architecture.md) |
| `runtime-synchronization-flow` | [frontend-architecture.md](architecture/frontend-architecture.md) |
