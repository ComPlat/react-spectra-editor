import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import { setUiSweepType } from '../../actions/ui';
import { clearMpyAll } from '../../actions/multiplicity';
import {
  LIST_UI_SWEEP_TYPE,
} from '../../constants/list_ui';
import Cfg from '../../helpers/cfg';
import TriBtn from './tri_btn';
import { MuButton, commonStyle, focusStyle } from './common';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const Multiplicity = ({
  classes, isFocusAddMpySt, disableAddMpySt, isFocusRmMpySt, disableRmMpySt,
  isFocusAddPeakSt, isFocusRmPeakSt, disableMpyPeakSt,
  setUiSweepTypeAct, clearMpyAllAct,
}) => {
  const onSweepMutAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD);
  const onOneMutAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM);
  const onPeakMutAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD);
  const onPeakMutRm = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM);

  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Add Multiplicity</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusAddMpySt, classes),
                'btn-sv-bar-addmpy',
              )
            }
            disabled={disableAddMpySt}
            onClick={onSweepMutAdd}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-addmpy')}>J+</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Remove Multiplicity</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusRmMpySt, classes),
                'btn-sv-bar-rmmpy',
              )
            }
            disabled={disableRmMpySt}
            onClick={onOneMutAdd}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-rmmpy')}>J-</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Add Peak for Multiplicity</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusAddPeakSt, classes),
                'btn-sv-bar-addpeakmpy',
              )
            }
            disabled={disableMpyPeakSt}
            onClick={onPeakMutAdd}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-addpeakmpy')}>JP+</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Remove Peak for Multiplicity</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusRmPeakSt, classes),
                'btn-sv-bar-rmpeakmpy',
              )
            }
            disabled={disableMpyPeakSt}
            onClick={onPeakMutRm}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-rmpeakmpy')}>JP-</span>
          </MuButton>
        </span>
      </Tooltip>
      <TriBtn
        content={{ tp: 'Clear All Multiplicity' }}
        cb={clearMpyAllAct}
      >
        <span className={classNames(classes.txt, 'txt-sv-bar-rmallmpy')}>Jx</span>
      </TriBtn>
    </span>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    isFocusAddMpySt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD,
    disableAddMpySt: Cfg.btnCmdMpy(state.layout),
    isFocusRmMpySt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM,
    disableRmMpySt: Cfg.btnCmdMpy(state.layout),
    isFocusAddPeakSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD,
    isFocusRmPeakSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_REMOVE,
    disableMpyPeakSt: Cfg.btnCmdMpyPeak(state.layout, state.multiplicity.present),
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
    clearMpyAllAct: clearMpyAll,
  }, dispatch)
);

Multiplicity.propTypes = {
  classes: PropTypes.object.isRequired,
  isFocusAddMpySt: PropTypes.bool.isRequired,
  disableAddMpySt: PropTypes.bool.isRequired,
  isFocusRmMpySt: PropTypes.bool.isRequired,
  disableRmMpySt: PropTypes.bool.isRequired,
  isFocusAddPeakSt: PropTypes.bool.isRequired,
  isFocusRmPeakSt: PropTypes.bool.isRequired,
  disableMpyPeakSt: PropTypes.bool.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
  clearMpyAllAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Multiplicity));
