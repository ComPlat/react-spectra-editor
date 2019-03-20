import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';
import { withStyles } from '@material-ui/core/styles';

import { setScanTarget, resetScanTarget } from '../../actions/scan';

const styles = () => ({
  container: {
    margin: '12px 18px',
  },
  btnRefresh: {
  },
  formControl: {
    margin: '10px 20px 0px 10px',
    minWidth: 150,
  },
});

const btnRefresh = (
  classes, resetScanTargetAct,
) => (
  <IconButton
    variant="fab"
    color="primary"
    className={classNames(classes.btnRefresh)}
    onClick={resetScanTargetAct}
  >
    <Refresh />
  </IconButton>
);

const scanSelection = (
  classes, feature, layoutSt, scanSt, onChange,
) => {
  const { target, count } = scanSt;
  const range = [...Array(count + 1).keys()].slice(1);
  const content = range.map(num => (
    <MenuItem value={num} key={num}>
      <span className="txt-sv-input-label">
        { `scan ${num}` }
      </span>
    </MenuItem>
  ));

  const selValue = target || feature.scanTarget;

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

const ScanSelect = ({
  classes, feature, layoutSt, scanSt, setScanTargetAct, resetScanTargetAct,
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
          scanSelection(
            classes, feature, layoutSt, scanSt, onChange,
          )
        }
      </Grid>
      <Grid item xs={4}>
        { btnRefresh(classes, resetScanTargetAct) }
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
  }, dispatch)
);

ScanSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  scanSt: PropTypes.object.isRequired,
  setScanTargetAct: PropTypes.func.isRequired,
  resetScanTargetAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ScanSelect);
