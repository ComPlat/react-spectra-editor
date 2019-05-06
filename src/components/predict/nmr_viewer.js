import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Format from '../../helpers/format';
import { PksEdit } from '../../helpers/converter';
import { Convert2Peak } from '../../helpers/chem';
import { FromManualToOffset } from '../../helpers/shift';
import {
  TxtLabel, StatusIcon, sectionInput, sectionBtn,
} from './comps';
import { SelectNmrStatus } from './nmr_comps';
import { clearPredictStatus } from '../../actions/predict';

const Styles = () => ({
  root: {
    height: '65vh',
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
  tableRoot: {
    margin: '10px 40px 0px 40px',
  },
  title: {
    textAlign: 'left',
  },
  btn: {
    marginLeft: 40,
  },
  reference: {
    borderTop: '1px solid #cfd8dc',
    margin: '10px 40px 0px 40px',
    padding: 5,
  },
  inputRoot: {
    margin: '10px 40px 0px 40px',
  },
  txtLabel: {
    fontSize: '12px',
  },
});

const numFormat = input => parseFloat(input).toFixed(2);

const realFormat = (val, status) => {
  if (status === 'missing') {
    return '- - -';
  }
  return numFormat(val);
};

const tableHeader = classes => (
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

const tableBodyRow = (classes, row, idx) => (
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

const sectionTable = (classes, predictions) => {
  if (!predictions || !predictions.shifts) return null;

  return (
    <Paper className={classes.tableRoot}>
      <Table className={classes.table}>
        { tableHeader(classes) }
        <TableBody>
          {
            predictions.shifts
              .sort((a, b) => a.atom - b.atom)
              .map((row, idx) => tableBodyRow(classes, row, idx))
          }
        </TableBody>
      </Table>
    </Paper>
  );
};

const sectionReference = classes => (
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

const NmrViewer = ({
  classes, feature, molecule, btnCb, inputCb,
  editPeakSt, thresSt, layoutSt, shiftSt, predictSt, clearPredictStatusAct,
}) => {
  const { ref, peak } = shiftSt;

  const offset = FromManualToOffset(ref, peak);
  const peaks = Convert2Peak(feature, thresSt.value * 0.01, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  const peaksWoRef = Format.rmRef(peaksEdit, shiftSt);

  const btnFuncCb = () => btnCb(peaksWoRef, layoutSt, shiftSt);

  return (
    <div className={classNames(classes.root, 'card-predict-viewer')}>
      {
        sectionBtn(
          classes,
          molecule,
          layoutSt,
          predictSt,
          btnFuncCb,
          clearPredictStatusAct,
        )
      }
      { sectionTable(classes, predictSt) }
      { sectionInput(classes, molecule, inputCb) }
      { sectionReference(classes) }
    </div>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak,
    thresSt: state.threshold,
    layoutSt: state.layout,
    shiftSt: state.shift,
    predictSt: state.predict,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    clearPredictStatusAct: clearPredictStatus,
  }, dispatch)
);

NmrViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  molecule: PropTypes.string.isRequired,
  btnCb: PropTypes.func.isRequired,
  inputCb: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  editPeakSt: PropTypes.object.isRequired,
  thresSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  shiftSt: PropTypes.object.isRequired,
  predictSt: PropTypes.object.isRequired,
  clearPredictStatusAct: PropTypes.func.isRequired,
};

NmrViewer.defaultProps = {
  inputCb: false,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(NmrViewer);
