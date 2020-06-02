import Format from './helpers/format';
import { ExtractJcamp } from './helpers/chem';
import { ToXY } from './helpers/converter';
import { calcMpyCenter } from './helpers/multiplicity_calc';
import { LIST_LAYOUT } from './constants/list_layout';

const FN = Object.assign(
  {},
  Format,
  {
    ExtractJcamp,
    ToXY,
    LIST_LAYOUT,
    CalcMpyCenter: calcMpyCenter,
  },
);

export default FN;
