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

import {
  updateThresholdValue, resetThresholdValue, toggleThresholdIsEdit,
} from '../../actions/threshold';


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
  classes, thresVal, updateThresholdValueAct,
) => {
  const onBlur = e => updateThresholdValueAct(e.target.value);
  const onChange = e => updateThresholdValueAct(e.target.value);
  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      updateThresholdValueAct(e.target.value);
    }
  };

  return (
    <Tooltip
      title={<span className="txt-sv-tp">Threshold</span>}
      placement="left"
      disableFocusListener
      disableTouchListener
    >
      <div>
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
      </div>
    </Tooltip>
  );
};

const btnRefresh = (
  classes, thresVal, resetThresholdValueAct,
) => (
  <IconButton
    disabled={!thresVal}
    variant="fab"
    color="primary"
    className={classNames(classes.btnRefresh)}
    onClick={resetThresholdValueAct}
  >
    <Refresh />
  </IconButton>
);

const restoreDisplay = (hasEdit, thresSt) => (
  hasEdit && thresSt.isEdit ? <HowToReg /> : <CloudDone />
);

const restoreTp = (hasEdit, thresSt) => (
  hasEdit && thresSt.isEdit ? 'User' : 'Automation'
);

const btnRestore = (classes, hasEdit, thresSt, toggleThresholdIsEditAct) => (
  <Tooltip
    title={<span className="txt-sv-tp">{restoreTp(hasEdit, thresSt)}</span>}
  >
    <div>
      <IconButton
        disabled={!hasEdit}
        variant="fab"
        color="primary"
        className={classNames(classes.btnRestore)}
        onClick={toggleThresholdIsEditAct}
      >
        { restoreDisplay(hasEdit, thresSt) }
      </IconButton>
    </div>
  </Tooltip>
);

const ThresholdsPanel = ({
  classes, feature, hasEdit, layoutSt, thresSt,
  updateThresholdValueAct, resetThresholdValueAct, toggleThresholdIsEditAct,
}) => {
  const isMs = ['MS'].indexOf(layoutSt) >= 0;
  const thresVal = thresSt.value || feature.thresRef;
  return (
    <Grid
      className={classNames(classes.container)}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={4}>
        { setThreshold(classes, thresVal, updateThresholdValueAct) }
      </Grid>
      <Grid item xs={4}>
        { btnRefresh(classes, thresVal, resetThresholdValueAct) }
      </Grid>
      {
        isMs
          ? null
          : (
            <Grid item xs={4}>
              { btnRestore(classes, hasEdit, thresSt, toggleThresholdIsEditAct) }
            </Grid>
          )
      }
    </Grid>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    thresSt: state.threshold,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateThresholdValueAct: updateThresholdValue,
    resetThresholdValueAct: resetThresholdValue,
    toggleThresholdIsEditAct: toggleThresholdIsEdit,
  }, dispatch)
);

ThresholdsPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  layoutSt: PropTypes.string.isRequired,
  thresSt: PropTypes.object.isRequired,
  updateThresholdValueAct: PropTypes.func.isRequired,
  resetThresholdValueAct: PropTypes.func.isRequired,
  toggleThresholdIsEditAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(Styles)(ThresholdsPanel));
