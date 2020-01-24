import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';

import {
  toggleIsAscend, toggleIsIntensity,
  updateOperation, updateDecimal,
} from '../../actions/submit';
import BtnSubmit from './submit_btn';

const Styles = () => ({
  formControlAsc: {
    minWidth: 110,
    margin: '0 3px 0 3px',
  },
  formControlInt: {
    minWidth: 110,
    margin: '0 3px 0 3px',
  },
  formControlOp: {
    minWidth: 150,
    margin: '0 3px 0 3px',
  },
  formControlDcm: {
    minWidth: 70,
    margin: '0 3px 0 3px',
  },
  selectInput: {
    height: 30,
    margin: '6px 0 0 0',
  },
  selectInputCls: {
    padding: '0 15px 0 15px',
  },
  selectLabel: {
    margin: '6px 0 0 0',
  },
  selectTxt: {
    fontSize: '0.9rem',
    fontFamily: 'Helvetica',
  },
});

const ascendSelect = (
  classes, hideSwitch, isAscendSt, toggleIsAscendAct,
) => {
  if (hideSwitch) return null;

  return (
    <FormControl
      className={classNames(classes.formControlAsc)}
      variant="outlined"
    >
      <InputLabel className={classes.selectLabel}>
        Write Peaks
      </InputLabel>
      <Select
        value={isAscendSt}
        onChange={toggleIsAscendAct}
        input={
          (
            <OutlinedInput
              className={classes.selectInput}
              classes={{ input: classes.selectInputCls }}
              labelWidth={90}
            />
          )
        }
      >
        <MenuItem value key="ascend">
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            Ascend
          </span>
        </MenuItem>
        <MenuItem value={false} key="descend">
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            Descend
          </span>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const intensitySelect = (
  classes, hideSwitch, isIntensitySt, toggleIsIntensityAct,
) => {
  if (hideSwitch) return null;

  return (
    <FormControl
      className={classNames(classes.formControlInt)}
      variant="outlined"
    >
      <InputLabel className={classes.selectLabel}>
        Write Intensity
      </InputLabel>
      <Select
        value={isIntensitySt}
        onChange={toggleIsIntensityAct}
        input={
          (
            <OutlinedInput
              className={classes.selectInput}
              classes={{ input: classes.selectInputCls }}
              labelWidth={100}
            />
          )
        }
      >
        <MenuItem value key="ascend">
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            Show
          </span>
        </MenuItem>
        <MenuItem value={false} key="descend">
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            Hide
          </span>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const decimalSelect = (
  classes, hideSwitch, decimalSt, updateDecimalAct,
) => {
  if (hideSwitch) return null;
  const decimals = [0, 1, 2, 3, 4];
  const options = decimals.map(d => (
    <MenuItem value={d} key={d}>
      <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
        {d}
      </span>
    </MenuItem>
  ));

  return (
    <FormControl
      className={classNames(classes.formControlDcm)}
      variant="outlined"
    >
      <InputLabel className={classes.selectLabel}>
        Decimal
      </InputLabel>
      <Select
        value={decimalSt}
        onChange={updateDecimalAct}
        input={
          (
            <OutlinedInput
              className={classes.selectInput}
              classes={{ input: classes.selectInputCls }}
              labelWidth={60}
            />
          )
        }
      >
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
      <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>{o.name}</span>
    </MenuItem>
  ));

  const selectedValue = operation.name || operations[0].name;

  return (
    <FormControl
      className={classNames(classes.formControlOp)}
      variant="outlined"
    >
      <InputLabel className={classes.selectLabel}>
        Submit
      </InputLabel>
      <Select
        value={selectedValue}
        onChange={onChangeSelect}
        input={
          (
            <OutlinedInput
              className={classes.selectInput}
              classes={{ input: classes.selectInputCls }}
              labelWidth={50}
            />
          )
        }
      >
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

const Submit = ({
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
    <span>
      {
        ascendSelect(
          classes, hideSwitch, isAscendSt, toggleIsAscendAct,
        )
      }
      {
        intensitySelect(
          classes, (hideSwitch || !isIR), isIntensitySt, toggleIsIntensityAct,
        )
      }
      {
        decimalSelect(
          classes, hideSwitch, decimalSt, updateDecimalAct,
        )
      }
      {
        operationSelect(
          classes, operations, operationSt, onChangeSelect,
        )
      }
      <BtnSubmit
        feature={feature}
        isAscend={isAscendSt}
        isIntensity={isIntensitySt}
        operation={operationSt}
        disabled={disabled}
      />
    </span>
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

Submit.propTypes = {
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
)(Submit);
