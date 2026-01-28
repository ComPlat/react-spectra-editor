/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import {
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { withStyles } from '@mui/styles';

import {
  toggleIsAscend, toggleIsIntensity,
  updateOperation, updateDecimal,
} from '../../actions/submit';
import BtnSubmit from './r05_submit_btn';
import BtnPredict from './r06_predict_btn';
import { commonStyle } from './common';
import Format from '../../helpers/format';

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
      <InputLabel id="select-sort-peaks-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Write Peaks
      </InputLabel>
      <Select
        labelId="select-sort-peaks-label"
        label="Write Peaks"
        value={isAscendSt}
        onChange={toggleIsAscendAct}
        className={classNames(classes.selectInput, 'input-sv-bar-order')}
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
      <InputLabel id="select-intensity-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Write Intensity
      </InputLabel>
      <Select
        labelId="select-intensity-label"
        label="Write Intensity"
        value={isIntensitySt}
        onChange={toggleIsIntensityAct}
        className={classNames(classes.selectInput, 'input-sv-bar-intensity')}
        // input={
        //   (
        //     <OutlinedInput
        //       className={classNames(classes.selectInput, 'input-sv-bar-intensity')}
        //       labelWidth={100}
        //     />
        //   )
        // }
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
  const options = decimals.map((d) => (
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
      <InputLabel id="select-decimal-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Decimal
      </InputLabel>
      <Select
        labelId="select-decimal-label"
        label="Decimal"
        value={decimalSt}
        onChange={updateDecimalAct}
        className={classNames(classes.selectInput, 'input-sv-bar-decimal')}
        // input={
        //   (
        //     <OutlinedInput
        //       className={classNames(classes.selectInput, 'input-sv-bar-decimal')}
        //       labelWidth={60}
        //     />
        //   )
        // }
      >
        { options }
      </Select>
    </FormControl>
  );
};

const operationSelect = (
  classes, operations, operation, onChangeSelect,
) => {
  const options = operations.map((o) => (
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
      <InputLabel id="select-submit-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Submit
      </InputLabel>
      <Select
        labelId="select-submit-label"
        label="Submit"
        value={selectedValue}
        onChange={onChangeSelect}
        className={classNames(classes.selectInput, 'input-sv-bar-operation')}
        // input={
        //   (
        //     <OutlinedInput
        //       className={classNames(classes.selectInput, 'input-sv-bar-operation')}
        //       labelWidth={50}
        //     />
        //   )
        // }
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
  operations, classes, feature, forecast, editorOnly, hideSwitch, disabled,
  isAscendSt, isIntensitySt, operationSt, decimalSt, isEmWaveSt, layoutSt,
  toggleIsAscendAct, toggleIsIntensityAct,
  updateOperationAct, updateDecimalAct,
}) => {
  const onChangeSelect = (e) => (
    selectOperation(e.target.value, operations, updateOperationAct)
  );

  if (!operations || operations.length === 0) return null;

  const allowPredictInEditorOnly = Format.is1HLayout(layoutSt)
    || Format.is13CLayout(layoutSt)
    || Format.isIrLayout(layoutSt);
  const shouldShowPredict = !editorOnly || allowPredictInEditorOnly;

  return (
    <span className={classes.groupRightMost}>
      {
        ascendSelect(
          classes, hideSwitch, isAscendSt, toggleIsAscendAct,
        )
      }
      {
        intensitySelect(
          classes, (hideSwitch || !isEmWaveSt), isIntensitySt, toggleIsIntensityAct,
        )
      }
      {
        decimalSelect(
          classes, hideSwitch, decimalSt, updateDecimalAct,
        )
      }
      {
        shouldShowPredict
          ? (
            <BtnPredict
              feature={feature}
              forecast={forecast}
            />
          )
          : null
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
    isEmWaveSt: Format.isEmWaveLayout(state.layout),
    isAscendSt: state.submit.isAscend,
    isIntensitySt: state.submit.isIntensity,
    decimalSt: state.submit.decimal,
    operationSt: state.submit.operation,
  }
);

const mapDispatchToProps = (dispatch) => (
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
  forecast: PropTypes.object.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  operations: PropTypes.array.isRequired,
  operationSt: PropTypes.object.isRequired,
  hideSwitch: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  layoutSt: PropTypes.string.isRequired,
  isAscendSt: PropTypes.bool.isRequired,
  isIntensitySt: PropTypes.bool.isRequired,
  isEmWaveSt: PropTypes.bool.isRequired,
  decimalSt: PropTypes.number.isRequired,
  toggleIsAscendAct: PropTypes.func.isRequired,
  toggleIsIntensityAct: PropTypes.func.isRequired,
  updateOperationAct: PropTypes.func.isRequired,
  updateDecimalAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Submit);
