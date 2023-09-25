/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';

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
  isHandleMaxAndMinPeaksSt,
  cyclicVotaSt, curveSt,
}) => {
  let onSweepPeakAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.PEAK_ADD);
  let onSweepPeakDELETE = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.PEAK_DELETE);
  let onSweepAnchorShift = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT);
  if (isHandleMaxAndMinPeaksSt) {
    const { curveIdx } = curveSt;
    const { spectraList } = cyclicVotaSt;
    const spectra = spectraList[curveIdx];
    if (spectra) {
      const { isWorkMaxPeak } = spectra;
      if (isWorkMaxPeak) {
        onSweepPeakAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK, curveIdx);
        onSweepPeakDELETE = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK, curveIdx);
      } else {
        onSweepPeakAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK, curveIdx);
        onSweepPeakDELETE = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK, curveIdx);
      }
      onSweepAnchorShift = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF, curveIdx);
    }
  }

  return (
    <span className={classes.group} data-testid="Peak">
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
      {
        !disableSetRefSt ? (
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
        ) : null
      }
    </span>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    isFocusAddPeakSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.PEAK_ADD || state.ui.sweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK || state.ui.sweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK,
    disableAddPeakSt: Cfg.btnCmdAddPeak(state.layout),
    isFocusRmPeakSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.PEAK_DELETE || state.ui.sweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK || state.ui.sweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK,
    disableRmPeakSt: Cfg.btnCmdRmPeak(state.layout),
    isFocusSetRefSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT || state.ui.sweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF,
    disableSetRefSt: Cfg.btnCmdSetRef(state.layout),
    isHandleMaxAndMinPeaksSt: !Cfg.hidePanelCyclicVolta(state.layout),
    cyclicVotaSt: state.cyclicvolta,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
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
  isHandleMaxAndMinPeaksSt: PropTypes.bool.isRequired,
  cyclicVotaSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Peak);
