/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import {
  Select, MenuItem, FormControl, InputLabel, Menu,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

import {
  toggleIsAscend, toggleIsIntensity,
  updateOperation, updateDecimal,
} from '../../actions/submit';
import BtnSubmit from './r05_submit_btn';
import BtnPredict from './r06_predict_btn';
import { MuButton, commonStyle } from './common';
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
      splitSubmitWrap: {
        alignItems: 'flex-end',
        display: 'inline-flex',
        margin: '0 0 0 2px',
        position: 'relative',
        verticalAlign: 'middle',
      },
      splitSubmitLabel: {
        backgroundColor: '#fff',
        color: '#66727c',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: 10,
        left: 8,
        lineHeight: 1.3,
        padding: '0 4px',
        position: 'absolute',
        top: -6,
        zIndex: 1,
      },
      splitSubmitMain: {
        borderRadius: '6px 0 0 6px',
        borderRight: 'none',
        justifyContent: 'space-between',
        margin: '0 !important',
        minWidth: 116,
        padding: '0 8px',
        width: 116,
      },
      splitSubmitText: {
        color: '#25313b',
        display: 'block',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: 12,
        overflow: 'hidden',
        textAlign: 'left',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
      },
      splitSubmitArrow: {
        borderRadius: '0 6px 6px 0',
        margin: '0 !important',
        minWidth: 28,
        width: 28,
      },
      splitMenuItem: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: 12,
      },
      splitSelected: {
        color: '#0b5cad',
        fontWeight: 700,
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

const selectOperation = (name, operations, updateOperationAct) => {
  let operation = false;
  operations.forEach((o) => {
    if (o.name === name) {
      operation = o;
    }
  });
  updateOperationAct(operation);
};

const currentOperation = (operations, operation) => (
  operations.find((o) => o.name === operation.name) || operations[0]
);

const SubmitSplitButton = ({
  classes, operations, operation, feature, isAscend, isIntensity,
  disabled, updateOperationAct,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const selectedOperation = currentOperation(operations, operation);
  const open = Boolean(anchorEl);
  const onOpen = (event) => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);
  const onSelect = (name) => {
    selectOperation(name, operations, updateOperationAct);
    onClose();
  };

  return (
    <span className={classes.splitSubmitWrap}>
      <span className={classNames(classes.splitSubmitLabel, 'select-sv-bar-label')}>
        Submit
      </span>
      <MuButton
        className={classes.splitSubmitMain}
        onClick={onOpen}
        disabled={operations.length < 2}
      >
        <span className={classNames(classes.splitSubmitText, 'txt-sv-bar-submit')}>
          {selectedOperation.name}
        </span>
        <ArrowDropDownRoundedIcon className={classes.icon} />
      </MuButton>
      <BtnSubmit
        className={classes.splitSubmitArrow}
        feature={feature}
        isAscend={isAscend}
        isIntensity={isIntensity}
        operation={selectedOperation}
        disabled={disabled}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
      >
        {operations.map((o) => (
          <MenuItem
            key={o.name}
            onClick={() => onSelect(o.name)}
            className={classNames(
              classes.splitMenuItem,
              o.name === selectedOperation.name && classes.splitSelected,
            )}
          >
            {o.name}
          </MenuItem>
        ))}
      </Menu>
    </span>
  );
};

const Submit = ({
  operations, classes, feature, forecast, editorOnly, hideSwitch, disabled,
  isAscendSt, isIntensitySt, operationSt, decimalSt, isEmWaveSt,
  toggleIsAscendAct, toggleIsIntensityAct,
  updateOperationAct, updateDecimalAct,
}) => {
  if (!operations || operations.length === 0) return null;

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
        editorOnly
          ? null
          : (
            <BtnPredict
              feature={feature}
              forecast={forecast}
            />
          )
      }
      <SubmitSplitButton
        classes={classes}
        operations={operations}
        operation={operationSt}
        feature={feature}
        isAscend={isAscendSt}
        isIntensity={isIntensitySt}
        disabled={disabled}
        updateOperationAct={updateOperationAct}
      />
    </span>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
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
  isAscendSt: PropTypes.bool.isRequired,
  isIntensitySt: PropTypes.bool.isRequired,
  isEmWaveSt: PropTypes.bool.isRequired,
  decimalSt: PropTypes.number.isRequired,
  toggleIsAscendAct: PropTypes.func.isRequired,
  toggleIsIntensityAct: PropTypes.func.isRequired,
  updateOperationAct: PropTypes.func.isRequired,
  updateDecimalAct: PropTypes.func.isRequired,
};

SubmitSplitButton.propTypes = {
  classes: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  operation: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  isAscend: PropTypes.bool.isRequired,
  isIntensity: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  updateOperationAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Submit);
