import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { withStyles } from '@material-ui/core/styles';

import { rmFromPosList, rmFromNegList } from '../../actions/edit_peak';
import { LIST_LAYOUT } from '../../constants/list_layout';

const styles = theme => ({
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
  txtBadge: {
  },
  panelDetail: {
    backgroundColor: '#fff',
    height: 'calc(78vh - 280px)',
    overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  tRowHeadPos: {
    backgroundColor: '#999',
    height: 32,
  },
  tRowHeadNeg: {
    backgroundColor: '#999',
    height: 32,
  },
  tTxtHead: {
    color: 'white',
    padding: '5px 5px 5px 5px',
  },
  tTxtHeadXY: {
    color: 'white',
    padding: '4px 0 4px 90px',
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
        {rows.map(row => (
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
  rmFromPosListAct, rmFromNegListAct,
}) => {
  const { neg, pos } = editPeakSt;
  const digits = layoutSt === LIST_LAYOUT.IR ? 0 : 4;

  return (
    <ExpansionPanel
      expanded={expand}
      onChange={onExapnd}
      className={classNames(classes.panel)}
      TransitionProps={{ unmountOnExit: true }} // increase ExpansionPanel performance
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
          <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
            Peaks
          </span>
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        { peakList(pos, digits, rmFromPosListAct, classes, true) }
        { peakList(neg, digits, rmFromNegListAct, classes, false) }
      </div>
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak,
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = dispatch => (
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
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(PeakPanel));
