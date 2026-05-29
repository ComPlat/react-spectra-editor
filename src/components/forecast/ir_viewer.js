import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@mui/styles';
import {
  Table, TableBody, Grid,
} from '@mui/material';

import {
  sectionInput, sectionSvg,
  notToRenderAnalysis,
} from './comps';
import { IrTableHeader, IrTableBodyRow } from './ir_comps';
import forecastSharedStyles from './styles';

const Styles = () => ({
  ...forecastSharedStyles(),
});

const sectionTable = (classes, pds) => {
  const renderMsg = notToRenderAnalysis(pds, classes);
  if (renderMsg) return renderMsg;

  if (!pds.output.result || !pds.output.result[0]) return null;

  const { fgs } = pds.output.result[0];
  if (!fgs) return null;
  return (
    <Table className={classes.table} size="small" stickyHeader>
      { IrTableHeader(classes) }
      <TableBody>
        {
          fgs.sort((a, b) => b.confidence - a.confidence).map((fg, idx) => (
            IrTableBodyRow(classes, idx, fg)
          ))
        }
      </TableBody>
    </Table>
  );
};

const IrViewer = ({ // eslint-disable-line
  classes, molecule, inputCb, forecastSt,
}) => (
  <div className={classNames(classes.root, 'card-forecast-viewer')}>
    <Grid container spacing={2} className={classes.analysisGrid}>
      <Grid item xs={12} md={4} className={classes.structureCol}>
        <div className={classes.sectionHeader}>Structure</div>
        <div className={classes.structureFrame}>
          { sectionSvg(classes, forecastSt.predictions) }
        </div>
      </Grid>
      <Grid item xs={12} md={8} className={classes.tableCol}>
        <div className={classes.sectionHeader}>Functional groups</div>
        <div className={classes.tableFrame}>
          { sectionTable(classes, forecastSt.predictions) }
        </div>
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
