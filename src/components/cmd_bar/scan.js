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
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CloudDoneOutlinedIcon from '@material-ui/icons/CloudDoneOutlined';
import HowToRegOutlinedIcon from '@material-ui/icons/HowToRegOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

import {
  setScanTarget, resetScanTarget, toggleScanIsAuto,
} from '../../actions/scan';

const styles = () => ({
  container: {
    margin: '12px 18px',
  },
  formControlScan: {
    minWidth: 100,
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
  btn: {
    minWidth: 40,
  },
  selectTxt: {
    fontSize: '0.9rem',
    fontFamily: 'Helvetica',
  },
});

const restoreIcon = (hasEdit, isEdit) => (
  hasEdit && isEdit ? <HowToRegOutlinedIcon /> : <CloudDoneOutlinedIcon />
);

const restoreTp = (hasEdit, isEdit) => (
  hasEdit && isEdit ? 'User Defined Scan' : 'Auto Picked Scan'
);

const btnRestore = (
  classes, hasEdit, isEdit, toggleEditAct,
) => (
  <Tooltip title={restoreTp(hasEdit, isEdit)}>
    <span>
      <Button
        className={classes.btn}
        disabled={!hasEdit}
        onClick={toggleEditAct}
      >
        { restoreIcon(hasEdit, isEdit) }
      </Button>
    </span>
  </Tooltip>
);

const btnRrfresh = (
  classes, disabled, refreshAct,
) => (
  <Tooltip title="Refresh Scan">
    <span>
      <Button
        className={classes.btn}
        disabled={disabled}
        onClick={refreshAct}
      >
        <RefreshOutlinedIcon />
      </Button>
    </span>
  </Tooltip>
);

const scanSelect = (
  classes, feature, layoutSt, scanSt, onChange,
) => {
  const { target, count } = scanSt;
  if (!count) return null;
  const range = [...Array(count + 1).keys()].slice(1);
  const content = range.map(num => (
    <MenuItem value={num} key={num}>
      <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
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
      className={classNames(classes.formControlScan)}
      variant="outlined"
    >
      <InputLabel className={classes.selectLabel}>
        Current Scan
      </InputLabel>
      <Select
        value={selValue}
        onChange={onChange}
        input={
          (
            <OutlinedInput
              className={classes.selectInput}
              classes={{ input: classes.selectInputCls }}
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

  const onChange = e => setScanTargetAct(e.target.value);

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

const mapDispatchToProps = dispatch => (
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
