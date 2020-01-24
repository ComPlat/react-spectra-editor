import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';

import Scan from './scan';
import { updateLayout } from '../../actions/layout';
import { setShiftRef } from '../../actions/shift';
import { LIST_LAYOUT } from '../../constants/list_layout';
import { LIST_SHIFT_13C, LIST_SHIFT_1H } from '../../constants/list_shift';

const Styles = () => ({
  container: {
    margin: '0 0 0 0',
  },
  formControl: {
    minWidth: 80,
    margin: '0 3px 0 3px',
  },
  formControlSft: {
    minWidth: 200,
    margin: '0 3px 0 3px',
  },
  selectInput: {
    height: 30,
    margin: '6px 0 0 0',
  },
  selectInputCls: {
    padding: '0 15px 0 15px',
  },
  selectLabel: {
    margin: '6px 0 0 0',
  },
  selectTxt: {
    fontSize: '0.9rem',
    fontFamily: 'Helvetica',
  },
});

const shiftSelect = (
  classes, layoutSt, shiftRefSt, shiftEnableSt, setShiftRefAct,
) => {
  if (!shiftEnableSt) return null;
  const onChange = e => setShiftRefAct(e.target.value);

  const listShift = layoutSt === LIST_LAYOUT.C13
    ? LIST_SHIFT_13C
    : LIST_SHIFT_1H;

  const content = listShift.map(ref => (
    <MenuItem value={ref} key={ref.name}>
      <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
        { `${ref.name}: ${ref.value}ppm` }
      </span>
    </MenuItem>
  ));

  return (
    <FormControl
      className={classNames(classes.formControlSft)}
      variant="outlined"
    >
      <InputLabel className={classes.selectLabel}>
        Solvent
      </InputLabel>
      <Select
        value={shiftRefSt}
        onChange={onChange}
        input={
          (
            <OutlinedInput
              className={classes.selectInput}
              classes={{ input: classes.selectInputCls }}
              labelWidth={60}
            />
          )
        }
      >
        { content }
      </Select>
    </FormControl>
  );
};

const layoutSelect = (classes, layoutSt, updateLayoutAct) => {
  const onChange = e => updateLayoutAct(e.target.value);

  return (
    <FormControl
      className={classNames(classes.formControl)}
      variant="outlined"
    >
      <InputLabel className={classes.selectLabel}>
        Layout
      </InputLabel>
      <Select
        value={layoutSt}
        onChange={onChange}
        input={
          (
            <OutlinedInput
              className={classes.selectInput}
              classes={{ input: classes.selectInputCls }}
              labelWidth={60}
            />
          )
        }
      >
        <MenuItem value={LIST_LAYOUT.PLAIN}>
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>plain</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.IR}>
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>IR</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.H1}>
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            <sup>1</sup>
            H
          </span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.C13}>
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            <sup>13</sup>
            C
          </span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.MS}>
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>MS</span>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const Layout = ({
  classes, feature, hasEdit, layoutSt, shiftRefSt, shiftEnableSt,
  setShiftRefAct, updateLayoutAct,
}) => (
  <span>
    { layoutSelect(classes, layoutSt, updateLayoutAct) }
    { shiftSelect(classes, layoutSt, shiftRefSt, shiftEnableSt, setShiftRefAct) }
    <Scan feature={feature} hasEdit={hasEdit} />
  </span>
);

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
    updateLayoutAct: updateLayout,
  }, dispatch)
);

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  layoutSt: PropTypes.string.isRequired,
  shiftRefSt: PropTypes.object.isRequired,
  shiftEnableSt: PropTypes.bool.isRequired,
  setShiftRefAct: PropTypes.func.isRequired,
  updateLayoutAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(Styles)(Layout));
