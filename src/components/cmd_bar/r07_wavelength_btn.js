/* eslint-disable prefer-object-spread, react/jsx-one-expression-per-line,
react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import {
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { updateWaveLength } from '../../actions/wavelength';
import Format from '../../helpers/format';
import { commonStyle } from './common';
import { LIST_WAVE_LENGTH } from '../../constants/list_wavelength';

const styles = () => (
  Object.assign(
    {
      fieldShift: {
        width: 160,
      },
      fieldLayout: {
        width: 100,
      },
    },
    commonStyle,
  )
);

const wavelengthSelect = (classes, waveLengthSt, layoutSt, updateWaveLengthAct) => {
  if (!Format.isXRDLayout(layoutSt)) {
    return (
      <i />
    );
  }

  const onChange = (e) => updateWaveLengthAct(e.target.value);

  return (
    <FormControl
      className={classNames(classes.fieldLayout)}
      variant="outlined"
    >
      <InputLabel id="select-wavelength-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Wavelength (nm)
      </InputLabel>
      <Select
        labelId="select-wavelength-label"
        label="Wavelength"
        value={waveLengthSt}
        onChange={onChange}
        className={classNames(classes.selectInput, 'input-sv-bar-layout')}
      >
        {
          LIST_WAVE_LENGTH.map(item => { // eslint-disable-line
            return (
              <MenuItem value={item}>
                <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
                  {item.label} ({item.value} {item.unit})
                </span>
              </MenuItem>
            );
          })
        }
      </Select>
    </FormControl>
  );
};

const Wavelength = ({
  classes, waveLengthSt, layoutSt, updateWaveLengthAct,
}) => (
  <span className={classes.groupRight}>
    { wavelengthSelect(classes, waveLengthSt, layoutSt, updateWaveLengthAct) }
  </span>
);

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    waveLengthSt: state.wavelength,
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    updateWaveLengthAct: updateWaveLength,
  }, dispatch)
);

Wavelength.propTypes = {
  classes: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  waveLengthSt: PropTypes.object.isRequired,
  updateWaveLengthAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Wavelength));
