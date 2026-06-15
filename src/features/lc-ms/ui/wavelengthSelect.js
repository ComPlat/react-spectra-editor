/* eslint-disable react/function-component-definition */
import React from 'react';
import classNames from 'classnames';
import {
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';

const renderWavelengthSelect = (
  classes,
  hplcMsSt,
  updateWavelengthAct,
  options = {},
) => {
  const {
    labelId = 'select-decimal-label',
    label = 'Decimal',
    width = '140px',
  } = options;

  const uvvis = (hplcMsSt && hplcMsSt.uvvis) || {};
  const { listWaveLength = null, selectedWaveLength } = uvvis;
  const items = listWaveLength ? listWaveLength.map((d) => (
    <MenuItem value={d} key={d}>
      <span className={classNames(classes.txtOpt, 'option-sv-bar-decimal')}>
        {d}
      </span>
    </MenuItem>
  )) : [];
  const hasSelectedWaveLength = listWaveLength && listWaveLength.includes(selectedWaveLength);
  const resolvedSelectedWaveLength = hasSelectedWaveLength
    ? selectedWaveLength
    : (listWaveLength && listWaveLength[0]);

  return (
    <FormControl
      className={classNames(classes.fieldDecimal)}
      variant="outlined"
      style={{ width }}
    >
      <InputLabel id={labelId} className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Wavelength (nm)
      </InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={resolvedSelectedWaveLength}
        onChange={updateWavelengthAct}
        className={classNames(classes.selectInput, 'input-sv-bar-decimal')}
      >
        { items }
      </Select>
    </FormControl>
  );
};

export default renderWavelengthSelect;
