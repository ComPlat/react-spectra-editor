import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

import {
  toggleIsAscend, toggleIsIntensity,
  updateOperation, updateDecimal,
} from '../../actions/submit';
import SwitchAscend from './switch_ascend';
import SwitchIntensity from './switch_intensity';
import BtnSubmit from './btn_submit';

const Styles = () => ({
  formControl: {
    margin: '10px 20px 0px 10px',
    minWidth: 150,
  },
});

const decimalSelect = (
  classes, decimalSt, updateDecimalAct,
) => {
  const decimals = [0, 1, 2, 3, 4];
  const options = decimals.map(d => (
    <MenuItem value={d} key={d}>
      <span className="txt-sv-input-label">
        {`${d} decimal places`}
      </span>
    </MenuItem>
  ));

  return (
    <FormControl
      className={classNames(classes.formControl)}
    >
      <Select value={decimalSt} onChange={updateDecimalAct}>
        { options }
      </Select>
    </FormControl>
  );
};

const operationSelect = (
  classes, operations, operation, onChangeSelect,
) => {
  const options = operations.map(o => (
    <MenuItem value={o.name} key={o.name}>
      <span className="txt-sv-input-label">{o.name}</span>
    </MenuItem>
  ));

  const selectedValue = operation.name || operations[0].name;

  return (
    <FormControl
      className={classNames(classes.formControl)}
    >
      <Select value={selectedValue} onChange={onChangeSelect}>
        { options }
      </Select>
    </FormControl>
  );
};

const selectOperation = (name, operations, updateOperationAct) => {
  let operation = false;
  operations.forEach((o) => {
    if (o.name === name) {
      operation = o;
    }
  });
  updateOperationAct(operation);
};

const SubmitPanel = ({
  operations, classes, feature, hideSwitch, disabled,
  isAscendSt, isIntensitySt, operationSt, decimalSt, layoutSt,
  toggleIsAscendAct, toggleIsIntensityAct,
  updateOperationAct, updateDecimalAct,
}) => {
  const onChangeSelect = e => (
    selectOperation(e.target.value, operations, updateOperationAct)
  );

  if (!operations || operations.length === 0) return null;
  const isIR = ['IR'].indexOf(layoutSt) >= 0;

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      {
        hideSwitch
          ? null
          : (
            <Grid item xs={12}>
              <SwitchAscend
                isAscend={isAscendSt}
                onToggleSwitch={toggleIsAscendAct}
              />
            </Grid>
          )
      }
      {
        hideSwitch || !isIR
          ? null
          : (
            <Grid item xs={12}>
              <SwitchIntensity
                isIntensity={isIntensitySt}
                onToggleSwitch={toggleIsIntensityAct}
              />
            </Grid>
          )
      }
      {
        hideSwitch
          ? null
          : (
            <Grid item xs={8}>
              {
                decimalSelect(
                  classes, decimalSt, updateDecimalAct,
                )
              }
            </Grid>
          )
      }
      <Grid item xs={8}>
        {
          operationSelect(
            classes, operations, operationSt, onChangeSelect,
          )
        }
      </Grid>
      <Grid item xs={4}>
        <BtnSubmit
          feature={feature}
          isAscend={isAscendSt}
          isIntensity={isIntensitySt}
          operation={operationSt}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    isAscendSt: state.submit.isAscend,
    isIntensitySt: state.submit.isIntensity,
    decimalSt: state.submit.decimal,
    operationSt: state.submit.operation,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleIsAscendAct: toggleIsAscend,
    toggleIsIntensityAct: toggleIsIntensity,
    updateOperationAct: updateOperation,
    updateDecimalAct: updateDecimal,
  }, dispatch)
);

SubmitPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  hideSwitch: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  isAscendSt: PropTypes.bool.isRequired,
  isIntensitySt: PropTypes.bool.isRequired,
  operationSt: PropTypes.object.isRequired,
  decimalSt: PropTypes.number.isRequired,
  layoutSt: PropTypes.string.isRequired,
  toggleIsAscendAct: PropTypes.func.isRequired,
  toggleIsIntensityAct: PropTypes.func.isRequired,
  updateOperationAct: PropTypes.func.isRequired,
  updateDecimalAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(SubmitPanel);
