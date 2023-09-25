import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@mui/styles';
import {
  Table, TableBody, Paper, Grid,
} from '@mui/material';

import {
  sectionInput, sectionSvg,
  notToRenderAnalysis,
} from './comps';
import { IrTableHeader, IrTableBodyRow } from './ir_comps';

const Styles = () => ({
  root: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  container: {
    minHeight: '400px',
  },
  svgRoot: {
    margin: '10px 40px 0px 40px',
    height: 'calc(70vh)',
    overflowY: 'hidden',
  },
  tableRoot: {
    margin: '10px 40px 0px 40px',
    maxHeight: 'calc(70vh)',
    overflowY: 'scroll',
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

const IrViewer = ({ // eslint-disable-line
  classes, molecule, inputCb, forecastSt,
}) => (
  <div className={classNames(classes.root, 'card-forecast-viewer')}>
    <Grid className={classNames(classes.container)} container>
      <Grid item xs={4}>
        <Paper className={classes.svgRoot}>
          { sectionSvg(classes, forecastSt.predictions) }
        </Paper>
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

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
  }, dispatch)
);

IrViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  molecule: PropTypes.string.isRequired,
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
