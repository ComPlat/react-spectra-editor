import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import BtnRefresh from './btn_refresh';
import BtnRestore from './btn_restore';
import {
  setScanTarget, resetScanTarget, toggleScanIsAuto,
} from '../../actions/scan';

const styles = () => ({
  container: {
    margin: '12px 18px',
  },
  formControl: {
    margin: '10px 20px 0px 10px',
    minWidth: 150,
  },
});

const scanSelect = (
  classes, feature, layoutSt, scanSt, onChange,
) => {
  const { target, count } = scanSt;
  if (!count) return null;
  const range = [...Array(count + 1).keys()].slice(1);
  const content = range.map(num => (
    <MenuItem value={num} key={num}>
      <span className="txt-sv-input-label">
        { `scan ${num}` }
      </span>
    </MenuItem>
  ));

  const defaultValue = scanSt.isAuto || !feature.scanEditTarget
    ? feature.scanAutoTarget
    : feature.scanEditTarget;
  const selValue = target || defaultValue;

  return (
    <Tooltip
      title={<span className="txt-sv-tp">Scan</span>}
      placement="left"
      disableFocusListener
      disableTouchListener
    >
      <div>
        <Select value={selValue} onChange={onChange}>
          { content }
        </Select>
      </div>
    </Tooltip>
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
    <Grid
      className={classNames(classes.container)}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={4}>
        {
          scanSelect(
            classes, feature, layoutSt, scanSt, onChange,
          )
        }
      </Grid>
      <Grid item xs={4}>
        <BtnRefresh
          disabled={false}
          refreshAct={resetScanTargetAct}
        />
      </Grid>
      <Grid item xs={4}>
        <BtnRestore
          hasEdit={hasEdit}
          isEdit={!scanSt.isAuto}
          toggleEditAct={toggleScanIsAutoAct}
        />
      </Grid>
    </Grid>
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
