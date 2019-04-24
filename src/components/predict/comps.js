import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

import { selectIrStatus } from '../../actions/predict';

const TxtLabel = (classes, label, extClsName = 'txt-label') => (
  <span
    className={classNames(classes.txtLabel, extClsName)}
  >
    { label }
  </span>
);

const StatusIcon = (status) => {
  switch (status) {
    case 'accept':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Accept</span>}
          placement="left"
        >
          <CheckCircleOutline style={{ color: '#4caf50' }} />
        </Tooltip>
      );
    case 'warning':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Warning</span>}
          placement="left"
        >
          <ErrorOutline style={{ color: '#ffc107' }} />
        </Tooltip>
      );
    case 'reject':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Reject</span>}
          placement="left"
        >
          <HighlightOff style={{ color: '#e91e63' }} />
        </Tooltip>
      );
    case 'missing':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Missing</span>}
          placement="left"
        >
          <HelpOutline style={{ color: '#5d4037' }} />
        </Tooltip>
      );
    case 'unknown':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Not Support</span>}
          placement="left"
        >
          <Help style={{ color: '#5d4037' }} />
        </Tooltip>
      );
    default:
      return null;
  }
};

const ConfidenceLabel = (classes, confidence, extClsName = 'txt-label') => {
  if (!confidence) return <span> - - </span>;

  return (
    <span
      className={classNames(classes.txtLabel, extClsName)}
    >
      { `${confidence} %` }
    </span>
  );
};

const baseSelectStatus = ({
  fg, status, identity,
  selectIrStatusAct,
}) => {
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';

  return (
    <FormControl>
      <Select
        value={theStatus}
        onChange={(e) => {
          selectIrStatusAct({ fg, identity, value: e.target.value });
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
    selectIrStatusAct: selectIrStatus,
  }, dispatch)
);

baseSelectStatus.propTypes = {
  fg: PropTypes.string.isRequired,
  status: PropTypes.string,
  identity: PropTypes.string.isRequired,
  selectIrStatusAct: PropTypes.func.isRequired,
};

baseSelectStatus.defaultProps = {
  status: '',
};

const SelectStatus = connect(
  bssMapStateToProps, bssMapDispatchToProps,
)(baseSelectStatus);

export {
  TxtLabel, StatusIcon, ConfidenceLabel, SelectStatus,
};
