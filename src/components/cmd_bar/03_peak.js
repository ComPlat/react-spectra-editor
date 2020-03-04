import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import AddLocationOutlinedIcon from '@material-ui/icons/AddLocationOutlined';

import { setUiSweepType } from '../../actions/ui';
import Cfg from '../../helpers/cfg';
import { MuButton, commonStyle, focusStyle } from './common';
import { LIST_UI_SWEEP_TYPE } from '../../constants/list_ui';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const Peak = ({
  classes, setUiSweepTypeAct,
  isFocusAddPeakSt, disableAddPeakSt,
  isFocusRmPeakSt, disableRmPeakSt,
  isFocusSetRefSt, disableSetRefSt,
}) => {
  const onSweepPeakAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.PEAK_ADD);
  const onSweepPeakDELETE = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.PEAK_DELETE);
  const onSweepAnchorShift = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT);

  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Add Peak</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusAddPeakSt, classes),
                'btn-sv-bar-addpeak',
              )
            }
            disabled={disableAddPeakSt}
            onClick={onSweepPeakAdd}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-addpeak')}>P+</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Remove Peak</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusRmPeakSt, classes),
                'btn-sv-bar-rmpeak',
              )
            }
            disabled={disableRmPeakSt}
            onClick={onSweepPeakDELETE}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-rmpeak')}>P-</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Set Reference</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusSetRefSt, classes),
                'btn-sv-bar-setref',
              )
            }
            disabled={disableSetRefSt}
            onClick={onSweepAnchorShift}
          >
            <AddLocationOutlinedIcon className={classes.icon} />
          </MuButton>
        </span>
      </Tooltip>
    </span>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    isFocusAddPeakSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.PEAK_ADD,
    disableAddPeakSt: Cfg.btnCmdAddPeak(state.layout),
    isFocusRmPeakSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.PEAK_DELETE,
    disableRmPeakSt: Cfg.btnCmdRmPeak(state.layout),
    isFocusSetRefSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT,
    disableSetRefSt: Cfg.btnCmdSetRef(state.layout),
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
  }, dispatch)
);

Peak.propTypes = {
  classes: PropTypes.object.isRequired,
  isFocusAddPeakSt: PropTypes.bool.isRequired,
  disableAddPeakSt: PropTypes.bool.isRequired,
  isFocusRmPeakSt: PropTypes.bool.isRequired,
  disableRmPeakSt: PropTypes.bool.isRequired,
  isFocusSetRefSt: PropTypes.bool.isRequired,
  disableSetRefSt: PropTypes.bool.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Peak);
