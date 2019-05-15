import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

import { toggleIsAscend, updateOperation } from '../../actions/submit';
import SwitchSequence from './switch_sequence';
import BtnSubmit from './btn_submit';

const Styles = () => ({
  formControl: {
    margin: '10px 20px 0px 10px',
    minWidth: 150,
  },
});

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
    <Tooltip
      title={<span className="txt-sv-tp">Operation</span>}
      placement="left"
      disableFocusListener
      disableTouchListener
    >
      <FormControl
        className={classNames(classes.formControl)}
      >
        <Select value={selectedValue} onChange={onChangeSelect}>
          { options }
        </Select>
      </FormControl>
    </Tooltip>
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
  operations, classes, feature, isAscendSt, operationSt, hideSwitch,
  toggleIsAscendAct, updateOperationAct,
}) => {
  const onChangeSelect = e => (
    selectOperation(e.target.value, operations, updateOperationAct)
  );

  if (!operations || operations.length === 0) return null;

  return (
    <ExpansionPanelDetails>
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
                <SwitchSequence
                  isAscend={isAscendSt}
                  onToggleSwitch={toggleIsAscendAct}
                />
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
            operation={operationSt}
          />
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    isAscendSt: state.submit.isAscend,
    operationSt: state.submit.operation,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleIsAscendAct: toggleIsAscend,
    updateOperationAct: updateOperation,
  }, dispatch)
);

SubmitPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  hideSwitch: PropTypes.bool.isRequired,
  isAscendSt: PropTypes.bool.isRequired,
  operationSt: PropTypes.object.isRequired,
  toggleIsAscendAct: PropTypes.func.isRequired,
  updateOperationAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(SubmitPanel);
