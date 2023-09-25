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

import { setUiSweepType } from '../../actions/ui';

import { MuButton, commonStyle, focusStyle } from './common';
import { LIST_UI_SWEEP_TYPE } from '../../constants/list_ui';
import Cfg from '../../helpers/cfg';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const Pecker = ({
  classes, layoutSt,
  isFocusAddPeckerSt, isFocusRmPeckerSt,
  setUiSweepTypeAct, jcampIdx,
}) => {
  const onSweepPeckerAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER, jcampIdx);
  const onSweepPeckerDELETE = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER, jcampIdx);

  return (
    (!Cfg.hidePanelCyclicVolta(layoutSt)) ? (
      <span>
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
              <span className={classNames(classes.txt, 'txt-sv-bar-addpeak')}>Pe+</span>
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
              <span className={classNames(classes.txt, 'txt-sv-bar-rmpeak')}>Pe-</span>
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
    cyclicVotaSt: state.cyclicvolta,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
  }, dispatch)
);

Pecker.propTypes = {
  classes: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  isFocusAddPeckerSt: PropTypes.bool.isRequired,
  isFocusRmPeckerSt: PropTypes.bool.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
  cyclicVotaSt: PropTypes.object.isRequired,
  jcampIdx: PropTypes.any,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Pecker);
