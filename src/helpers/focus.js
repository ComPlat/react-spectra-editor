const itgIdTag = d => (
  `${Math.round(1000 * d.xL)}-${Math.round(1000 * d.xU)}`
);

const mpyIdTag = d => (
  `${Math.round(1000 * d.xExtent.xL)}-${Math.round(1000 * d.xExtent.xU)}`
);

export { itgIdTag, mpyIdTag };
