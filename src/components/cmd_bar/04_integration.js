/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';

import Icon from '@mdi/react';
import { mdiReflectVertical, mdiMathIntegral } from '@mdi/js';

import {
  clearIntegrationAll, setIntegrationFkr,
} from '../../actions/integration';
import {
  clearIntegrationAllHplcMs,
} from '../../actions/hplc_ms';

import { setUiSweepType } from '../../actions/ui';
import {
  LIST_UI_SWEEP_TYPE,
} from '../../constants/list_ui';
import Cfg from '../../helpers/cfg';
import TriBtn from './tri_btn';
import { MuButton, commonStyle, focusStyle } from './common';
import Format from '../../helpers/format';
import { LIST_LAYOUT } from '../../constants/list_layout';

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

const iconSize = '16px';

const setFactor = (
  classes, isDisable, integrationSt, setIntegrationFkrAct, curveIdx,
) => {
  const onFactorChanged = (e) => {
    e.target.blur();
    setIntegrationFkrAct({
      factor: e.target.value,
      curveIdx,
    });
  };
  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      setIntegrationFkrAct({
        factor: e.target.value,
        curveIdx,
      });
    }
  };

  let refFactor = 1.00;
  const { integrations } = integrationSt;
  if (integrations && curveIdx < integrations.length) {
    const selectedIntegration = integrations[curveIdx];
    refFactor = selectedIntegration.refFactor || 1.00;
  }

  return (
    <TextField
      className={classes.field}
      disabled={isDisable}
      id="intg-factor-name"
      type="number"
      value={refFactor}
      margin="none"
      InputProps={{
        className: classNames(classes.txtInput, 'txtfield-sv-bar-input'),
      }}
      label={<span className={classNames(classes.txtLabel, 'txtfield-sv-bar-label')}>Ref Area</span>}
      onChange={onFactorChanged}
      onBlur={onFactorChanged}
      onKeyUp={onEnterPress}
      variant="outlined"
    />
  );
};

const iconColor = (criteria) => (criteria ? '#fff' : '#000');

const Integration = ({
  classes, ignoreRef,
  isDisableSt, isFocusAddIntgSt, isFocusRmIntgSt, isFocusSetRefSt,
  setUiSweepTypeAct, setIntegrationFkrAct, clearIntegrationAllAct,
  curveSt, integrationSt, clearIntegrationAllHplcMsAct, layoutSt,
}) => {
  const onSweepIntegtAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_ADD);
  const onSweepIntegtRm = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_RM);
  const onSweepIntegtSR = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF);
  const { curveIdx } = curveSt;
  const onClearAll = () => {
    if (layoutSt === LIST_LAYOUT.LC_MS) {
      clearIntegrationAllHplcMsAct();
    } else {
      clearIntegrationAllAct({ curveIdx });
    }
  };

  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Add Integration</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusAddIntgSt, classes),
                'btn-add-inter',
              )
            }
            disabled={isDisableSt}
            onClick={onSweepIntegtAdd}
          >
            <Icon
              path={mdiMathIntegral}
              size={iconSize}
              color={iconColor(isFocusAddIntgSt || isDisableSt)}
              className={classNames(classes.iconMdi, 'icon-sv-bar-addint')}
            />
            <span className={classNames(classes.txt, classes.txtIcon, 'txt-sv-bar-addint')}>+</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Remove Integration</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusRmIntgSt, classes),
                'btn-remove-inter',
              )
            }
            disabled={isDisableSt}
            onClick={onSweepIntegtRm}
          >
            <Icon
              path={mdiMathIntegral}
              size={iconSize}
              color={iconColor(isFocusRmIntgSt || isDisableSt)}
              className={classNames(classes.iconMdi, 'icon-sv-bar-rmint')}
            />
            <span className={classNames(classes.txt, classes.txtIcon, 'txt-sv-bar-rmint')}>-</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Set Integration Reference</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isFocusSetRefSt, classes),
                'btn-set-inter-ref',
              )
            }
            disabled={isDisableSt}
            onClick={onSweepIntegtSR}
          >
            <Icon
              path={mdiReflectVertical}
              size={iconSize}
              color={iconColor(isFocusSetRefSt || isDisableSt)}
              className={classNames(classes.iconMdi, 'icon-sv-bar-refint')}
            />
          </MuButton>
        </span>
      </Tooltip>
      {
        !ignoreRef
          ? setFactor(
            classes, isDisableSt, integrationSt, setIntegrationFkrAct, curveIdx,
          )
          : null
      }
      <TriBtn
        content={{ tp: 'Clear All Integration' }}
        cb={onClearAll}
      >
        <Icon
          path={mdiMathIntegral}
          size={iconSize}
          color={iconColor(isDisableSt)}
          className={classNames(classes.iconMdi, 'icon-sv-bar-rmallint')}
        />
        <span className={classNames(classes.txt, classes.txtIcon, 'txt-sv-bar-rmallint')}>x</span>
      </TriBtn>
    </span>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    isDisableSt: Cfg.btnCmdIntg(state.layout),
    isFocusAddIntgSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
    isFocusRmIntgSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_RM,
    isFocusSetRefSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF,
    ignoreRef: Format.isHplcUvVisLayout(state.layout),
    curveSt: state.curve,
    integrationSt: state.integration.present,
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
    setIntegrationFkrAct: setIntegrationFkr,
    clearIntegrationAllAct: clearIntegrationAll,
    clearIntegrationAllHplcMsAct: clearIntegrationAllHplcMs,
  }, dispatch)
);

Integration.propTypes = {
  classes: PropTypes.object.isRequired,
  isDisableSt: PropTypes.bool.isRequired,
  isFocusAddIntgSt: PropTypes.bool.isRequired,
  isFocusRmIntgSt: PropTypes.bool.isRequired,
  isFocusSetRefSt: PropTypes.bool.isRequired,
  ignoreRef: PropTypes.bool.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
  setIntegrationFkrAct: PropTypes.func.isRequired,
  clearIntegrationAllAct: PropTypes.func.isRequired,
  clearIntegrationAllHplcMsAct: PropTypes.func.isRequired,
  curveSt: PropTypes.object.isRequired,
  integrationSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Integration));
