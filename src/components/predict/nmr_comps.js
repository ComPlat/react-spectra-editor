import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';

import { setNmrStatus } from '../../actions/predict';

const baseSelectNmrStatus = ({
  idx, atom, status, identity,
  setNmrStatusAct,
}) => {
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';

  return (
    <FormControl>
      <Select
        value={theStatus}
        onChange={(e) => {
          setNmrStatusAct({
            idx, atom, identity, value: e.target.value,
          });
        }}
      >
        <MenuItem value="accept">
          <CheckCircleOutline style={{ color: '#4caf50' }} />
        </MenuItem>
        <MenuItem value="reject">
          <HighlightOff style={{ color: '#e91e63' }} />
        </MenuItem>
        <MenuItem value="">
          <span />
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const bssMapStateToProps = (state, props) => ( // eslint-disable-line
  {}
);

const bssMapDispatchToProps = dispatch => (
  bindActionCreators({
    setNmrStatusAct: setNmrStatus,
  }, dispatch)
);

baseSelectNmrStatus.propTypes = {
  idx: PropTypes.number.isRequired,
  atom: PropTypes.number.isRequired,
  status: PropTypes.string,
  identity: PropTypes.string.isRequired,
  setNmrStatusAct: PropTypes.func.isRequired,
};

baseSelectNmrStatus.defaultProps = {
  status: '',
};

const SelectNmrStatus = connect(
  bssMapStateToProps, bssMapDispatchToProps,
)(baseSelectNmrStatus);

export {
  SelectNmrStatus, // eslint-disable-line
};
