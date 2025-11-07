/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */
import React, { useEffect } from 'react';
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
  if (Cfg.hideSolvent(layoutSt)) {
    return null;
  }

  const { curveIdx } = curveSt;
  const { shifts } = shiftSt;
  const selectedShift = shifts[curveIdx] || {};
  const listShift = getListShift(layoutSt) || [];

  const shiftRefName = selectedShift?.ref?.name || '';
  const isInList = listShift.some((r) => r.name === shiftRefName);
  const selectValue = isInList ? shiftRefName : '';

  const onChange = (e) => {
    const name = e.target.value;
    const refObj = listShift.find((r) => r.name === name);
    if (refObj) {
      setShiftRefAct({ dataToSet: refObj, curveIdx });
    }
  };

  return (
    <FormControl className={classNames(classes.fieldShift)} variant="outlined">
      <InputLabel id="select-solvent-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Reference
      </InputLabel>
      <Select
        value={selectValue}
        labelId="select-solvent-label"
        label="Solvent"
        onChange={onChange}
        className={classNames(classes.selectInput, 'input-sv-bar-shift')}
      >
        {listShift.map((ref) => (
          <MenuItem value={ref.name} key={ref.name}>
            <span className={classNames(classes.txtOpt, 'option-sv-bar-shift')}>
              {`${ref.name}: ${Format.strNumberFixedDecimal(ref.value, 2)} ppm`}
            </span>
          </MenuItem>
        ))}
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
        <MenuItem value={LIST_LAYOUT.DSC}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>DSC (DIFFERENTIAL SCANNING CALORIMETRY)</span>
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
        <MenuItem value={LIST_LAYOUT.GC}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>GC (GAS CHROMATOGRAPHY)</span>
        </MenuItem>
        <MenuItem value={LIST_LAYOUT.AIF}>
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>SORPTION-DESORPTION</span>
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

const PLACEHOLDER = '- - -';

const norm = (s) => (s || '').toString().toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '');

function solventKeyOf(feature) {
  const r = feature?.metadata?.solventName ?? feature?.metadata?.solvent
    ?? feature?.meta?.solventName ?? feature?.meta?.solvent
    ?? feature?.solventName ?? feature?.solvent ?? null;
  const a = feature?.metadata?.solvent_label ?? feature?.metadata?.solventLabel ?? null;
  const raw = r && r !== PLACEHOLDER ? r : null;
  const alt = a && a !== PLACEHOLDER ? a : null;
  return norm(raw || alt || '');
}

function pickBestRef(list, key) {
  if (!key || !list?.length) return null;
  const scored = [];
  list.forEach((r) => {
    const nLabel = norm(r.label);
    const nName = norm(r.name);
    const nNsdb = norm(r.nsdb);
    let s = 0;
    if (nLabel && nLabel === key) s += 3;
    if (nNsdb && nNsdb.includes(key)) s += 2;
    if (nName && nName.includes(key)) s += 1;
    if (s > 0) scored.push({ r, s });
  });
  if (!scored.length) return null;
  let max = 0;
  scored.forEach((x) => {
    if (x.s > max) max = x.s;
  });
  let cand = scored.filter((x) => x.s === max).map((x) => x.r);
  if (cand.length > 1) {
    const vals = cand.map((c) => (typeof c.value === 'number' ? c.value : null))
      .filter((v) => v != null).sort((a, b) => a - b);
    if (vals.length) {
      const m = vals[Math.floor(vals.length / 2)];
      cand = cand.slice().sort((a, b) => Math.abs((a.value ?? m) - m)
        - Math.abs((b.value ?? m) - m));
    }
    if (cand.length > 1) {
      cand.sort((a, b) => (a.name?.length || 0) - (b.name?.length || 0));
    }
  }
  return cand[0] || null;
}

function isRefUnset(shiftSt, curveIdx, list) {
  const name = shiftSt?.shifts?.[curveIdx]?.ref?.name || '';
  if (!name || name === PLACEHOLDER) return true;
  return !(list || []).some((r) => r.name === name);
}

const Layout = ({
  classes, feature, hasEdit, layoutSt,
  setShiftRefAct, updateLayoutAct, curveSt, shiftSt,
}) => {
  const { curveIdx } = curveSt;
  const list = getListShift(layoutSt) || [];
  const unset = isRefUnset(shiftSt, curveIdx, list);
  const key = solventKeyOf(feature);
  const best = pickBestRef(list, key);

  useEffect(() => {
    if (unset && best) setShiftRefAct({ dataToSet: best, curveIdx });
  }, [unset, best, curveIdx, setShiftRefAct]);

  return (
    <span className={classes.groupRight}>
      { layoutSelect(classes, layoutSt, updateLayoutAct) }
      { shiftSelect(classes, layoutSt, setShiftRefAct, shiftSt, curveSt) }
      <Scan feature={feature} hasEdit={hasEdit} />
    </span>
  );
};

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
