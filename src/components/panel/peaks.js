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
import { Convert2Peak } from '../../helpers/chem';

import { rmFromPosList, rmFromNegList } from '../../actions/edit_peak';
import Format from '../../helpers/format';

const styles = () => ({
  chip: {
    margin: '1px 0 1px 0',
  },
  panel: {
    backgroundColor: '#fff',
    display: 'block',
  },
  panelSummary: {
    height: 32,
  },
  txtBadge: {
  },
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)', // ROI
    overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  tRowHeadPos: {
    backgroundColor: '#5f6b76',
    height: 32,
  },
  tRowHeadNeg: {
    backgroundColor: '#5f6b76',
    height: 32,
  },
  tTxtHead: {
    color: 'white',
    padding: '5px 5px 5px 5px',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  tTxtHeadXY: {
    color: 'white',
    padding: '4px 0 4px 90px',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  tTxt: {
    color: '#3f4952',
    fontSize: '0.78rem',
    padding: '5px 0',
  },
  tRow: {
    height: 28,
    borderBottom: '1px solid #edf0f2',
    '&:nth-of-type(even)': {
      backgroundColor: '#fbfcfd',
    },
  },
  rmBtn: {
    color: '#b42318',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: '#b42318',
      color: 'white',
    },
  },
});

const createData = (classes, idx, x, y, cb, digits) => (
  {
    idx: idx + 1,
    x: x.toFixed(digits),
    y,
    rmBtn: <HighlightOffIcon onClick={cb} className={classes.rmBtn} />,
  }
);

const peakList = (peaks, digits, cbAct, classes, isPos) => {
  const rows = peaks.map((pp, idx) => {
    const onDelete = () => cbAct(pp);
    return createData(classes, idx, pp.x, pp.y, onDelete, digits);
  });

  const rowKlass = isPos ? classes.tRowHeadPos : classes.tRowHeadNeg;
  const headTxt = isPos ? 'P+' : 'P-';

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow className={rowKlass}>
          <TableCell align="right" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}><i>{ headTxt }</i></TableCell>
          <TableCell align="right" className={classNames(classes.tTxtHeadXY, 'txt-sv-panel-head')}>X</TableCell>
          <TableCell align="right" className={classNames(classes.tTxtHeadXY, 'txt-sv-panel-head')}>Y</TableCell>
          <TableCell align="right" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}>-</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.idx} className={classes.tRow} hover>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.idx}</TableCell>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.x}</TableCell>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.y.toExponential(2)}</TableCell>
            <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{row.rmBtn}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const PeakPanel = ({
  editPeakSt, layoutSt, classes, expand, onExapnd,
  rmFromPosListAct, rmFromNegListAct, curveSt,
}) => {
  const { curveIdx, listCurves } = curveSt;
  const { peaks } = editPeakSt;
  if (curveIdx >= peaks.length) {
    return null;
  }
  const selectedEditPeaks = peaks[curveIdx];
  if (!selectedEditPeaks) {
    return null;
  }
  const { pos, neg } = selectedEditPeaks;

  const selectedCurve = listCurves[curveIdx];
  if (!selectedCurve) {
    return null;
  }
  const { feature } = selectedCurve;
  const currentPeakOfCurve = Convert2Peak(feature);
  const filteredArray = currentPeakOfCurve.filter((element) => neg.includes(element));

  const peaksData = [].concat(filteredArray).concat(pos);

  const digits = Format.isEmWaveLayout(layoutSt) ? 0 : 4;

  return (
    <Accordion
      data-testid="PeaksPanelInfo"
      expanded={expand}
      onChange={onExapnd}
      disableGutters
      sx={{
        '&.MuiAccordion-root.Mui-expanded': { margin: 0 },
        '&:before': { display: 'none' },
      }}
      TransitionProps={{ unmountOnExit: true }} // increase Accordion performance
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
          <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
            Peaks
          </span>
        </Typography>
      </AccordionSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        { peakList(peaksData, digits, rmFromPosListAct, classes, true) }
        {/* { peakList(neg, digits, rmFromNegListAct, classes, false) } */}
      </div>
    </Accordion>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak.present,
    layoutSt: state.layout,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    rmFromPosListAct: rmFromPosList,
    rmFromNegListAct: rmFromNegList,
  }, dispatch)
);

PeakPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  onExapnd: PropTypes.func.isRequired,
  rmFromPosListAct: PropTypes.func.isRequired,
  rmFromNegListAct: PropTypes.func.isRequired,
  curveSt: PropTypes.object.isRequired,
};

export default connect( // eslint-disable-line
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(PeakPanel)); // eslint-disable-line
