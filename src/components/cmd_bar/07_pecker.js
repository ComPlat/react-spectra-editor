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
import { TextField } from '@mui/material';
import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';

import { setUiSweepType } from '../../actions/ui';

import { MuButton, commonStyle, focusStyle } from './common';
import { LIST_UI_SWEEP_TYPE } from '../../constants/list_ui';
import Cfg from '../../helpers/cfg';
import { setCylicVoltaRef, setCylicVoltaRefFactor } from '../../actions/cyclic_voltammetry';

const styles = () => (
  Object.assign(
    {
      field: {
        width: 80,
      },
      txtIcon: {
      },
    },
    commonStyle,
  )
);

const setRef = (
  classes, cyclicVotaSt, curveIdx, setCylicVoltaRefFactorAct,
) => {
  const { spectraList } = cyclicVotaSt;
  const spectra = spectraList[curveIdx];
  let refFactor = 0.0;
  if (spectra) {
    const { shift } = spectra;
    const { val } = shift;
    refFactor = val;
  }
  const onFactorChanged = (e) => setCylicVoltaRefFactorAct({
    factor: e.target.value,
    curveIdx,
  });
  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      setCylicVoltaRefFactorAct({
        factor: e.target.value,
        curveIdx,
      });
    }
  };

  return (
    <TextField
      className={classes.field}
      id="intg-factor-name"
      type="number"
      value={refFactor}
      margin="none"
      InputProps={{
        className: classNames(classes.txtInput, 'txtfield-sv-bar-input'),
      }}
      label={<span className={classNames(classes.txtLabel, 'txtfield-sv-bar-label')}>Ref Value (V)</span>}
      variant="outlined"
      onChange={onFactorChanged}
      onBlur={onFactorChanged}
      onKeyUp={onEnterPress}
    />
  );
};

const Pecker = ({
  classes, layoutSt,
  isFocusAddPeckerSt, isFocusRmPeckerSt,
  setUiSweepTypeAct, curveSt,
  cyclicVotaSt, setCylicVoltaRefFactorAct,
  isFocusSetRefSt, setCylicVoltaRefAct,
}) => {
  const { curveIdx } = curveSt;
  const onSweepPeckerAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER, curveIdx);
  const onSweepPeckerDELETE = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER, curveIdx);
  const onConfirmSetRef = () => setCylicVoltaRefAct({ jcampIdx: curveIdx });

  return (
    (!Cfg.hidePanelCyclicVolta(layoutSt)) ? (
      <span data-testid="Pecker">
        <Tooltip title={<span className="txt-sv-tp">Add Pecker</span>}>
          <span>
            <MuButton
              className={
                classNames(
                  focusStyle(isFocusAddPeckerSt, classes),
                  'btn-sv-bar-addpeak',
                )
              }
              onClick={onSweepPeckerAdd}
            >
              <span className={classNames(classes.txt, 'txt-sv-bar-addpeak')}>
                I
                <sub>λ0</sub>
                +
              </span>
            </MuButton>
          </span>
        </Tooltip>
        <Tooltip title={<span className="txt-sv-tp">Remove Pecker</span>}>
          <span>
            <MuButton
              className={
                classNames(
                  focusStyle(isFocusRmPeckerSt, classes),
                  'btn-sv-bar-rmpeak',
                )
              }
              onClick={onSweepPeckerDELETE}
            >
              <span className={classNames(classes.txt, 'txt-sv-bar-rmpeak')}>
                I
                <sub>λ0</sub>
                -
              </span>
            </MuButton>
          </span>
        </Tooltip>
        {
          setRef(classes, cyclicVotaSt, curveIdx, setCylicVoltaRefFactorAct)
        }
        <Tooltip title={<span className="txt-sv-tp">Set Reference</span>}>
          <span>
            <MuButton
              className={
                classNames(
                  focusStyle(isFocusSetRefSt, classes),
                  'btn-sv-bar-setref',
                )
              }
              onClick={onConfirmSetRef}
            >
              <AddLocationOutlinedIcon className={classes.icon} />
            </MuButton>
          </span>
        </Tooltip>
      </span>
    )
      : (<span />)
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    isFocusAddPeckerSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER,
    isFocusRmPeckerSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER,
    isFocusSetRefSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT || state.ui.sweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF,
    cyclicVotaSt: state.cyclicvolta,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
    setCylicVoltaRefFactorAct: setCylicVoltaRefFactor,
    setCylicVoltaRefAct: setCylicVoltaRef,
  }, dispatch)
);

Pecker.propTypes = {
  classes: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  isFocusAddPeckerSt: PropTypes.bool.isRequired,
  isFocusRmPeckerSt: PropTypes.bool.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
  isFocusSetRefSt: PropTypes.bool.isRequired,
  cyclicVotaSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
  setCylicVoltaRefFactorAct: PropTypes.func.isRequired,
  setCylicVoltaRefAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Pecker);
