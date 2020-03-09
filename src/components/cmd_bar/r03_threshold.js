import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CloudDoneOutlinedIcon from '@material-ui/icons/CloudDoneOutlined';
import HowToRegOutlinedIcon from '@material-ui/icons/HowToRegOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

import Cfg from '../../helpers/cfg';
import {
  updateThresholdValue, resetThresholdValue, toggleThresholdIsEdit,
} from '../../actions/threshold';
import { MuButton, commonStyle } from './common';

const styles = () => (
  Object.assign(
    {
      field: {
        width: 110,
      },
      txtIcon: {
      },
    },
    commonStyle,
  )
);

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
    <TextField
      className={classes.field}
      disabled={Cfg.btnCmdThres(thresVal)}
      id="outlined-name"
      placeholder="N.A."
      type="number"
      value={thresVal || false}
      margin="none"
      InputProps={{
        endAdornment: txtPercent(),
        className: classNames(classes.txtInput, 'txtfield-sv-bar-input'),
      }}
      label={<span className={classNames(classes.txtLabel, 'txtfield-sv-bar-label')}>Threshold</span>}
      onChange={onChange}
      onBlur={onBlur}
      onKeyPress={onEnterPress}
      variant="outlined"
    />
  );
};

const restoreIcon = (classes, hasEdit, isEdit) => (
  hasEdit && isEdit
    ? <HowToRegOutlinedIcon className={classes.icon} />
    : <CloudDoneOutlinedIcon className={classes.icon} />
);

const restoreTp = (hasEdit, isEdit) => (
  hasEdit && isEdit ? 'User Defined Threshold' : 'Auto Picked Threshold'
);

const Threshold = ({
  classes, feature, hasEdit,
  hideThresSt, thresValSt, isEditSt,
  updateThresholdValueAct, resetThresholdValueAct, toggleThresholdIsEditAct,
}) => {
  const thresVal = thresValSt || feature.thresRef;

  return (
    <span className={classes.groupRight}>
      { setThreshold(classes, thresVal, updateThresholdValueAct) }
      <Tooltip title={<span className="txt-sv-tp">Restore Threshold</span>}>
        <MuButton
          className={
            classNames(
              'btn-sv-bar-thresref',
            )
          }
          disabled={Cfg.btnCmdThres(thresVal)}
          onClick={resetThresholdValueAct}
        >
          <RefreshOutlinedIcon className={classes.icon} />
        </MuButton>
      </Tooltip>
      {
        hideThresSt
          ? null
          : (
            <Tooltip title={<span className="txt-sv-tp">{restoreTp(hasEdit, isEditSt)}</span>}>
              <MuButton
                className={
                  classNames(
                    'btn-sv-bar-thresrst',
                  )
                }
                disabled={Cfg.btnCmdThres(thresVal)}
                onClick={toggleThresholdIsEditAct}
              >
                { restoreIcon(classes, hasEdit, isEditSt) }
              </MuButton>
            </Tooltip>
          )
      }
    </span>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    hideThresSt: Cfg.hideCmdThres(state.layout),
    isEditSt: state.threshold.isEdit,
    thresValSt: parseFloat(state.threshold.value) || 0,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateThresholdValueAct: updateThresholdValue,
    resetThresholdValueAct: resetThresholdValue,
    toggleThresholdIsEditAct: toggleThresholdIsEdit,
  }, dispatch)
);

Threshold.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  hideThresSt: PropTypes.bool.isRequired,
  isEditSt: PropTypes.bool.isRequired,
  thresValSt: PropTypes.number.isRequired,
  updateThresholdValueAct: PropTypes.func.isRequired,
  resetThresholdValueAct: PropTypes.func.isRequired,
  toggleThresholdIsEditAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Threshold));
