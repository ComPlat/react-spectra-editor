/* eslint-disable react/function-component-definition, function-paren-newline,
prefer-object-spread */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import {
  Select, FormControl, MenuItem,
  TableCell, TableHead, TableRow,
} from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import HighlightOff from '@mui/icons-material/HighlightOff';

import {
  TxtLabel, StatusIcon, ConfidenceLabel,
} from './comps';
import { setIrStatus } from '../../actions/forecast';

const baseSelectIrStatus = ({
  classes, sma, status, identity,
  setIrStatusAct,
}) => {
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';

  return (
    <FormControl size="small" className={classes.ownerSelect}>
      <Select
        value={theStatus}
        displayEmpty
        onChange={(e) => {
          setIrStatusAct({
            predictions: {
              sma, identity, value: e.target.value,
            },
            svgs: [],
          });
        }}
      >
        <MenuItem value="accept">
          <CheckCircleOutline style={{ color: '#4caf50', fontSize: 18 }} />
        </MenuItem>
        <MenuItem value="reject">
          <HighlightOff style={{ color: '#e91e63', fontSize: 18 }} />
        </MenuItem>
        <MenuItem value="">
          <span style={{ color: '#a8b0b8', fontSize: 12 }}>—</span>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const bssMapStateToProps = (state, props) => ( // eslint-disable-line
  {}
);

const bssMapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setIrStatusAct: setIrStatus,
  }, dispatch)
);

baseSelectIrStatus.propTypes = {
  classes: PropTypes.object.isRequired,
  sma: PropTypes.string.isRequired,
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

const IrTableHeader = (classes) => (
  <TableHead>
    <TableRow>
      <TableCell />
      <TableCell align="left">
        {TxtLabel(classes, 'FG SMARTS', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="right">
        {TxtLabel(classes, 'Machine Confidence', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="center">
        {TxtLabel(classes, 'Machine', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="center">
        {TxtLabel(classes, 'Owner', 'txt-prd-table-title')}
      </TableCell>
    </TableRow>
  </TableHead>
);

const colorStyles = [
  { backgroundColor: '#fff9c4' },
  { backgroundColor: '#e3f2fd' },
  { backgroundColor: '#fce4ec' },
  { backgroundColor: '#e8f5e9' },
  { backgroundColor: '#ede7f6' },
  { backgroundColor: '#fff3e0' },
  { backgroundColor: '#e0f7fa' },
  { backgroundColor: '#f3e5f5' },
];

const colorLabel = (classes, idx, extClsName = 'txt-label') => {
  const style = Object.assign(
    {},
    colorStyles[idx % 8],
    {
      borderRadius: 6,
      display: 'inline-block',
      minWidth: 24,
      padding: '2px 6px',
      textAlign: 'center',
    },
  );

  return (
    <div style={style}>
      <span className={classNames(classes.txtLabel, extClsName)}>
        { idx + 1 }
      </span>
    </div>
  );
};

const IrTableBodyRow = (classes, idx, fg) => {
  const { statusCell } = classes;
  return (
    <TableRow key={`${idx}-${fg.name}`}>
      <TableCell component="th" scope="row">
        {colorLabel(classes, idx)}
      </TableCell>
      <TableCell align="left">
        {TxtLabel(classes, fg.sma, 'txt-prd-table-content')}
      </TableCell>
      <TableCell align="right">
        {
          ConfidenceLabel(
            classes, fg.confidence, 'txt-prd-table-content',
          )
        }
      </TableCell>
      <TableCell align="center" className={statusCell}>
        {StatusIcon(classes, fg.status)}
      </TableCell>
      <TableCell align="center">
        <SelectIrStatus
          classes={classes}
          sma={fg.sma}
          status={fg.statusOwner}
          identity="Owner"
        />
      </TableCell>
    </TableRow>
  );
};

export {
  IrTableHeader, IrTableBodyRow,
};
