import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import SVGInline from 'react-svg-inline';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { PksEdit } from '../../helpers/converter';
import { Convert2Peak } from '../../helpers/chem';
import { FromManualToOffset } from '../../helpers/shift';
import {
  TxtLabel, StatusIcon, ConfidenceLabel, sectionInput, sectionBtn,
} from './comps';
import { SelectIrStatus } from './ir_comps';
import SmaToSvg from '../common/chem';
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

const tableHeader = classes => (
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

const tableBodyRow = (classes, idx, fg, value) => (
  <TableRow key={`${idx}-${fg}`}>
    <TableCell component="th" scope="row">
      {TxtLabel(classes, `${idx + 1}`, 'txt-prd-table-content')}
    </TableCell>
    <TableCell component="th" scope="row">
      <SVGInline width="80px" svg={SmaToSvg(fg)} />
    </TableCell>
    <TableCell align="left">
      {TxtLabel(classes, fg, 'txt-prd-table-content')}
    </TableCell>
    <TableCell align="right">
      {
        ConfidenceLabel(
          classes, value.confidence, 'txt-prd-table-content',
        )
      }
    </TableCell>
    <TableCell align="right">
      {StatusIcon(value.status)}
    </TableCell>
    <TableCell align="right">
      <SelectIrStatus
        fg={fg}
        status={value.statusOwner}
        identity="Owner"
      />
    </TableCell>
  </TableRow>
);

const sectionTable = (classes, predictions) => {
  if (!predictions) return null;

  return (
    <Paper className={classes.tableRoot}>
      <Table className={classes.table}>
        { tableHeader(classes) }
        <TableBody>
          {
            Object.keys(predictions).map((fg, idx) => {
              const value = predictions[fg];
              return tableBodyRow(classes, idx, fg, value);
            })
          }
        </TableBody>
      </Table>
    </Paper>
  );
};

const IrViewer = ({
  classes, feature, molecule, btnCb, inputCb,
  editPeakSt, thresSt, layoutSt, shiftSt, predictSt, clearPredictStatusAct,
}) => {
  const { ref, peak } = shiftSt;

  const offset = FromManualToOffset(ref, peak);
  const peaks = Convert2Peak(feature, thresSt.value * 0.01, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);

  const btnFuncCb = () => btnCb(peaksEdit, layoutSt, shiftSt);

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

IrViewer.propTypes = {
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

IrViewer.defaultProps = {
  inputCb: false,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(IrViewer);
