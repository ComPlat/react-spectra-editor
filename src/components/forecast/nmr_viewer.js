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
  sectionInput, sectionSubmit, SectionRunning,
  SectionNoService, SectionMissMatch, SectionUnknown,
} from './comps';
import {
  NmrTableHeader, NmrTableBodyRow, SectionReference,
} from './nmr_comps';


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
  submit: {
    margin: '0 0 0 30px',
    width: 300,
  },
});

const sectionTable = (classes, pds) => {
  if (pds.running) return <SectionRunning />;
  if (!pds.outline || !pds.outline.code) return null;

  if (pds.outline.code === 503) return <SectionNoService />;
  if (pds.outline.code === 400) return <SectionMissMatch />;
  if (pds.outline.code > 299) return <SectionUnknown />;

  const dict = pds.output.result[0];
  if (!dict) return null;
  return (
    <Paper className={classes.tableRoot}>
      <Table className={classes.table} size="small">
        { NmrTableHeader(classes) }
        <TableBody>
          {
            dict.shifts
              .sort((a, b) => a.atom - b.atom)
              .map((row, idx) => NmrTableBodyRow(classes, row, idx))
          }
        </TableBody>
      </Table>
    </Paper>
  );
};

const NmrViewer = ({
  classes, feature, molecule, operations, inputCb, forecastSt,
}) => (
  <div className={classNames(classes.root, 'card-forecast-viewer')}>
    { sectionSubmit(classes, operations, feature, molecule) }
    <Grid container>
      <Grid item xs={6}>
      </Grid>
      <Grid item xs={6}>
        { sectionTable(classes, forecastSt.predictions) }
      </Grid>
    </Grid>
    { sectionInput(classes, molecule, inputCb) }
    { SectionReference(classes) }
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

NmrViewer.propTypes = {
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

NmrViewer.defaultProps = {
  inputCb: false,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(NmrViewer);
