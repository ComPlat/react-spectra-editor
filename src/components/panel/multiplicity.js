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
import TableRow from '@material-ui/core/TableRow';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

import {
  rmMpyPeakByPanel, clickMpyOne, resetMpyOne,
} from '../../actions/multiplicity';
import { LIST_LAYOUT } from '../../constants/list_layout';
import MpySelect from './multiplicity_select';
import MpyCoupling from './multiplicity_coupling';
import { calcMpyCenter, calcJStr } from '../../helpers/calc';

const styles = theme => ({
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
    backgroundColor: '#2196f3',
    height: 32,
  },
  tRowHeadNeg: {
    backgroundColor: '#fa004f',
    height: 32,
  },
  tTxtHead: {
    color: 'white',
    padding: '4px 0 4px 5px',
  },
  tTxtHeadXY: {
    color: 'white',
    padding: '4px 0 4px 90px',
  },
  tTxt: {
    padding: 0,
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
  moCard: {
    textAlign: 'left',
  },
  moCardHead: {
    backgroundColor: '#999',
    color: 'white',
  },
  moExtId: {
    border: '2px solid white',
    borderRadius: 12,
    color: 'white',
    margin: '0 5px 0 5px',
    padding: '0 5px 0 5px',
  },
  moExtTxt: {
    margin: '0 5px 0 5x',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
  moSelect: {
    margin: '0 5x 0 5px',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
  moCBox: {
    padding: '4px 0 4px 4px',
  },
  btnRf: {
    color: '#fff',
    float: 'right',
    minWidth: 40,
    right: 15,
  },
});

const cBoxStyle = () => ({
  root: {
    color: 'white',
    '&$checked': {
      color: 'white',
    },
  },
  checked: {},
});
const MUCheckbox = withStyles(cBoxStyle)(Checkbox);

const createData = (
  idx, xExtent, peaks, shift, smExtext, mpyType, js,
  onClick, onRefresh,
) => (
  {
    idx: idx + 1,
    xExtent,
    onClick,
    onRefresh,
    peaks,
    center: calcMpyCenter(peaks, shift, mpyType),
    jStr: calcJStr(js),
    mpyType,
    isCheck: (smExtext.xL === xExtent.xL && smExtext.xU === xExtent.xU),
  }
);

const pkList = (classes, row, shift, digits, rmMpyPeakByPanelAct) => (
  row.peaks.map((pk) => {
    const { xExtent } = row;
    const cb = () => rmMpyPeakByPanelAct({ peak: pk, xExtent });
    const rmBtn = <HighlightOffIcon onClick={cb} className={classes.rmBtn} />;

    return (
      <TableRow key={pk.x} className={classes.tRow} hover>
        <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>
          {`(${(pk.x - shift).toFixed(digits)}, ${pk.y.toExponential(2)})`}
        </TableCell>
        <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{rmBtn}</TableCell>
      </TableRow>
    );
  })
);

const refreshBtn = (classes, onRefresh) => (
  <Tooltip
    placement="left"
    title={<span className="txt-sv-tp">Calculate Multiplicity</span>}
  >
    <Button
      className={classes.btnRf}
      onClick={onRefresh}
    >
      <RefreshOutlinedIcon />
    </Button>
  </Tooltip>
);

const mpyList = (
  classes, digits, multiplicitySt,
  clickMpyOneAct, rmMpyPeakByPanelAct, resetMpyOneAct,
) => {
  const { stack, shift, smExtext } = multiplicitySt;
  const rows = stack.map((k, idx) => {
    const {
      peaks, xExtent, mpyType, js,
    } = k;
    const onRefresh = () => resetMpyOneAct(xExtent);
    const onClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      clickMpyOneAct(xExtent);
    };
    return createData(
      idx, xExtent, peaks, shift, smExtext, mpyType, js,
      onClick, onRefresh,
    );
  });

  return (
    <div>
      {rows.map(row => (
        <div className={classes.moCard} key={row.idx}>
          <div className={classes.moCardHead}>
            <div>
              <MUCheckbox
                className={classes.moCBox}
                checked={row.isCheck}
                onChange={row.onClick}
              />
              <span className={classNames(classes.moExtTxt, classes.moExtId, 'txt-sv-panel-head')}>{row.idx}</span>
              <span className={classNames(classes.moExtTxt, 'txt-sv-panel-head')}>{`${(row.center).toFixed(3)}(ppm)`}</span>
              <span className={classNames(classes.moSelect, 'txt-sv-panel-head')}><MpySelect target={row} /></span>
              { refreshBtn(classes, row.onRefresh) }
            </div>
            <MpyCoupling
              row={row}
            />
          </div>
          <Table className={classes.table}>
            <TableBody>
              { pkList(classes, row, shift, digits, rmMpyPeakByPanelAct) }
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

const MultiplicityPanel = ({
  classes, expand, onExapnd,
  layoutSt, multiplicitySt,
  clickMpyOneAct, rmMpyPeakByPanelAct, resetMpyOneAct,
}) => {
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
            Multiplicity
          </span>
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        {
          mpyList(
            classes, digits, multiplicitySt,
            clickMpyOneAct, rmMpyPeakByPanelAct, resetMpyOneAct,
          )
        }
      </div>
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    integrationSt: state.integration,
    multiplicitySt: state.multiplicity,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    clickMpyOneAct: clickMpyOne,
    rmMpyPeakByPanelAct: rmMpyPeakByPanel,
    resetMpyOneAct: resetMpyOne,
  }, dispatch)
);

MultiplicityPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  onExapnd: PropTypes.func.isRequired,
  layoutSt: PropTypes.string.isRequired,
  multiplicitySt: PropTypes.object.isRequired,
  clickMpyOneAct: PropTypes.func.isRequired,
  rmMpyPeakByPanelAct: PropTypes.func.isRequired,
  resetMpyOneAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(MultiplicityPanel));
