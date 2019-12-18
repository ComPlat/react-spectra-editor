import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

import { setShiftRef } from '../../actions/shift';
import { LIST_SHIFT_13C, LIST_SHIFT_1H } from '../../constants/list_shift';
import { LIST_LAYOUT } from '../../constants/list_layout';


const Styles = () => ({
  container: {
    margin: '12px 18px',
  },
  formControl: {
    margin: '10px 20px 0px 10px',
    minWidth: 150,
  },
});

const shiftSelection = (classes, layoutSt, shiftRefSt, onChange) => {
  const listShift = layoutSt === LIST_LAYOUT.C13
    ? LIST_SHIFT_13C
    : LIST_SHIFT_1H;

  const content = listShift.map(ref => (
    <MenuItem value={ref} key={ref.name}>
      <span className="txt-sv-input-label">
        { `${ref.name}: ${ref.value} ppm` }
      </span>
    </MenuItem>
  ));

  return (
    <FormControl
      variant="outlined"
      className={classNames(classes.formControl)}
    >
      <InputLabel shrink>
        <p className="txt-field-label">
          Shift Reference
        </p>
      </InputLabel>
      <Select value={shiftRefSt} onChange={onChange}>
        { content }
      </Select>
    </FormControl>
  );
};

const ShiftSelect = ({
  classes, layoutSt, shiftRefSt, shiftEnableSt, setShiftRefAct,
}) => {
  const onChange = e => setShiftRefAct(e.target.value);
  if (!shiftEnableSt) return null;

  return (
    <Grid
      className={classNames(classes.container)}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        { shiftSelection(classes, layoutSt, shiftRefSt, onChange) }
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    shiftRefSt: state.shift.ref,
    shiftEnableSt: state.shift.enable,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setShiftRefAct: setShiftRef,
  }, dispatch)
);

ShiftSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  shiftRefSt: PropTypes.object.isRequired,
  shiftEnableSt: PropTypes.bool.isRequired,
  setShiftRefAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(ShiftSelect);
