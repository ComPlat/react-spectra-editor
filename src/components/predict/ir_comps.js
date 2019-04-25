import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';

import { setIrStatus } from '../../actions/predict';

const baseSelectIrStatus = ({
  fg, status, identity,
  setIrStatusAct,
}) => {
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';

  return (
    <FormControl>
      <Select
        value={theStatus}
        onChange={(e) => {
          setIrStatusAct({ fg, identity, value: e.target.value });
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
    setIrStatusAct: setIrStatus,
  }, dispatch)
);

baseSelectIrStatus.propTypes = {
  fg: PropTypes.string.isRequired,
  status: PropTypes.string,
  identity: PropTypes.string.isRequired,
  setIrStatusAct: PropTypes.func.isRequired,
};

baseSelectIrStatus.defaultProps = {
  status: '',
};

const SelectIrStatus = connect(
  bssMapStateToProps, bssMapDispatchToProps,
)(baseSelectIrStatus);

export {
  SelectIrStatus, // eslint-disable-line
};
