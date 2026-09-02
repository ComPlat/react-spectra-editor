// Content fingerprints for host-supplied entities.
//
// Hosts routinely rebuild `entity` / `multiEntities` as fresh object literals on
// every render, so reference equality cannot answer "did the data actually
// change?". Answering it with `!==` is what cascaded into React's "Maximum
// update depth exceeded" in issue #329. These helpers answer it by content
// instead.
//
// Entities carry large spectral arrays, so nothing here stringifies one
// wholesale; each data block is reduced to length/first/last per axis.

// Digest of a single `{ x, y }` data block, on BOTH axes.
const dataBlockDigest = (data0) => {
  if (!data0) return 'none';
  const xs = Array.isArray(data0.x) ? data0.x : [];
  const ys = Array.isArray(data0.y) ? data0.y : [];
  return `${xs.length}:${xs[0]}:${xs[xs.length - 1]}:${ys.length}:${ys[0]}:${ys[ys.length - 1]}`;
};

// A stable content signature for one entity.
//
// Three properties this digest must have, each learned from a way an easier
// signature collides between two genuinely different entities:
//
//  - It must not key on the id alone. `idDt` is a DATASET-scope key shared by
//    every curve of an LC/MS group (see reducer_hplc_ms/hydrate.js's
//    `lcmsDatasetKey`), so an id-only signature stays constant for a whole
//    session - a host answering `onLcmsPageRequest` with a new retention time
//    would look unchanged. The id is folded in as one component, never as a
//    short-circuit.
//  - It must digest every `spectra` block, not just the first: an MS-layout
//    entity's displayed topic comes from `spectra[scanIdx]` (chosen by
//    getScanIdx), not `spectra[0]`.
//  - It must digest both axes. Many instrument types - IR in particular -
//    resample every measurement onto the same standardized wavenumber grid, so
//    two completely different samples share an identical x length/head/tail
//    while only their measured y values differ.
//
// The feature blocks extractParams itself reads (autoPeak/editPeak) are folded
// in too, so a mismatch anywhere in what extractParams consumes shows up here.
const entitySignature = (e) => {
  if (!e) return 'none';
  const id = e.idDt ?? e.id ?? e.datasetId;
  const spectraDigest = Array.isArray(e.spectra)
    ? e.spectra.map((s) => dataBlockDigest(s?.data?.[0])).join(';')
    : 'none';
  const features = (e.features && typeof e.features === 'object' && !Array.isArray(e.features))
    ? e.features
    : {};
  const autoDigest = dataBlockDigest(features.autoPeak?.data?.[0]);
  const editDigest = dataBlockDigest(features.editPeak?.data?.[0]);
  return `${e.layout || ''}|${e.title || ''}|id:${id ?? ''}|sp:${spectraDigest}|auto:${autoDigest}|edit:${editDigest}`;
};

// Signature for a list of entities (`multiEntities`).
const multiEntitiesSignature = (entities) => {
  if (!Array.isArray(entities)) return 'none';
  return `len:${entities.length}|${entities.map((e) => entitySignature(e)).join('||')}`;
};

export { dataBlockDigest, entitySignature, multiEntitiesSignature };
