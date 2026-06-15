/* eslint-disable prefer-object-spread */
import Format from './helpers/format';
import { ExtractJcamp, buildLcmsMsPageJcamp } from './helpers/chem';
import { ToXY } from './helpers/converter';
import { calcMpyCenter } from './helpers/multiplicity_calc';
import { carbonFeatures } from './helpers/carbonFeatures';
import { LIST_LAYOUT } from './constants/list_layout';

const FN = Object.assign(
  {},
  Format,
  {
    ExtractJcamp,
    buildLcmsMsPageJcamp,
    ToXY,
    LIST_LAYOUT,
    CalcMpyCenter: calcMpyCenter,
    CarbonFeatures: carbonFeatures,
  },
);

export default FN;
