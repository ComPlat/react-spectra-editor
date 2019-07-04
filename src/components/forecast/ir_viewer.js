import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {
  sectionInput, sectionSubmit, sectionSvg,
  notToRenderAnalysis,
} from './comps';
import { IrTableHeader, IrTableBodyRow } from './ir_comps';


const Styles = () => ({
  root: {
    height: '65vh',
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
  container: {
    minHeight: '400px',
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
  submit: {
    margin: '0 0 0 30px',
    width: 300,
  },
});

const sectionTable = (classes, pds) => {
  const renderMsg = notToRenderAnalysis(pds);
  if (renderMsg) return renderMsg;

  if (!pds.output.result || !pds.output.result[0]) return null;

  const { fgs } = pds.output.result[0];
  if (!fgs) return null;
  return (
    <Paper className={classes.tableRoot}>
      <Table className={classes.table} size="small">
        { IrTableHeader(classes) }
        <TableBody>
          {
            fgs.sort((a, b) => b.confidence - a.confidence).map((fg, idx) => (
              IrTableBodyRow(classes, idx, fg)
            ))
          }
        </TableBody>
      </Table>
    </Paper>
  );
};

const IrViewer = ({
  classes, feature, molecule, operations, inputCb, forecastSt,
}) => (
  <div className={classNames(classes.root, 'card-forecast-viewer')}>
    { sectionSubmit(classes, operations, feature, molecule) }
    <Grid className={classNames(classes.container)} container>
      <Grid item xs={4}>
        { sectionSvg(classes, forecastSt.predictions) }
      </Grid>
      <Grid item xs={8}>
        { sectionTable(classes, forecastSt.predictions) }
      </Grid>
    </Grid>
    { sectionInput(classes, molecule, inputCb) }
  </div>
);

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    forecastSt: state.forecast,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

IrViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  molecule: PropTypes.string.isRequired,
  operations: PropTypes.array.isRequired,
  inputCb: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  forecastSt: PropTypes.object.isRequired,
};

IrViewer.defaultProps = {
  inputCb: false,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(IrViewer);
