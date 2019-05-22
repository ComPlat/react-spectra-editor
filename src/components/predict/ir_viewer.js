import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';

import {
  sectionInput, sectionSubmit, SectionRunning,
  SectionNoService, SectionMissMatch, SectionUnknown,
} from './comps';
import { IrTableHeader, IrTableBodyRow } from './ir_comps';


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
      <Table className={classes.table}>
        { IrTableHeader(classes) }
        <TableBody>
          {
            Object.keys(dict).map((fg, idx) => {
              const value = dict[fg];
              return IrTableBodyRow(classes, idx, fg, value);
            })
          }
        </TableBody>
      </Table>
    </Paper>
  );
};

const IrViewer = ({
  classes, feature, molecule, operations, inputCb, predictSt,
}) => (
  <div className={classNames(classes.root, 'card-predict-viewer')}>
    { sectionSubmit(classes, operations, feature, molecule) }
    { sectionTable(classes, predictSt) }
    { sectionInput(classes, molecule, inputCb) }
  </div>
);

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    predictSt: state.predict,
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
  predictSt: PropTypes.object.isRequired,
};

IrViewer.defaultProps = {
  inputCb: false,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(IrViewer);
