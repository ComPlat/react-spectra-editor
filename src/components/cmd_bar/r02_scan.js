/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CloudDoneOutlinedIcon from '@material-ui/icons/CloudDoneOutlined';
import HowToRegOutlinedIcon from '@material-ui/icons/HowToRegOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

import {
  setScanTarget, resetScanTarget, toggleScanIsAuto,
} from '../../actions/scan';
import { MuButton, commonStyle } from './common';

const styles = () => (
  Object.assign(
    {
      fieldScan: {
        width: 90,
      },
    },
    commonStyle,
  )
);

const restoreIcon = (classes, hasEdit, isEdit) => (
  hasEdit && isEdit
    ? <HowToRegOutlinedIcon className={classes.icon} />
    : <CloudDoneOutlinedIcon className={classes.icon} />
);

const restoreTp = (hasEdit, isEdit) => (
  hasEdit && isEdit ? 'User Defined Scan' : 'Auto Picked Scan'
);

const btnRestore = (
  classes, hasEdit, isEdit, toggleEditAct,
) => (
  <Tooltip title={<span className="txt-sv-tp">{restoreTp(hasEdit, isEdit)}</span>}>
    <MuButton
      className={
        classNames(
          'btn-sv-bar-scanrst',
        )
      }
      disabled={!hasEdit}
      onClick={toggleEditAct}
    >
      { restoreIcon(classes, hasEdit, isEdit) }
    </MuButton>
  </Tooltip>
);

const btnRrfresh = (
  classes, disabled, refreshAct,
) => (
  <Tooltip title={<span className="txt-sv-tp">Refresh Scan</span>}>
    <MuButton
      className={
        classNames(
          'btn-sv-bar-scanrfs',
        )
      }
      disabled={disabled}
      onClick={refreshAct}
    >
      <RefreshOutlinedIcon className={classes.icon} />
    </MuButton>
  </Tooltip>
);

const scanSelect = (
  classes, feature, layoutSt, scanSt, onChange,
) => {
  const { target, count } = scanSt;
  if (!count) return null;
  const range = [...Array(count + 1).keys()].slice(1);
  const content = range.map((num) => (
    <MenuItem value={num} key={num}>
      <span className={classNames(classes.txtOpt, 'option-sv-bar-scan')}>
        { `scan ${num}` }
      </span>
    </MenuItem>
  ));

  const defaultValue = scanSt.isAuto || !feature.scanEditTarget
    ? feature.scanAutoTarget
    : feature.scanEditTarget;
  const selValue = target || defaultValue || 1;

  return (
    <FormControl
      className={classNames(classes.fieldScan)}
      variant="outlined"
    >
      <InputLabel className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Current Scan
      </InputLabel>
      <Select
        value={selValue}
        onChange={onChange}
        input={
          (
            <OutlinedInput
              className={classNames(classes.selectInput, 'input-sv-bar-scan')}
              labelWidth={90}
            />
          )
        }
      >
        { content }
      </Select>
    </FormControl>
  );
};

const Scan = ({
  classes, feature, hasEdit, layoutSt, scanSt,
  setScanTargetAct, resetScanTargetAct, toggleScanIsAutoAct,
}) => {
  const isMs = ['MS'].indexOf(layoutSt) >= 0;
  if (!isMs) return null;

  const onChange = (e) => setScanTargetAct(e.target.value);

  return (
    <span>
      {
        scanSelect(
          classes, feature, layoutSt, scanSt, onChange,
        )
      }
      {
        btnRrfresh(
          classes, false, resetScanTargetAct,
        )
      }
      {
        btnRestore(
          classes, hasEdit, !scanSt.isAuto, toggleScanIsAutoAct,
        )
      }
    </span>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    scanSt: state.scan,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setScanTargetAct: setScanTarget,
    resetScanTargetAct: resetScanTarget,
    toggleScanIsAutoAct: toggleScanIsAuto,
  }, dispatch)
);

Scan.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  layoutSt: PropTypes.string.isRequired,
  scanSt: PropTypes.object.isRequired,
  setScanTargetAct: PropTypes.func.isRequired,
  resetScanTargetAct: PropTypes.func.isRequired,
  toggleScanIsAutoAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Scan);
