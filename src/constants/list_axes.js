import { LIST_LAYOUT } from './list_layout';

const optionsAxisX = {
  [LIST_LAYOUT.CYCLIC_VOLTAMMETRY]: ['', 'Voltage in V', 'Voltage vs Ref in V', 'Potential in V', 'Potential vs Ref in V'],
};

const optionsAxisY = {
  [LIST_LAYOUT.CYCLIC_VOLTAMMETRY]: ['', 'Current in A', 'Current in mA'],
};

const LIST_AXES = {
  x: optionsAxisX,
  y: optionsAxisY,
};

export {
  LIST_AXES,  // eslint-disable-line
};
