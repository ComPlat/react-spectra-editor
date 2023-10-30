/* eslint-disable react/function-component-definition, no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Accordion, AccordionSummary, Divider, Typography,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { withStyles } from '@mui/styles';

import { rmOneOffset } from '../../actions/offset';

const styles = (theme) => ({
  chip: {
    margin: '1px 0 1px 0',
  },
  panel: {
    backgroundColor: '#eee',
    display: 'table-row',
  },
  panelSummary: {
    backgroundColor: '#eee',
    height: 32,
  },
  txtBadge: {},
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)', // ROI
    overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  tRowHead: {
    backgroundColor: '#999',
    height: 32,
  },
  tTxtHead: {
    color: 'white',
    padding: '5px 5px 5px 5px',
  },
  tTxt: {
    padding: '4px 0 4px 0',
  },
  tRow: {
    height: 28,
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  rmBtn: {
    color: 'red',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: 'red',
      color: 'white',
    },
  },
});

const createData = (classes, idx, xL, xU, difference, tmax, onDelete) => (
  {
    idx: idx + 1,
    xL: xL.toFixed(2),
    xU: xU.toFixed(2),
    difference: difference.toFixed(2),
    tmax: tmax.toFixed(2),
    rmBtn: <HighlightOffIcon
      onClick={onDelete}
      className={classes.rmBtn}
    />,
  }
);

const offsetList = (offsets, digits, rmOneOffsetAct, classes, curveIdx) => {
  const rows = offsets.stack.map((offset, idx) => {
    const onDelete = () => {
      const payload = {
        dataToRemove: offset,
        curveIdx,
      };
      rmOneOffsetAct(payload);
    };
    return createData(classes, idx, offset.xL, offset.xU, offset.difference, offset.tmax, onDelete);
  });

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow className={classes.tRowHead}>
          <TableCell align="right" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}>No.</TableCell>
          <TableCell align="right" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}>Onset (°C)</TableCell>
          <TableCell align="right" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}>Offset (°C)</TableCell>
          <TableCell align="right" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}>Tmax (°C)</TableCell>
          <TableCell align="right" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}>W% Loss (%)</TableCell>
          <TableCell align="right" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}>-</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.idx} className={classes.tRow} hover>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.idx}</TableCell>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.xL}</TableCell>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.xU}</TableCell>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.tmax}</TableCell>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.difference}</TableCell>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.rmBtn}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const OffsetPanel = ({
  offsetSt, classes, expand, onExapnd, rmOneOffsetAct, curveSt,
}) => {
  const { selectedIdx, offsets } = offsetSt;
  const selectedOffsets = offsets[selectedIdx];

  if (!selectedOffsets) {
    return null;
  }

  const digits = 2;
  const { curveIdx } = curveSt;

  return (
    <Accordion
      data-testid="OffsetsPanelInfo"
      expanded={expand}
      onChange={onExapnd}
      className={classNames(classes.panel)}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
          <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
            Offsets
          </span>
        </Typography>
      </AccordionSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        {offsetList(selectedOffsets, digits, rmOneOffsetAct, classes, curveIdx)}
      </div>
    </Accordion>
  );
};

const mapStateToProps = (state, props) => (
  {
    offsetSt: state.offset.present,
    layoutSt: state.layout,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    rmOneOffsetAct: rmOneOffset,
  }, dispatch)
);

OffsetPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  offsetSt: PropTypes.object.isRequired,
  onExapnd: PropTypes.func.isRequired,
  rmOneOffsetAct: PropTypes.func.isRequired,
  curveSt: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(OffsetPanel));
