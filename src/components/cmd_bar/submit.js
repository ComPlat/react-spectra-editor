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
import { commonStyle } from './common';

const styles = () => (
  Object.assign(
    {
      fieldOrder: {
        width: 90,
      },
      fieldIntensity: {
        width: 90,
      },
      fieldDecimal: {
        width: 80,
      },
      fieldOpertaion: {
        width: 120,
      },
    },
    commonStyle,
  )
);

const ascendSelect = (
  classes, hideSwitch, isAscendSt, toggleIsAscendAct,
) => {
  if (hideSwitch) return null;

  return (
    <FormControl
      className={classNames(classes.fieldOrder)}
      variant="outlined"
    >
      <InputLabel className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Write Peaks
      </InputLabel>
      <Select
        value={isAscendSt}
        onChange={toggleIsAscendAct}
        input={
          (
            <OutlinedInput
              className={classNames(classes.selectInput, 'input-sv-bar-order')}
              labelWidth={90}
            />
          )
        }
      >
        <MenuItem value key="ascend">
          <span className={classNames(classes.txtOpt, 'option-sv-bar-ascend')}>
            Ascend
          </span>
        </MenuItem>
        <MenuItem value={false} key="descend">
          <span className={classNames(classes.txtOpt, 'option-sv-bar-descend')}>
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
      className={classNames(classes.fieldIntensity)}
      variant="outlined"
    >
      <InputLabel className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Write Intensity
      </InputLabel>
      <Select
        value={isIntensitySt}
        onChange={toggleIsIntensityAct}
        input={
          (
            <OutlinedInput
              className={classNames(classes.selectInput, 'input-sv-bar-intensity')}
              labelWidth={100}
            />
          )
        }
      >
        <MenuItem value key="ascend">
          <span className={classNames(classes.txtOpt, 'option-sv-bar-show')}>
            Show
          </span>
        </MenuItem>
        <MenuItem value={false} key="descend">
          <span className={classNames(classes.txtOpt, 'option-sv-bar-hide')}>
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
      <span className={classNames(classes.txtOpt, 'option-sv-bar-decimal')}>
        {d}
      </span>
    </MenuItem>
  ));

  return (
    <FormControl
      className={classNames(classes.fieldDecimal)}
      variant="outlined"
    >
      <InputLabel className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Decimal
      </InputLabel>
      <Select
        value={decimalSt}
        onChange={updateDecimalAct}
        input={
          (
            <OutlinedInput
              className={classNames(classes.selectInput, 'input-sv-bar-decimal')}
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
      <span className={classNames(classes.txtOpt, 'option-sv-bar-operation')}>{o.name}</span>
    </MenuItem>
  ));

  const selectedValue = operation.name || operations[0].name;

  return (
    <FormControl
      className={classNames(classes.fieldOpertaion)}
      variant="outlined"
    >
      <InputLabel className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Submit
      </InputLabel>
      <Select
        value={selectedValue}
        onChange={onChangeSelect}
        input={
          (
            <OutlinedInput
              className={classNames(classes.selectInput, 'input-sv-bar-operation')}
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
  withStyles(styles),
)(Submit);
