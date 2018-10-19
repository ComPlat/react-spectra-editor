import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';

const Styles = () => ({
  tabContainer: {
    padding: '10px',
  },
  btnRefresh: {
  },
});

const SetThreshold = (
  classes, thresSt, enThresInput, onRefreshClick, updateThresholdAct,
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
          disabled={!enThresInput}
          id="outlined-name"
          label="Peak Picking Threshold"
          placeholder="N.A."
          type="number"
          value={thresSt}
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          onChange={onChange}
          onBlur={onBlur}
          onKeyPress={onEnterPress}
        />
      </Grid>
      <Grid item xs={2}>
        <IconButton
          disabled={!enThresInput}
          variant="fab"
          color="primary"
          className={classNames(classes.btnRefresh)}
          onClick={onRefreshClick}
        >
          <Refresh />
        </IconButton>
      </Grid>
    </Grid>
  );
};

const SetContent = (
  classes, item, thresSt, enThresInput, onRefreshClick, updateThresholdAct,
) => {
  if (item === 0) {
    return SetThreshold(
      classes,
      thresSt,
      enThresInput,
      onRefreshClick,
      updateThresholdAct,
    );
  }
  return (
    <p>TBD</p>
  );
};

const SettingsComp = ({
  classes, item, thresSt, enThresInput,
  onItemChange, onRefreshClick, updateThresholdAct,
}) => (
  <div>
    <AppBar position="static" color="default">
      <Tabs
        value={item}
        onChange={onItemChange}
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        // scrollable
      >
        <Tab label="Setting" />
      </Tabs>
    </AppBar>
    <div className={classNames(classes.tabContainer)}>
      {
        SetContent(
          classes,
          item,
          thresSt,
          enThresInput,
          onRefreshClick,
          updateThresholdAct,
        )
      }
    </div>
  </div>
);

SettingsComp.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.number.isRequired,
  thresSt: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ],
  ).isRequired,
  enThresInput: PropTypes.bool.isRequired,
  onItemChange: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  updateThresholdAct: PropTypes.func.isRequired,
};

export {
  Styles, SettingsComp,
};
