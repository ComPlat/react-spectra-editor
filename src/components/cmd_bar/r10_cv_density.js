/* eslint-disable react/function-component-definition, react/jsx-one-expression-per-line,
react/jsx-boolean-value */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import {
  FormControl, InputLabel, OutlinedInput, Select, MenuItem, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { LIST_LAYOUT } from '../../constants/list_layout';
import { commonStyle } from './common';
import { setCyclicVoltaAreaValue, setCyclicVoltaAreaUnit, toggleCyclicVoltaDensity } from '../../actions/cyclic_voltammetry';

const styles = () => ({
  ...commonStyle,
  fieldArea: {
    width: 100,
  },
  fieldUnit: {
    width: 75,
  },
});

const units = ['cm²', 'mm²'];

const CvDensityControls = ({
  classes, layoutSt, areaValue, areaUnit, useCurrentDensity,
  setAreaValueAct, setAreaUnitAct, toggleDensityAct,
}) => {
  if (layoutSt !== LIST_LAYOUT.CYCLIC_VOLTAMMETRY) return <i />;

  const handleAreaChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      setAreaValueAct('');
      return;
    }
    const val = parseFloat(raw);
    if (Number.isNaN(val)) return;
    if (val < 0) return;
    setAreaValueAct(val);
  };
  const handleAreaBlur = (e) => {
    const raw = e.target.value;
    const val = parseFloat(raw);
    if (raw === '' || Number.isNaN(val) || val <= 0) {
      setAreaValueAct(1.0);
    }
  };
  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    const currVal = areaValue;
    if (currVal !== '' && Number.isFinite(Number(currVal))) {
      const num = Number(currVal);
      const from = areaUnit;
      const to = newUnit;
      let converted = num;
      if (from === 'cm²' && to === 'mm²') converted = num * 100.0;
      if (from === 'mm²' && to === 'cm²') converted = num / 100.0;
      setAreaValueAct(converted);
    }
    setAreaUnitAct(newUnit);
  };
  const handleToggle = (_, val) => {
    if (val === null) return;
    const shouldBeDensity = (val === 'density');
    if (shouldBeDensity !== useCurrentDensity) {
      toggleDensityAct();
    }
  };

  return (
    <span className={classes.groupRight}>
      <FormControl className={classNames(classes.fieldArea)} variant="outlined" disabled={!useCurrentDensity}>
        <InputLabel htmlFor="cv-area" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>WE-ECSA</InputLabel>
        <OutlinedInput
          id="cv-area"
          label="WE-ECSA"
          type="number"
          inputProps={{ step: '0.0001', min: '0' }}
          value={areaValue}
          onChange={handleAreaChange}
          onBlur={handleAreaBlur}
          className={classNames(classes.txtInput, 'input-sv-bar-layout')}
          disabled={!useCurrentDensity}
        />
      </FormControl>
      <FormControl className={classNames(classes.fieldUnit)} variant="outlined" disabled={!useCurrentDensity}>
        <InputLabel id="cv-area-unit" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
          Unit
        </InputLabel>
        <Select
          value={areaUnit}
          onChange={handleUnitChange}
          labelId="cv-area-unit"
          label="Unit"
          className={classNames(classes.selectInput, 'input-sv-bar-layout')}
          disabled={!useCurrentDensity}
        >
          {units.map((u) => (
            <MenuItem key={u} value={u}>
              <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
                {u}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={useCurrentDensity ? 'density' : 'current'}
        onChange={handleToggle}
        className={classNames(classes.selectInput, 'input-sv-bar-layout')}
      >
        <ToggleButton value="current" className={classNames(classes.txtOpt)}>
          Current
        </ToggleButton>
        <ToggleButton value="density" className={classNames(classes.txtOpt)}>
          Current / Area
        </ToggleButton>
      </ToggleButtonGroup>
    </span>
  );
};

CvDensityControls.propTypes = {
  classes: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  areaValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  areaUnit: PropTypes.string.isRequired,
  useCurrentDensity: PropTypes.bool.isRequired,
  setAreaValueAct: PropTypes.func.isRequired,
  setAreaUnitAct: PropTypes.func.isRequired,
  toggleDensityAct: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  layoutSt: state.layout,
  areaValue: state.cyclicvolta.areaValue,
  areaUnit: state.cyclicvolta.areaUnit,
  useCurrentDensity: state.cyclicvolta.useCurrentDensity,
});

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setAreaValueAct: setCyclicVoltaAreaValue,
    setAreaUnitAct: setCyclicVoltaAreaUnit,
    toggleDensityAct: toggleCyclicVoltaDensity,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CvDensityControls));
