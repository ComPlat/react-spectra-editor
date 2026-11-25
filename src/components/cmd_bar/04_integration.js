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
import { mdiClose, mdiReflectVertical, mdiMathIntegral } from '@mdi/js';

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
import { clearPendingIntegrationDraft } from '../../helpers/integration_draft.js'; // eslint-disable-line import/extensions
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
      cancelBtn: {
        borderColor: '#d32f2f',
        color: '#d32f2f',
        '&:hover': {
          backgroundColor: '#ffebee',
        },
      },
    },
    commonStyle,
  )
);

const iconSize = '16px';

const setFactor = (
  classes, integrationSt, setIntegrationFkrAct, curveIdx,
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
  classes, ignoreRef, showIntegSplitToolsSt,
  isDisableSt, isFocusAddIntgSt, isFocusRmIntgSt, isFocusSetRefSt,
  isFocusSplitIntgSt, isFocusVisualSplitIntgSt,
  setUiSweepTypeAct, setIntegrationFkrAct, clearIntegrationAllAct,
  curveSt, integrationSt, clearIntegrationAllHplcMsAct, layoutSt,
}) => {
  const { curveIdx } = curveSt;
  const onCancelTool = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ZOOMIN, curveIdx);
  const onSweepIntegtAdd = () => {
    if (isFocusAddIntgSt) {
      clearPendingIntegrationDraft();
      onCancelTool();
      return;
    }
    setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_ADD, curveIdx);
  };
  const onSweepIntegtRm = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_RM);
  const onSweepIntegtSR = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF);
  const onClearAll = () => {
    if (layoutSt === LIST_LAYOUT.LC_MS) {
      clearIntegrationAllHplcMsAct();
    } else {
      clearIntegrationAllAct({ curveIdx });
    }
  };
  const onSweepIntegtSplit = () => {
    if (isFocusSplitIntgSt) {
      onCancelTool();
      return;
    }
    setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_SPLIT, curveIdx);
  };
  const onSweepIntegtVisualSplit = () => {
    if (isFocusVisualSplitIntgSt) {
      onCancelTool();
      return;
    }
    setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_VISUAL_SPLIT, curveIdx);
  };

  if (isDisableSt) {
    return null;
  }

  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Add Integration</span>}>
        <span>
          <MuButton
            className={
              classNames(
                isFocusAddIntgSt ? classes.cancelBtn : focusStyle(false, classes),
                'btn-add-inter',
              )
            }
            onClick={onSweepIntegtAdd}
          >
            <Icon
              path={isFocusAddIntgSt ? mdiClose : mdiMathIntegral}
              size={iconSize}
              color={iconColor(isFocusAddIntgSt)}
              className={classNames(classes.iconMdi, 'icon-sv-bar-addint')}
            />
            {
              isFocusAddIntgSt
                ? null
                : <span className={classNames(classes.txt, classes.txtIcon, 'txt-sv-bar-addint')}>+</span>
            }
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
            onClick={onSweepIntegtRm}
          >
            <Icon
              path={mdiMathIntegral}
              size={iconSize}
              color={iconColor(isFocusRmIntgSt)}
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
            onClick={onSweepIntegtSR}
          >
            <Icon
              path={mdiReflectVertical}
              size={iconSize}
              color={iconColor(isFocusSetRefSt)}
              className={classNames(classes.iconMdi, 'icon-sv-bar-refint')}
            />
          </MuButton>
        </span>
      </Tooltip>
      {
        showIntegSplitToolsSt
          ? (
            <>
              <Tooltip title={<span className="txt-sv-tp">Split Integration</span>}>
                <span>
                  <MuButton
                    className={
                      classNames(
                        isFocusSplitIntgSt ? classes.cancelBtn : focusStyle(false, classes),
                        'btn-split-inter',
                      )
                    }
                    onClick={onSweepIntegtSplit}
                  >
                    <Icon
                      path={isFocusSplitIntgSt ? mdiClose : mdiMathIntegral}
                      size={iconSize}
                      color={isFocusSplitIntgSt ? '#d32f2f' : iconColor(false)}
                      className={classNames(classes.iconMdi, 'icon-sv-bar-splitint')}
                    />
                    {
                      isFocusSplitIntgSt
                        ? null
                        : <span className={classNames(classes.txt, classes.txtIcon, 'txt-sv-bar-splitint')}>/</span>
                    }
                  </MuButton>
                </span>
              </Tooltip>
              <Tooltip title={<span className="txt-sv-tp">Visual Split Integration</span>}>
                <span>
                  <MuButton
                    className={
                      classNames(
                        isFocusVisualSplitIntgSt ? classes.cancelBtn : focusStyle(false, classes),
                        'btn-visual-split-inter',
                      )
                    }
                    onClick={onSweepIntegtVisualSplit}
                  >
                    <Icon
                      path={isFocusVisualSplitIntgSt ? mdiClose : mdiMathIntegral}
                      size={iconSize}
                      color={isFocusVisualSplitIntgSt ? '#d32f2f' : iconColor(false)}
                      className={classNames(classes.iconMdi, 'icon-sv-bar-visualsplitint')}
                    />
                    {
                      isFocusVisualSplitIntgSt
                        ? null
                        : <span className={classNames(classes.txt, classes.txtIcon, 'txt-sv-bar-visualsplitint')}>|</span>
                    }
                  </MuButton>
                </span>
              </Tooltip>
            </>
          )
          : null
      }
      {
        !ignoreRef
          ? setFactor(
            classes, integrationSt, setIntegrationFkrAct, curveIdx,
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
          color={iconColor(false)}
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
    isFocusSplitIntgSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_SPLIT,
    isFocusVisualSplitIntgSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_VISUAL_SPLIT,
    ignoreRef: Format.isHplcUvVisLayout(state.layout),
    showIntegSplitToolsSt: Cfg.showIntegSplitTools(state.layout),
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
  isFocusSplitIntgSt: PropTypes.bool.isRequired,
  isFocusVisualSplitIntgSt: PropTypes.bool.isRequired,
  ignoreRef: PropTypes.bool.isRequired,
  showIntegSplitToolsSt: PropTypes.bool.isRequired,
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
