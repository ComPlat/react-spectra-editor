/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  FormControl, TextField,
} from '@mui/material';
import { withStyles } from '@mui/styles';

import { selectMpyType } from '../../actions/multiplicity';

const Styles = () => ({
  formControl: {
    minWidth: 50,
    margin: '2px 3px 0 3px',
  },
  txtField: {
    width: 120,
    margin: '3px 3px 3px 3px',
  },
  txtInput: {
    height: 24,
    fontSize: '0.9rem',
    fontFamily: 'Helvetica',
    color: 'white',
  },
});

const MpySelect = ({
  classes, target, selectMpyTypeAct,
}) => {
  const { mpyType, xExtent } = target;
  const onBlur = (e) => selectMpyTypeAct({ xExtent, mpyType: e.target.value });
  const onChange = (e) => selectMpyTypeAct({ xExtent, mpyType: e.target.value });
  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      selectMpyTypeAct({ xExtent, mpyType: e.target.value });
    }
  };

  return (
    <FormControl
      className={classNames(classes.formControl)}
      variant="outlined"
    >
      <TextField
        className={classNames(classes.txtField, 'txt-cmd-field')}
        value={mpyType}
        margin="none"
        variant="outlined"
        InputProps={{
          className: classNames(classes.txtInput, 'txt-sv-input-label'),
        }}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onEnterPress}
      />
    </FormControl>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {}
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    selectMpyTypeAct: selectMpyType,
  }, dispatch)
);

MpySelect.propTypes = {
  classes: PropTypes.object.isRequired,
  target: PropTypes.object.isRequired,
  selectMpyTypeAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(Styles)(MpySelect));
