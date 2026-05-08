#!/usr/bin/env bash
#
# rebuild.sh — sync react-spectra-editor into Chemotion ELN (local dev)
#
# Prerequisites:
#   - yarn installed in both projects
#   - Chemotion ELN running via docker compose (docker-compose.dev.yml)
#
# Usage:
#   chmod +x rebuild.sh   # first time only — make the script executable
#   ./rebuild.sh
#
# Optional environment variables:
#   REACT_SPECTRA_EDITOR_DIR  path to this repo (default: script directory)
#   CHEMOTION_ELN_DIR         path to chemotion_ELN (default: ~/chemotion/chemotion_ELN)
#   FORCE_REINSTALL=1         full yarn reinstall instead of copying dist/ only
#
# Examples:
#   CHEMOTION_ELN_DIR=/path/to/chemotion_ELN ./rebuild.sh
#   FORCE_REINSTALL=1 ./rebuild.sh

# Exit on error (-e), treat unset variables as errors (-u),
# and fail a pipeline if any command in it fails (pipefail).
set -euo pipefail

# --- Paths ---

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REACT_SPECTRA_EDITOR_DIR="${REACT_SPECTRA_EDITOR_DIR:-$SCRIPT_DIR}"
CHEMOTION_ELN_DIR="${CHEMOTION_ELN_DIR:-$HOME/gitprojects/chemotion_ELN}"
INSTALLED_PACKAGE_DIR="$CHEMOTION_ELN_DIR/node_modules/@complat/react-spectra-editor"
FORCE_REINSTALL="${FORCE_REINSTALL:-0}"

# --- Checks ---

if [ ! -d "$REACT_SPECTRA_EDITOR_DIR" ]; then
  echo "react-spectra-editor directory not found: $REACT_SPECTRA_EDITOR_DIR"
  exit 1
fi

if [ ! -d "$CHEMOTION_ELN_DIR" ]; then
  echo "chemotion_ELN directory not found: $CHEMOTION_ELN_DIR"
  exit 1
fi

# --- Step 1: compile src/ → dist/ ---

echo "Compiling react-spectra-editor..."
cd "$REACT_SPECTRA_EDITOR_DIR"
yarn compile
echo "Compilation complete."

# --- Step 2: point ELN at the local package ---

echo "Updating local package link in chemotion_ELN/package.json..."
cd "$CHEMOTION_ELN_DIR"

# Replace the package dependency with a file: path to this repo.
# resolutions forces yarn to use the same version across the dependency tree.
REACT_SPECTRA_EDITOR_DIR="$REACT_SPECTRA_EDITOR_DIR" node <<'NODE'
const fs = require('fs');
const path = require('path');

const packagePath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const localPackage = `file:${process.env.REACT_SPECTRA_EDITOR_DIR}`;

pkg.dependencies = pkg.dependencies || {};
pkg.dependencies['@complat/react-spectra-editor'] = localPackage;
pkg.resolutions = pkg.resolutions || {};
pkg.resolutions['@complat/react-spectra-editor'] = localPackage;

fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
NODE

# --- Step 3: install or sync the module into ELN ---

if [ "$FORCE_REINSTALL" = "1" ] || [ ! -d "$INSTALLED_PACKAGE_DIR" ]; then
  # First install or full reinstall (slower, but safer).
  echo "Full install of @complat/react-spectra-editor..."
  yarn add "@complat/react-spectra-editor@file:$REACT_SPECTRA_EDITOR_DIR" --force
else
  # Fast path: copy dist/ + package.json.
  echo "Fast sync of dist/ into node_modules..."
  rsync -a --delete "$REACT_SPECTRA_EDITOR_DIR/dist/" "$INSTALLED_PACKAGE_DIR/dist/"
  cp "$REACT_SPECTRA_EDITOR_DIR/package.json" "$INSTALLED_PACKAGE_DIR/package.json"
fi

# --- Step 4: restart the ELN frontend ---

echo "Restarting webpacker container..."
docker compose -f docker-compose.dev.yml restart webpacker || {
  echo "Docker restart failed."
  exit 1
}

cd "$REACT_SPECTRA_EDITOR_DIR"
echo "Done."
