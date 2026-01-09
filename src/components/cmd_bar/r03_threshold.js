/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  TextField, InputAdornment, Tooltip, FormControl, InputLabel,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

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
  classes, thresVal, updateThresholdValueAct, curveSt,
) => {
  const { curveIdx } = curveSt;
  const onBlur = (e) => updateThresholdValueAct({ value: e.target.value, curveIdx });
  const onChange = (e) => updateThresholdValueAct({ value: e.target.value, curveIdx });
  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      updateThresholdValueAct({ value: e.target.value, curveIdx });
    }
  };

  return (
    <FormControl variant="outlined">
      <TextField
        className={classes.field}
        id="outlined-name"
        placeholder="N.A."
        type="number"
        value={thresVal || 0.01}
        margin="none"
        InputProps={{
          endAdornment: txtPercent(),
          className: classNames(classes.txtInput, 'txtfield-sv-bar-input'),
          inputProps: { min: 0.01 },
        }}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onEnterPress}
        variant="outlined"
      />
      <InputLabel className={classNames(classes.txtLabelBottomInput)}>Threshold</InputLabel>
    </FormControl>
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
  hideThresSt, thresValSt, isEditSt, curveSt,
  updateThresholdValueAct, resetThresholdValueAct, toggleThresholdIsEditAct,
}) => {
  const thresVal = thresValSt || feature.thresRef;

  return (
    <span className={classes.groupRight}>
      { setThreshold(classes, thresVal, updateThresholdValueAct, curveSt) }
      <Tooltip title={<span className="txt-sv-tp">Restore Threshold</span>}>
        <span>
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
        </span>
      </Tooltip>
      {
        hideThresSt
          ? null
          : (
            <Tooltip title={<span className="txt-sv-tp">{restoreTp(hasEdit, isEditSt)}</span>}>
              <span>
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
              </span>
            </Tooltip>
          )
      }
    </span>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    hideThresSt: Cfg.hideCmdThres(state.layout),
    isEditSt: state.threshold.list[state.curve.curveIdx].isEdit,
    thresValSt: parseFloat(state.threshold.list[state.curve.curveIdx].value) || 0,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
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
  curveSt: PropTypes.object.isRequired,
  updateThresholdValueAct: PropTypes.func.isRequired,
  resetThresholdValueAct: PropTypes.func.isRequired,
  toggleThresholdIsEditAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Threshold));
