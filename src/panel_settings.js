import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Refresh from '@material-ui/icons/Refresh';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { updateThreshold, resetThreshold } from './actions/threshold';

const Styles = () => ({
  tabContainer: {
    padding: '10px',
  },
  btnRefresh: {
  },
  panelSummary: {
    backgroundColor: '#e0e0e0',
  },
});

const txtInputLabel = () => (
  <span className="txt-input-label">
    Peak Picking Threshold
  </span>
);

const txtPercent = () => (
  <InputAdornment position="end">
    <span className="txt-percent">
      %
    </span>
  </InputAdornment>
);

const SetThreshold = (
  classes, thresVal, updateThresholdAct, resetThresholdAct,
) => {
  const onBlur = e => updateThresholdAct(e.target.value);
  const onChange = e => updateThresholdAct(e.target.value);
  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      updateThresholdAct(e.target.value);
    }
  };

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={10}>
        <TextField
          disabled={!thresVal}
          id="outlined-name"
          label={txtInputLabel()}
          placeholder="N.A."
          type="number"
          value={thresVal}
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
      <Grid item xs={2}>
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
    </Grid>
  );
};

const SettingsPanel = ({
  classes, peakObj, thresSt, updateThresholdAct, resetThresholdAct,
}) => {
  const thresVal = thresSt || peakObj.thresRef;
  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography>Settings</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {
          SetThreshold(
            classes,
            thresVal,
            updateThresholdAct,
            resetThresholdAct,
          )
        }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    thresSt: state.threshold,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateThresholdAct: updateThreshold,
    resetThresholdAct: resetThreshold,
  }, dispatch)
);

SettingsPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
  thresSt: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ],
  ).isRequired,
  updateThresholdAct: PropTypes.func.isRequired,
  resetThresholdAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(SettingsPanel));
