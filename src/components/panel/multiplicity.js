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
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

import { selectMpyType, rmMpyPeakByPanel, clickMpyOne } from '../../actions/multiplicity';
import { LIST_LAYOUT } from '../../constants/list_layout';
import MpySelect from './multiplicity_select';
import { calcMpyCenter } from '../../helpers/calc';

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
    height: 'calc(63vh - 118px)',
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
  moChip: {
    borderColor: 'white',
    color: 'white',
    height: 26,
    margin: '0 5px 0 5px',
    width: 26,
  },
  moExtTxt: {
    margin: '0 5px 0 5px',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
  moSelect: {
    margin: '0 5px 0 5px',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
  moCBox: {
    padding: 4,
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

const createData = (idx, xExtent, peaks, shift, smExtext, mpyType, onSelect, onClick) => (
  {
    idx: idx + 1,
    xExtent,
    onSelect,
    onClick,
    peaks,
    center: calcMpyCenter(peaks, shift),
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
        <TableCell align="right" className={classes.tTxt}>
          {`(${(pk.x - shift).toFixed(digits)}, ${pk.y.toExponential(2)})`}
        </TableCell>
        <TableCell align="right" className={classes.tTxt}>{rmBtn}</TableCell>
      </TableRow>
    );
  })
);

const mpyList = (
  classes, digits, layoutSt, integrationSt, multiplicitySt,
  selectMpyTypeAct, clickMpyOneAct, rmMpyPeakByPanelAct,
) => {
  const { stack, shift, smExtext } = multiplicitySt;
  const rows = stack.map((k, idx) => {
    const { peaks, xExtent, mpyType } = k;
    const onSelect = () => selectMpyTypeAct(xExtent);
    const onClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      clickMpyOneAct(xExtent);
    };
    return createData(idx, xExtent, peaks, shift, smExtext, mpyType, onSelect, onClick);
  });

  return (
    <div>
      {rows.map(row => (
        <div className={classes.moCard} key={row.idx}>
          <div className={classes.moCardHead}>
            <MUCheckbox
              className={classes.moCBox}
              checked={row.isCheck}
              onChange={row.onClick}
            />
            <Chip label={row.idx} className={classes.moChip} variant="outlined" />
            <span className={classes.moExtTxt}>{`${(row.center).toFixed(digits)}(ppm)`}</span>
            <span className={classes.moSelect}><MpySelect target={row} /></span>

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
  layoutSt, integrationSt, multiplicitySt,
  selectMpyTypeAct, clickMpyOneAct, rmMpyPeakByPanelAct,
}) => {
  const digits = layoutSt === LIST_LAYOUT.IR ? 0 : 4;

  return (
    <ExpansionPanel
      expanded={expand}
      onChange={onExapnd}
      className={classNames(classes.panel)}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
          <span className={classNames(classes.txtBadge)}>
            Multiplicity
          </span>
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        {
          mpyList(
            classes, digits, layoutSt, integrationSt, multiplicitySt,
            selectMpyTypeAct, clickMpyOneAct, rmMpyPeakByPanelAct,
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
    selectMpyTypeAct: selectMpyType,
    clickMpyOneAct: clickMpyOne,
    rmMpyPeakByPanelAct: rmMpyPeakByPanel,
  }, dispatch)
);

MultiplicityPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  onExapnd: PropTypes.func.isRequired,
  layoutSt: PropTypes.string.isRequired,
  integrationSt: PropTypes.object.isRequired,
  multiplicitySt: PropTypes.object.isRequired,
  selectMpyTypeAct: PropTypes.func.isRequired,
  clickMpyOneAct: PropTypes.func.isRequired,
  rmMpyPeakByPanelAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(MultiplicityPanel));
