import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';

import BtnRefresh from './btn_refresh';
import BtnRestore from './btn_restore';
import {
  updateThresholdValue, resetThresholdValue, toggleThresholdIsEdit,
} from '../../actions/threshold';

const styles = () => ({
  container: {
    margin: '12px 18px',
  },
  txtThres: {
    margin: '0 0 10px 0',
  },
});

const txtPercent = () => (
  <InputAdornment position="end">
    <span className="txt-percent">
      %
    </span>
  </InputAdornment>
);

const thresLable = classes => (
  <p className={classNames(classes.txtThres, 'txt-field-label')}>
    Threshold
  </p>
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
    <div>
      <TextField
        disabled={!thresVal}
        id="outlined-name"
        placeholder="N.A."
        type="number"
        label={thresLable(classes)}
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
  );
};

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
        <BtnRefresh
          disabled={!thresVal}
          refreshAct={resetThresholdValueAct}
        />
      </Grid>
      {
        isMs
          ? null
          : (
            <Grid item xs={4}>
              <BtnRestore
                hasEdit={hasEdit}
                isEdit={thresSt.isEdit}
                toggleEditAct={toggleThresholdIsEditAct}
              />
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
)(withStyles(styles)(ThresholdsPanel));
