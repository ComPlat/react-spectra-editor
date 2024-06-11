/* eslint-disable prefer-object-spread, react/jsx-one-expression-per-line,
react/function-component-definition,
max-len, no-unused-vars, no-multiple-empty-lines */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import {
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { commonStyle } from './common';
import { LIST_LAYOUT } from '../../constants/list_layout';
import { LIST_AXES } from '../../constants/list_axes';
import { updateXAxis, updateYAxis } from '../../actions/axes';

const listLayoutToShow = [LIST_LAYOUT.CYCLIC_VOLTAMMETRY];

const styles = () => (
  Object.assign(
    {
      fieldShift: {
        width: 160,
      },
      fieldLayout: {
        width: 100,
      },
    },
    commonStyle,
  )
);

const axisX = (classes, layoutSt, axesUnitsSt, updateXAxisAct, curveSt) => {
  const optionsAxisX = LIST_AXES.x;
  const options = optionsAxisX[layoutSt];
  const { curveIdx } = curveSt;
  const onChange = (e) => updateXAxisAct({ value: e.target.value, curveIndex: curveIdx });
  const { axes } = axesUnitsSt;
  let selectedAxes = axes[curveIdx];
  if (!selectedAxes) {
    selectedAxes = { xUnit: '', yUnit: '' };
  }
  const { xUnit } = selectedAxes;
  return (
    <FormControl
      className={classNames(classes.fieldLayout)}
      variant="outlined"
    >
      <Select
        labelId="select-x-axis-label"
        label="x-Axis"
        value={xUnit}
        onChange={onChange}
        className={classNames(classes.selectInput, 'input-sv-bar-layout')}
      >
        {
          options.map(item => { // eslint-disable-line
            return (
              <MenuItem value={item} key={item}>
                <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
                  {
                    item === '' ? 'Default' : item
                  }
                </span>
              </MenuItem>
            );
          })
        }
      </Select>
      <InputLabel id="select-x-axis-label" className={classNames(classes.txtLabelTopInput)}>
        x-Axis
      </InputLabel>
    </FormControl>
  );
};

const axisY = (classes, layoutSt, axesUnitsSt, updateYAxisAct, curveSt) => {
  const optionsAxisX = LIST_AXES.y;
  const options = optionsAxisX[layoutSt];
  const { curveIdx } = curveSt;
  const onChange = (e) => updateYAxisAct({ value: e.target.value, curveIndex: curveIdx });
  const { axes } = axesUnitsSt;
  let selectedAxes = axes[curveIdx];
  if (!selectedAxes) {
    selectedAxes = { xUnit: '', yUnit: '' };
  }
  const { yUnit } = selectedAxes;
  return (
    <FormControl
      className={classNames(classes.fieldLayout)}
      variant="outlined"
    >
      <Select
        labelId="select-y-axis-label"
        label="y-Axis"
        value={yUnit}
        onChange={onChange}
        className={classNames(classes.selectInput, 'input-sv-bar-layout')}
      >
        {
          options.map(item => { // eslint-disable-line
            return (
              <MenuItem value={item} key={item}>
                <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
                  {
                    item === '' ? 'Default' : item
                  }
                </span>
              </MenuItem>
            );
          })
        }
      </Select>
      <InputLabel id="select-y-axis-label" className={classNames(classes.txtLabelTopInput)}>
        y-Axis
      </InputLabel>
    </FormControl>
  );
};

const showSelect = (classes, layoutSt, curveSt, axesUnitsSt, updateXAxisAct, updateYAxisAct) => {
  if (!listLayoutToShow.includes(layoutSt)) {
    return (
      <i />
    );
  }

  return (
    <span>
      { axisX(classes, layoutSt, axesUnitsSt, updateXAxisAct, curveSt) }
      { axisY(classes, layoutSt, axesUnitsSt, updateYAxisAct, curveSt) }
    </span>
  );
};

const ChangeAxes = ({
  classes, layoutSt, curveSt, axesUnitsSt, updateXAxisAct, updateYAxisAct,
}) => (
  <span className={classes.groupRight} data-testid="ChangeAxes">
    { showSelect(classes, layoutSt, curveSt, axesUnitsSt, updateXAxisAct, updateYAxisAct) }
  </span>
);

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    curveSt: state.curve,
    axesUnitsSt: state.axesUnits,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    updateXAxisAct: updateXAxis,
    updateYAxisAct: updateYAxis,
  }, dispatch)
);

ChangeAxes.propTypes = {
  classes: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  curveSt: PropTypes.object.isRequired,
  axesUnitsSt: PropTypes.object.isRequired,
  updateXAxisAct: PropTypes.func.isRequired,
  updateYAxisAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ChangeAxes));
