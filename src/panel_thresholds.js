import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Refresh from '@material-ui/icons/Refresh';
import CloudDone from '@material-ui/icons/CloudDone';
import HowToReg from '@material-ui/icons/HowToReg';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import { updateThreshold, resetThreshold } from './actions/threshold';
import { toggleIsEdit } from './actions/manager';

const Styles = () => ({
  btnRefresh: {
  },
  btnRestore: {
  },
  txtRestore: {
    margin: '0 10px',
  },
});

const txtInputLabel = () => (
  <span className="txt-input-label">
    Picking Threshold
  </span>
);

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
    <Grid item xs={8}>
      <TextField
        disabled={!thresVal}
        id="outlined-name"
        label={txtInputLabel()}
        placeholder="N.A."
        type="number"
        value={thresVal || false}
        margin="normal"
        variant="outlined"
        InputProps={{
          endAdornment: txtPercent(),
          className: 'txt-input',
        }}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onEnterPress}
      />
    </Grid>
  );
};

const btnRefresh = (
  classes, thresVal, resetThresholdAct,
) => (
  <Grid item xs={4}>
    <IconButton
      disabled={!thresVal}
      variant="fab"
      color="primary"
      className={classNames(classes.btnRefresh)}
      onClick={resetThresholdAct}
    >
      <Refresh />
    </IconButton>
  </Grid>
);

const restoreDisplay = (hasEdit, managerSt) => (
  hasEdit && managerSt.isEdit ? <HowToReg /> : <CloudDone />
);

const restoreTp = (hasEdit, managerSt) => (
  hasEdit && managerSt.isEdit ? 'User' : 'Automation'
);

const btnRestore = (classes, hasEdit, managerSt, toggleIsEditAct) => (
  <Grid
    container
    direction="row"
    justify="center"
    alignItems="center"
  >
    <Grid item xs={8}>
      <span className={classNames(classes.txtRestore, 'txt-panel-content')}>
        <i>Peaks defined by: </i>
      </span>
    </Grid>
    <Grid item xs={4}>
      <Tooltip
        title={<span className="txt-sv-tp">{restoreTp(hasEdit, managerSt)}</span>}
      >
        <div>
          <Button
            variant="outlined"
            color="default"
            className={classNames(classes.btnRestore)}
            onClick={toggleIsEditAct}
            disabled={!hasEdit}
          >
            { restoreDisplay(hasEdit, managerSt) }
          </Button>
        </div>
      </Tooltip>
    </Grid>
  </Grid>
);

const ThresholdsPanel = ({
  classes, peakObj, hasEdit, thresSt, managerSt,
  updateThresholdAct, resetThresholdAct, toggleIsEditAct,
}) => {
  const thresVal = thresSt || peakObj.thresRef;
  return (
    <ExpansionPanelDetails>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        { setThreshold(classes, thresVal, updateThresholdAct) }
        { btnRefresh(classes, thresVal, resetThresholdAct) }
        { btnRestore(classes, hasEdit, managerSt, toggleIsEditAct) }
      </Grid>
    </ExpansionPanelDetails>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(ThresholdsPanel));
