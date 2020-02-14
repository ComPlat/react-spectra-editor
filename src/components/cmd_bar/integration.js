import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

import Icon from '@mdi/react';
import { mdiReflectVertical, mdiMathIntegral } from '@mdi/js';

import {
  clearIntegrationAll, setIntegrationFkr,
} from '../../actions/integration';
import { setUiSweepType } from '../../actions/ui';
import {
  LIST_UI_SWEEP_TYPE,
} from '../../constants/list_ui';
import Cfg from '../../helpers/cfg';
import TriBtn from './tri_btn';

const styles = () => ({
  btn: {
    minWidth: 40,
  },
  btnTxt: {
    textIndent: -10,
    width: 0,
  },
  btnHighlight: {
    backgroundColor: '#2196f3',
    color: '#fff',
    minWidth: 40,
    '&:hover': {
      backgroundColor: '#51c6f3',
    },
  },
  txtField: {
    width: 80,
    margin: '6px 3px 0 3px',
  },
  txtInput: {
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    height: 30,
  },
  sweepWrap: {
    border: '1px dashed',
    borderRadius: '5px',
  },
});

const highlight = (criteria, cls) => (criteria ? cls.btnHighlight : cls.btn);

const setFactor = (
  classes, isDisable, integrationSt, setIntegrationFkrAct,
) => {
  const onBlur = e => setIntegrationFkrAct(e.target.value);
  const onChange = e => setIntegrationFkrAct(e.target.value);
  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      setIntegrationFkrAct(e.target.value);
    }
  };
  const { refFactor } = integrationSt;

  return (
    <TextField
      className={classes.txtField}
      disabled={isDisable}
      id="intg-factor-name"
      type="number"
      value={refFactor || 1.00}
      margin="none"
      InputProps={{
        className: classNames(classes.txtInput, 'txt-sv-input-label'),
      }}
      label={<span className={classNames('cmd-txt-label')}>Ref Area</span>}
      onChange={onChange}
      onBlur={onBlur}
      onKeyPress={onEnterPress}
      variant="outlined"
    />
  );
};

const Integration = ({
  classes, uiSt, layoutSt, integrationSt,
  setUiSweepTypeAct, setIntegrationFkrAct, clearIntegrationAllAct,
}) => {
  const { sweepType } = uiSt;
  const onSweepIntegtAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_ADD);
  const onSweepIntegtRm = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_RM);
  const onSweepIntegtSR = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF);
  const isDisable = Cfg.btnCmdIntg(layoutSt);
  const iconAddColor = (sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD) || isDisable ? '#fff' : '#000';
  const iconRMColor = (sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_RM) || isDisable ? '#fff' : '#000';
  const iconSRColor = (sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF) || isDisable ? '#fff' : '#000';

  return (
    <span>
      <Tooltip title={<span className="txt-sv-tp">Add Integration</span>}>
        <span>
          <Button
            className={
              highlight(sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD, classes)
            }
            disabled={isDisable}
            onClick={onSweepIntegtAdd}
          >
            <Icon
              path={mdiMathIntegral}
              size={1}
              color={iconAddColor}
              className={classNames(classes.sweepWrap, 'cmd-mdi-icon')}
            />
            <span className={classes.btnTxt}>+</span>
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Remove Integration</span>}>
        <span>
          <Button
            className={
              highlight(sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_RM, classes)
            }
            disabled={isDisable}
            onClick={onSweepIntegtRm}
          >
            <Icon
              path={mdiMathIntegral}
              size={1}
              color={iconRMColor}
              className={classNames('cmd-mdi-icon')}
            />
            <span className={classes.btnTxt}>-</span>
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Set Integration Reference</span>}>
        <span>
          <Button
            className={
              highlight(sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF, classes)
            }
            disabled={isDisable}
            onClick={onSweepIntegtSR}
          >
            <Icon
              path={mdiReflectVertical}
              size={1}
              color={iconSRColor}
              className={classNames('cmd-mdi-icon')}
            />
          </Button>
        </span>
      </Tooltip>
      {
        setFactor(
          classes, isDisable, integrationSt, setIntegrationFkrAct,
        )
      }
      <TriBtn
        content={{ tp: 'Clear All Integration' }}
        cb={clearIntegrationAllAct}
      >
        <Icon
          path={mdiMathIntegral}
          size={1}
          className={classNames('cmd-mdi-icon')}
        />
        <span className={classes.btnTxt}>X</span>
      </TriBtn>
    </span>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    uiSt: state.ui,
    layoutSt: state.layout,
    integrationSt: state.integration,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
    setIntegrationFkrAct: setIntegrationFkr,
    clearIntegrationAllAct: clearIntegrationAll,
  }, dispatch)
);

Integration.propTypes = {
  classes: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  integrationSt: PropTypes.object.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
  setIntegrationFkrAct: PropTypes.func.isRequired,
  clearIntegrationAllAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Integration));
