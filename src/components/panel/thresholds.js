import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Refresh from '@material-ui/icons/Refresh';
import CloudDone from '@material-ui/icons/CloudDone';
import HowToReg from '@material-ui/icons/HowToReg';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import { updateThreshold, resetThreshold } from '../../actions/threshold';
import { toggleIsEdit } from '../../actions/manager';

const Styles = () => ({
  container: {
    margin: '12px 18px',
  },
  btnRefresh: {
  },
  btnRestore: {
  },
  txtRestore: {
    margin: '0 10px',
  },
});

const txtPercent = () => (
  <InputAdornment position="end">
    <span className="txt-percent">
      %
    </span>
  </InputAdornment>
);

const setThreshold = (
  classes, thresVal, updateThresholdAct,
) => {
  const onBlur = e => updateThresholdAct(e.target.value);
  const onChange = e => updateThresholdAct(e.target.value);
  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      updateThresholdAct(e.target.value);
    }
  };

  return (
    <Tooltip
      title={<span className="txt-sv-tp">Threshold</span>}
      placement="top"
      disableFocusListener
      disableTouchListener
    >
      <TextField
        disabled={!thresVal}
        id="outlined-name"
        placeholder="N.A."
        type="number"
        value={thresVal || false}
        margin="normal"
        InputProps={{
          endAdornment: txtPercent(),
          className: 'txt-input',
        }}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onEnterPress}
      />
    </Tooltip>
  );
};

const btnRefresh = (
  classes, thresVal, resetThresholdAct,
) => (
  <IconButton
    disabled={!thresVal}
    variant="fab"
    color="primary"
    className={classNames(classes.btnRefresh)}
    onClick={resetThresholdAct}
  >
    <Refresh />
  </IconButton>
);

const restoreDisplay = (hasEdit, managerSt) => (
  hasEdit && managerSt.isEdit ? <HowToReg /> : <CloudDone />
);

const restoreTp = (hasEdit, managerSt) => (
  hasEdit && managerSt.isEdit ? 'User' : 'Automation'
);

const btnRestore = (classes, hasEdit, managerSt, toggleIsEditAct) => (
  <Tooltip
    title={<span className="txt-sv-tp">{restoreTp(hasEdit, managerSt)}</span>}
  >
    <IconButton
      disabled={!hasEdit}
      variant="fab"
      color="primary"
      className={classNames(classes.btnRestore)}
      onClick={toggleIsEditAct}
    >
      { restoreDisplay(hasEdit, managerSt) }
    </IconButton>
  </Tooltip>
);

const ThresholdsPanel = ({
  classes, peakObj, hasEdit, thresSt, managerSt,
  updateThresholdAct, resetThresholdAct, toggleIsEditAct,
}) => {
  const thresVal = thresSt || peakObj.thresRef;
  return (
    <Grid
      className={classNames(classes.container)}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={6}>
        { setThreshold(classes, thresVal, updateThresholdAct) }
      </Grid>
      <Grid item xs={3}>
        { btnRefresh(classes, thresVal, resetThresholdAct) }
      </Grid>
      <Grid item xs={3}>
        { btnRestore(classes, hasEdit, managerSt, toggleIsEditAct) }
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    thresSt: state.threshold,
    managerSt: state.manager,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateThresholdAct: updateThreshold,
    resetThresholdAct: resetThreshold,
    toggleIsEditAct: toggleIsEdit,
  }, dispatch)
);

ThresholdsPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  thresSt: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ],
  ).isRequired,
  managerSt: PropTypes.object.isRequired,
  updateThresholdAct: PropTypes.func.isRequired,
  resetThresholdAct: PropTypes.func.isRequired,
  toggleIsEditAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(Styles)(ThresholdsPanel));
