/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Select, FormControl, MenuItem, InputLabel,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';

import Scan from './r02_scan';
import { updateLayout } from '../../actions/layout';
import { setShiftRef } from '../../actions/shift';
import { LIST_LAYOUT } from '../../constants/list_layout';
import { getListShift } from '../../constants/list_shift';
import Cfg from '../../helpers/cfg';
import { commonStyle } from './common';
import Format from '../../helpers/format';

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
  classes, layoutSt, setShiftRefAct, shiftSt, curveSt,
) => {
  if (Cfg.hideSolvent(layoutSt)) return null;
  // const onChange = (e) => setShiftRefAct(e.target.value);
  const { curveIdx } = curveSt;
  const { shifts } = shiftSt;
  const selectedShift = shifts[curveIdx];
  const shiftRef = selectedShift.ref;

  const onChange = (e) => {
    const payload = { dataToSet: e.target.value, curveIdx };
    setShiftRefAct(payload);
  };

  const listShift = getListShift(layoutSt);

  const content = listShift.map((ref) => (
    <MenuItem value={ref} key={ref.name}>
      <span className={classNames(classes.txtOpt, 'option-sv-bar-shift')}>
        { `${ref.name}: ${Format.strNumberFixedDecimal(ref.value, 2)} ppm` }
      </span>
    </MenuItem>
  ));

  return (
    <FormControl
      className={classNames(classes.fieldShift)}
      variant="outlined"
    >
      <InputLabel id="select-solvent-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Solvent
      </InputLabel>
      <Select
        value={shiftRef}
        labelId="select-solvent-label"
        label="Solvent"
        onChange={onChange}
        className={classNames(classes.selectInput, 'input-sv-bar-shift')}
      >
        { content }
      </Select>
    </FormControl>
  );
};

const layoutSelect = (classes, layoutSt, updateLayoutAct) => {
  const onChange = (e) => updateLayoutAct(e.target.value);

  return (
    <FormControl
      className={classNames(classes.fieldLayout)}
    >
      <InputLabel id="select-layout-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Layout
      </InputLabel>
      <Select
        labelId="select-layout-label"
        label="Layout"
        value={layoutSt}
        onChange={onChange}
        className={classNames(classes.selectInput, 'input-sv-bar-layout')}
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
        <MenuItem value={LIST_LAYOUT.UVVIS}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>UV/VIS</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.HPLC_UVVIS}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>HPLC UV/VIS</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.TGA}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>TGA (THERMOGRAVIMETRIC ANALYSIS)</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.XRD}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>XRD (X-RAY DIFFRACTION)</span>
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
        <MenuItem value={LIST_LAYOUT.P31}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
            <sup>31</sup>
            P
          </span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.N15}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
            <sup>15</sup>
            N
          </span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.Si29}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
            <sup>29</sup>
            Si
          </span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.MS}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>MS</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.CYCLIC_VOLTAMMETRY}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>CV (CYCLIC VOLTAMMETRY)</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.CDS}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>CDS (CIRCULAR DICHROISM SPECTROSCOPY)</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.SEC}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>SEC</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.AIF}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>SOPTION-DESORPTION</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.EMISSIONS}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>EMISSIONS</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.DLS_ACF}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>DLS ACF</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.DLS_INTENSITY}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>DLS INTENSITY</span>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const Layout = ({
  classes, feature, hasEdit, layoutSt,
  setShiftRefAct, updateLayoutAct, curveSt, shiftSt,
}) => (
  <span className={classes.groupRight}>
    { layoutSelect(classes, layoutSt, updateLayoutAct) }
    { shiftSelect(classes, layoutSt, setShiftRefAct, shiftSt, curveSt) }
    <Scan feature={feature} hasEdit={hasEdit} />
  </span>
);

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    curveSt: state.curve,
    shiftSt: state.shift,
  }
);

const mapDispatchToProps = (dispatch) => (
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
  setShiftRefAct: PropTypes.func.isRequired,
  updateLayoutAct: PropTypes.func.isRequired,
  curveSt: PropTypes.object.isRequired,
  shiftSt: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Layout));
