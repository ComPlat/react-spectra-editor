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

import Scan from './r02_scan';
import { updateLayout } from '../../actions/layout';
import { setShiftRef } from '../../actions/shift';
import { LIST_LAYOUT } from '../../constants/list_layout';
import { getListShift } from '../../constants/list_shift';
import Cfg from '../../helpers/cfg';
import { commonStyle } from './common';

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

const shiftSelect = (
  classes, layoutSt, shiftRefSt, shiftEnableSt, setShiftRefAct,
) => {
  if (!shiftEnableSt) return null;
  if (Cfg.hideSolvent(layoutSt)) return null;
  const onChange = e => setShiftRefAct(e.target.value);

  const listShift = getListShift(layoutSt);

  const content = listShift.map(ref => (
    <MenuItem value={ref} key={ref.name}>
      <span className={classNames(classes.txtOpt, 'option-sv-bar-shift')}>
        { `${ref.name}: ${ref.value} ppm` }
      </span>
    </MenuItem>
  ));

  return (
    <FormControl
      className={classNames(classes.fieldShift)}
      variant="outlined"
    >
      <InputLabel className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Solvent
      </InputLabel>
      <Select
        value={shiftRefSt}
        onChange={onChange}
        input={
          (
            <OutlinedInput
              className={classNames(classes.selectInput, 'input-sv-bar-shift')}
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
      className={classNames(classes.fieldLayout)}
      variant="outlined"
    >
      <InputLabel className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Layout
      </InputLabel>
      <Select
        value={layoutSt}
        onChange={onChange}
        input={
          (
            <OutlinedInput
              className={classNames(classes.selectInput, 'input-sv-bar-layout')}
              labelWidth={60}
            />
          )
        }
      >
        <MenuItem value={LIST_LAYOUT.PLAIN}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>plain</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.IR}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>IR</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.RAMAN}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>RAMAN</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.H1}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
            <sup>1</sup>
            H
          </span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.C13}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
            <sup>13</sup>
            C
          </span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.F19}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
            <sup>19</sup>
            F
          </span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.MS}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>MS</span>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const Layout = ({
  classes, feature, hasEdit, layoutSt, shiftRefSt, shiftEnableSt,
  setShiftRefAct, updateLayoutAct,
}) => (
  <span className={classes.groupRight}>
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
)(withStyles(styles)(Layout));
