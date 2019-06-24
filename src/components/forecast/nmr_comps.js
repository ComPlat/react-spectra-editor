import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {
  TxtLabel, StatusIcon,
} from './comps';
import { setNmrStatus } from '../../actions/forecast';

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
            predictions: {
              idx, atom, identity, value: e.target.value,
            },
            svgs: [],
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

const numFormat = input => parseFloat(input).toFixed(2);

const realFormat = (val, status) => {
  if (status === 'missing') {
    return '- - -';
  }
  return numFormat(val);
};

const NmrTableHeader = classes => (
  <TableHead>
    <TableRow>
      <TableCell>
        {TxtLabel(classes, 'Atom', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="right">
        {TxtLabel(classes, 'Prediction (ppm)', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="right">
        {TxtLabel(classes, 'Real (ppm)', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="right">
        {TxtLabel(classes, 'Diff (ppm)', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="right">
        {TxtLabel(classes, 'Machine', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="right">
        {TxtLabel(classes, 'Owner', 'txt-prd-table-title')}
      </TableCell>
    </TableRow>
  </TableHead>
);

const NmrTableBodyRow = (classes, row, idx) => (
  <TableRow key={`${idx}-${row.atom}`}>
    <TableCell component="th" scope="row">
      {TxtLabel(classes, row.atom, 'txt-prd-table-content')}
    </TableCell>
    <TableCell align="right">
      {TxtLabel(classes, numFormat(row.prediction), 'txt-prd-table-content')}
    </TableCell>
    <TableCell align="right">
      {
        TxtLabel(
          classes,
          realFormat(row.real, row.status),
          'txt-prd-table-content',
        )
      }
    </TableCell>
    <TableCell align="right">
      {
        TxtLabel(
          classes,
          realFormat(row.diff, row.status),
          'txt-prd-table-content',
        )
      }
    </TableCell>
    <TableCell align="right">
      {StatusIcon(row.status)}
    </TableCell>
    <TableCell align="right">
      <SelectNmrStatus
        idx={idx}
        atom={row.atom}
        status={row.statusOwner}
        identity="Owner"
      />
    </TableCell>
  </TableRow>
);

const SectionReference = classes => (
  <div className={classNames(classes.reference)}>
    <p>
      <span>NMR prediction source: </span>
      <a
        href="https://www.ncbi.nlm.nih.gov/pubmed/15464159"
        target="_blank"
        rel="noopener noreferrer"
      >
        nmrshiftdb
      </a>
    </p>
  </div>
);

export {
  NmrTableHeader, NmrTableBodyRow, SectionReference,
};
