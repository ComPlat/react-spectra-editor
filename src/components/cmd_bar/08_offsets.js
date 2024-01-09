/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/function-component-definition, react/no-unused-prop-types, */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';

import { clearOffsetAll } from '../../actions/offset';

import { setUiSweepType } from '../../actions/ui';
import {
  LIST_UI_SWEEP_TYPE,
} from '../../constants/list_ui';
import Cfg from '../../helpers/cfg';
import TriBtn from './tri_btn';
import { MuButton, commonStyle, focusStyle } from './common';

const styles = () => (
  {
    field: {
      width: 80,
    },
    txtIcon: {
    },
    ...commonStyle,
  }
);

const Offset = ({
  classes, isDisableSt, isFocusAddOffsetSt, isFocusRmOffsetSt,
  setUiSweepTypeAct, clearOffsetAllAct,
  curveSt,
  // eslint-disable-next-line no-unused-vars
  offsetSt,
}) => {
  const onSweepOffsetAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.OFFSET_ADD);
  const onSweepOffsetRm = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.OFFSET_RM);
  const { curveIdx } = curveSt;
  const onClearAll = () => clearOffsetAllAct({ curveIdx });

  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Add On- and Offsets</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusAddOffsetSt, classes),
              )
            }
            disabled={isDisableSt}
            onClick={onSweepOffsetAdd}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-addpeak')}>O+</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Remove On- and Offsets</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusRmOffsetSt, classes),
              )
            }
            disabled={isDisableSt}
            onClick={onSweepOffsetRm}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-addpeak')}>O-</span>
          </MuButton>
        </span>
      </Tooltip>
      <TriBtn
        content={{ tp: 'Clear All On/offsets' }}
        cb={onClearAll}
      >
        <span className={classNames(classes.txt, 'txt-sv-bar-addpeak')}>OX</span>
      </TriBtn>
    </span>
  );
};

const mapStateToProps = (state) => (
  {
    isDisableSt: Cfg.btnCmdOffset(state.layout),
    isFocusAddOffsetSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.OFFSET_ADD,
    isFocusRmOffsetSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.OFFSET_RM,
    curveSt: state.curve,
    offsetSt: state.offset.present,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
    clearOffsetAllAct: clearOffsetAll,
  }, dispatch)
);

Offset.propTypes = {
  classes: PropTypes.object.isRequired,
  isDisableSt: PropTypes.bool.isRequired,
  isFocusAddOffsetSt: PropTypes.bool.isRequired,
  isFocusRmOffsetSt: PropTypes.bool.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
  clearOffsetAllAct: PropTypes.func.isRequired,
  curveSt: PropTypes.object.isRequired,
  offsetSt: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Offset));
