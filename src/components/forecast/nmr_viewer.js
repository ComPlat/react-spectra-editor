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
import {
  NmrTableHeader, NmrTableBodyRow, SectionReference,
} from './nmr_comps';

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

  const dict = pds.output.result[0];
  if (!dict) return <div />;
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

const NmrViewer = ({  // eslint-disable-line
  classes, molecule, inputCb, forecastSt, curveSt,
}) => {
  const { curveIdx } = curveSt;
  const predictionsByCurve = forecastSt.predictionsByCurve || {};
  const hasCurvePredictions = Object.prototype.hasOwnProperty.call(predictionsByCurve, curveIdx);
  const hasAnyCurvePredictions = Object.keys(predictionsByCurve).length > 0;
  const emptyPredictions = { outline: {}, output: { result: [] } };
  let activePredictions = forecastSt.predictions;
  if (hasCurvePredictions) {
    activePredictions = predictionsByCurve[curveIdx];
  } else if (hasAnyCurvePredictions) {
    activePredictions = emptyPredictions;
  }

  return (
    <div className={classNames(classes.root, 'card-forecast-viewer')}>
      <Grid className={classNames(classes.container)} container>
        <Grid item xs={4}>
          <Paper className={classes.svgRoot}>
            { sectionSvg(classes, activePredictions) }
          </Paper>
        </Grid>
        <Grid item xs={8}>
          { sectionTable(classes, activePredictions) }
        </Grid>
      </Grid>
      { sectionInput(classes, molecule, inputCb) }
      { SectionReference(classes) }
    </div>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    forecastSt: state.forecast,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
  }, dispatch)
);

NmrViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  molecule: PropTypes.string.isRequired,
  inputCb: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  forecastSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
};

NmrViewer.defaultProps = {
  inputCb: false,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(NmrViewer);
