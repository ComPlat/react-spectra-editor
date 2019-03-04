import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import SVGInline from 'react-svg-inline';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { PksEdit } from '../../helpers/converter';
import { Convert2Peak } from '../../helpers/chem';
import { FromManualToOffset } from '../../helpers/shift';
import { TxtLabel, StatusIcon } from '../common/ui';
import SmaToSvg from '../common/chem';

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

const sectionTable = (classes, predictions) => {
  if (!predictions) return null;

  return (
    <Paper className={classes.tableRoot}>
      <Table className={classes.table}>
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
              {TxtLabel(classes, 'Status', 'txt-prd-table-title')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            predictions.result
              .map((row, idx) => (
                <TableRow key={`${idx}-${row.fg}`}>
                  <TableCell component="th" scope="row">
                    {TxtLabel(classes, `${idx + 1}`, 'txt-prd-table-content')}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <SVGInline width="50%" height="50%" svg={SmaToSvg(row.fg)} />
                  </TableCell>
                  <TableCell align="left">
                    {TxtLabel(classes, row.fg, 'txt-prd-table-content')}
                  </TableCell>
                  <TableCell align="right">
                    {StatusIcon(row.status)}
                  </TableCell>
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
    </Paper>
  );
};

const sectionInput = (classes, molecule, inputFuncCb) => {
  if (!inputFuncCb) return null;

  return (
    <div
      className={classNames(classes.inputRoot)}
    >
      <Grid container>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={TxtLabel(classes, 'Molfile', 'txt-mol-label')}
            margin="normal"
            multiline
            onChange={inputFuncCb}
            rows="2"
            variant="outlined"
            value={molecule}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const sectionBtn = (classes, molecule, layoutSt, btnCb) => (
  <div className={classNames(classes.title)}>
    <Button
      variant="contained"
      color="primary"
      className={classNames(classes.btn, 'txt-btn-save')}
      onClick={btnCb}
      disabled={!molecule}
    >
      { `Predict - ${layoutSt}` }
    </Button>
  </div>
);

const IrViewer = ({
  classes, peakObj, predictObj, editPeakSt, thresSt,
  layoutSt, shiftSt,
}) => {
  const { ref, peak } = shiftSt;

  const offset = FromManualToOffset(ref, peak);
  const peaks = Convert2Peak(peakObj, thresSt * 0.01, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);

  const {
    btnCb, inputCb, predictions, molecule,
  } = predictObj;

  const btnFuncCb = () => btnCb(peaksEdit, layoutSt, shiftSt);

  return (
    <div className={classNames(classes.root, 'card-predict-viewer')}>
      { sectionBtn(classes, molecule, layoutSt, btnFuncCb) }
      { sectionTable(classes, predictions) }
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
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

IrViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
  predictObj: PropTypes.object.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  thresSt: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ],
  ).isRequired,
  layoutSt: PropTypes.string.isRequired,
  shiftSt: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(IrViewer);
