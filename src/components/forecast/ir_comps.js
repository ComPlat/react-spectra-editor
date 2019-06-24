import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SVGInline from 'react-svg-inline';

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {
  TxtLabel, StatusIcon, ConfidenceLabel,
} from './comps';
import { setIrStatus } from '../../actions/forecast';
import SmaToSvg from '../common/chem';


const baseSelectIrStatus = ({
  sma, status, identity,
  setIrStatusAct,
}) => {
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';

  return (
    <FormControl>
      <Select
        value={theStatus}
        onChange={(e) => {
          setIrStatusAct({
            predictions: {
              sma, identity, value: e.target.value ,
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
    setIrStatusAct: setIrStatus,
  }, dispatch)
);

baseSelectIrStatus.propTypes = {
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


const IrTableHeader = classes => (
  <TableHead>
    <TableRow>
      <TableCell />
      <TableCell>
        {TxtLabel(classes, 'Functional groups', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="left">
        {TxtLabel(classes, 'SMARTS', 'txt-prd-table-title')}
      </TableCell>
      <TableCell align="right">
        {TxtLabel(classes, 'Machine Confidence', 'txt-prd-table-title')}
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

const IrTableBodyRow = (classes, idx, fg) => (
  <TableRow key={`${idx}-${fg.name}`}>
    <TableCell component="th" scope="row">
      {TxtLabel(classes, `${idx + 1}`, 'txt-prd-table-content')}
    </TableCell>
    <TableCell component="th" scope="row">
      <SVGInline width="80px" svg={SmaToSvg(fg.sma)} />
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
    <TableCell align="right">
      {StatusIcon(fg.status)}
    </TableCell>
    <TableCell align="right">
      <SelectIrStatus
        sma={fg.sma}
        status={fg.statusOwner}
        identity="Owner"
      />
    </TableCell>
  </TableRow>
);

export {
  IrTableHeader, IrTableBodyRow,
};
