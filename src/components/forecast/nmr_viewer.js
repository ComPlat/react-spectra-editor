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
import {
  NmrTableHeader, NmrTableBodyRow, SectionReference,
} from './nmr_comps';
import forecastSharedStyles from './styles';

const Styles = () => ({
  ...forecastSharedStyles(),
});

const sectionTable = (classes, pds) => {
  const renderMsg = notToRenderAnalysis(pds, classes);
  if (renderMsg) return renderMsg;

  const dict = pds.output.result[0];
  if (!dict) return <div />;
  return (
    <Table className={classes.table} size="small" stickyHeader>
      { NmrTableHeader(classes) }
      <TableBody>
        {
          dict.shifts
            .sort((a, b) => a.atom - b.atom)
            .map((row, idx) => NmrTableBodyRow(classes, row, idx))
        }
      </TableBody>
    </Table>
  );
};

const NmrViewer = ({  // eslint-disable-line
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
        <div className={classes.sectionHeader}>Shift analysis</div>
        <div className={classes.tableFrame}>
          { sectionTable(classes, forecastSt.predictions) }
        </div>
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
};

NmrViewer.defaultProps = {
  inputCb: false,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(NmrViewer);
