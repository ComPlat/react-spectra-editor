/**
 * Serializes integration state into JCAMP-DX records for .jdx persistence.
 *
 * Records produced:
 * - $OBSERVEDINTEGRALS: one row per stack item (xL, xU, area, absoluteArea)
 * - $OBSERVEDINTEGRALSGROUPS: optional index/groupId pairs for HPLC visual splits
 * - $CSITAREA / $CSITFACTOR: reference scaling metadata
 */
import Format from './format';

const formatNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? String(num) : '0';
};

const serializeObservedIntegrals = (stack, refArea, layout) => {
  const safeRefArea = Number.isFinite(refArea) && refArea !== 0 ? refArea : 1;
  const includeAbsoluteArea = Format.isHplcUvVisLayout(layout);
  const lines = stack.map((item) => {
    const xL = formatNumber(item.xL);
    const xU = formatNumber(item.xU);
    const area = formatNumber(item.area / safeRefArea);
    if (includeAbsoluteArea) {
      return `${xL}, ${xU}, ${area}, ${formatNumber(item.absoluteArea)}`;
    }
    return `${xL}, ${xU}, ${area}`;
  });
  return `(X Y Z)\n${lines.join('\n')}`;
};

const serializeObservedIntegralGroups = (stack) => {
  const rows = stack.reduce((acc, item, idx) => {
    const groupId = item && item.visualSplitGroupId;
    if (groupId) acc.push(`${idx}, ${groupId}`);
    return acc;
  }, []);
  if (rows.length === 0) return null;
  return `(X Y)\n${rows.join('\n')}`;
};

const serializeIntegrationRecords = (integration, layout) => {
  if (!integration || !Array.isArray(integration.stack) || integration.stack.length === 0) {
    return {};
  }

  const { stack, refArea = 1, refFactor = 1 } = integration;
  const records = {
    $OBSERVEDINTEGRALS: serializeObservedIntegrals(stack, refArea, layout),
    $CSITAREA: formatNumber(refArea),
    $CSITFACTOR: formatNumber(refFactor),
  };

  if (Format.isHplcUvVisLayout(layout)) {
    const groups = serializeObservedIntegralGroups(stack);
    if (groups) records.$OBSERVEDINTEGRALSGROUPS = groups;
  }

  return records;
};

export {
  formatNumber,
  serializeIntegrationRecords,
  serializeObservedIntegralGroups,
  serializeObservedIntegrals,
};
