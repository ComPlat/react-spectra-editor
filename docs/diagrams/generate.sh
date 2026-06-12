#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SOURCE_DIR="$SCRIPT_DIR/src"
OUTPUT_DIR="$SCRIPT_DIR/generated"
CONFIG_FILE="$SCRIPT_DIR/config/mermaid-config.json"
CACHE_ROOT="${REACT_SPECTRA_EDITOR_CACHE:-$HOME/.cache/react-spectra-editor}"

export NPM_CONFIG_CACHE="$CACHE_ROOT/npm"
export PUPPETEER_CACHE_DIR="$CACHE_ROOT/puppeteer"

mkdir -p "$NPM_CONFIG_CACHE" "$PUPPETEER_CACHE_DIR" "$OUTPUT_DIR"

NPX=(npx --yes --package @mermaid-js/mermaid-cli mmdc)

cd "$REPO_ROOT"

shopt -s nullglob
sources=("$SOURCE_DIR"/*.mmd)

if [ ${#sources[@]} -eq 0 ]; then
  echo "No Mermaid diagram sources found in $SOURCE_DIR"
  exit 0
fi

for input in "${sources[@]}"; do
  base="$(basename "$input" .mmd)"
  output="$OUTPUT_DIR/$base.svg"
  echo "Generating ${output#$REPO_ROOT/} from ${input#$REPO_ROOT/}"
  "${NPX[@]}" -i "$input" -o "$output" -c "$CONFIG_FILE"
done

echo "Generated ${#sources[@]} diagram(s)."
