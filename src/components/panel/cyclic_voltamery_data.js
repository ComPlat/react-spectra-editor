import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import InfoIcon from '@material-ui/icons/Info';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelSummary, Table, TableHead, TableBody, TableCell, TableRow } from "@material-ui/core";
import { addNewCylicVoltaPairPeak, setWorkWithMaxPeak, selectPairPeak, removeCylicVoltaPairPeak } from "../../actions/cyclic_voltammetry";
import { setUiSweepType } from '../../actions/ui';
import { LIST_UI_SWEEP_TYPE } from "../../constants/list_ui";
import { GetCyclicVoltaRatio, GetCyclicVoltaPeakSeparate } from "../../helpers/chem";

const styles = () => ({
  panel: {
    backgroundColor: '#eee',
    display: 'table-row',
  },
  panelSummary: {
    backgroundColor: '#eee',
    height: 32,
  },
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)', // ROI
    overflow: 'auto',
  },
  table: {
    width: '100%',
    wordWrap: 'break-all',
    fontSize: '14px !important',
  },
  td: {
    wordWrap: 'break-all',
    fontSize: '14px !important',
  },
  cellSelected: {
    backgroundColor: '#2196f3',
    color: '#fff',
    fontSize: '14px !important',
  },
  btnRemove: {
    color: 'red'
  },
  tTxt: {
    padding: 10,
  },
  infoIcon: {
    width: '15px',
    height: '16px'
  },
  txtToolTip: {
    lineHeight: 'normal !important',
    fontSize: '14px !important'
  },
  rowRoot: {
    border: '1px solid #eee',
    height: 36,
    lineHeight: '36px',
    overflow: 'hidden',
    paddingLeft: 24,
    textAlign: 'left',
  },
  rowOdd: {
    backgroundColor: '#fff',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowEven: {
    backgroundColor: '#fafafa',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});


const CyclicVoltammetryPanel = ({
  classes, cyclicVotaSt, feature,
  addNewPairPeakAct, setWorkWithMaxPeakAct, selectPairPeakAct, removePairPeakAct,
  sweepTypeSt, setUiSweepTypeAct, jcampIdx, userManualLink
}) => {
  const { spectraList } = cyclicVotaSt;
  const spectra = spectraList[jcampIdx];
  let list = [];
  if (spectra !== undefined) {
    list = spectra.list;
  }

  const selectCell = (idx, isMax) => {
    setWorkWithMaxPeakAct({isMax, jcampIdx});
    selectPairPeakAct({index: idx, jcampIdx: jcampIdx});
    if (sweepTypeSt === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK || sweepTypeSt === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK) {
      if (isMax) {
        setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK, jcampIdx);
      }
      else {
        setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK, jcampIdx);
      }
    }
    else if (sweepTypeSt === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK || sweepTypeSt === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK) {
      if (isMax) {
        setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK, jcampIdx);
      }
      else {
        setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK, jcampIdx);
      }
    }
  };

  const getDelta = (data) => {
    return (data.max && data.min) ? GetCyclicVoltaPeakSeparate(data.max.x, data.min.x) : "undefined";
  };

  const getRatio = (feature, data) => {
    const featureData = feature.data[0];
    const idx = featureData.x.indexOf(feature.maxX);
    const y_pecker = data.pecker ? data.pecker.y : featureData.y[idx];
    return (data.max && data.min) ? GetCyclicVoltaRatio(data.max.y, data.min.y, y_pecker).toFixed(8) : "undefined";
  };

  const rows = list.map((o, idx) => (
    {
      idx,
      max: o.max ? `x:${parseFloat(o.max.x)}, y:${parseFloat(o.max.y).toExponential(2)}` : "undefined",
      min: o.min ? `x:${parseFloat(o.min.x)}, y:${parseFloat(o.min.y).toExponential(2)}` : "undefined",
      pecker: o.pecker ? `${parseFloat(o.pecker.y).toExponential(2)}` : "undefined",
      delta: getDelta(o),
      ratio: getRatio(feature, o),
      onClickMax: () => selectCell(idx, true),
      onClickMin: () => selectCell(idx, false),
      remove: () => removePairPeakAct({index: idx, jcampIdx: jcampIdx}),
    }
  ));

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
        <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
          Voltammetry data
        </span>
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              Max
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              Min
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              I λ0
              <Tooltip 
                title={
                  <p className={classNames(classes.txtToolTip)}>
                    Baseline correction value for I ratio <br/>
                    (a.k.a y value of pecker)
                  </p>
                }
              >
                <InfoIcon className={classNames(classes.infoIcon)} />
              </Tooltip>
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              I ratio
              <Tooltip 
                title={
                  <div className={classNames(classes.txtToolTip)}>
                    <p>Nicholson's method</p>
                    <i>NICHOLSON, Rl S. Semiempirical Procedure for Measuring with Stationary Electrode Polarography Rates of Chemical Reactions Involving the Product of Electron Transfer. Analytical Chemistry, 1966, 38. Jg., Nr. 10, S. 1406-1406.
https://doi.org/10.1021/ac60242a030</i>
                  </div>
                }
              >
                <InfoIcon className={classNames(classes.infoIcon)} />
              </Tooltip>
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              DeltaEp
              <Tooltip 
                title={
                  <span className={classNames(classes.txtToolTip)}>
                    | Epa - Epc |
                  </span>
                }
              >
                <InfoIcon className={classNames(classes.infoIcon)} />
              </Tooltip>
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              <AddCircleOutlineIcon onClick={() => addNewPairPeakAct(jcampIdx)} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          rows.map(row => (
            <TableRow key={row.idx}>
              <TableCell
                align="left"
                className={
                  classNames(classes.tTxt, classes.square,
                  (spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt' ))
                }
                onClick={row.onClickMax}
              >
                { row.max }
              </TableCell>
              <TableCell
                align="left"
                className={
                  classNames(classes.tTxt, classes.square,
                  (!spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt' ))
                }
                onClick={row.onClickMin}
              >
                { row.min }
              </TableCell>
              <TableCell
                align="left"
                className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
              >
                { row.pecker }
              </TableCell>
              <TableCell
                align="left"
                className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
              >
                { row.ratio }
              </TableCell>
              <TableCell
                align="left"
                className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
              >
                { row.delta }
              </TableCell>
              <TableCell
                align="left"
                className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
              >
                <RemoveCircleIcon className={classNames(classes.btnRemove)} onClick={row.remove}/>
              </TableCell>
            </TableRow>
          ))
        }
        </TableBody>
      </Table>

      <div className={classNames(classes.rowRoot, classes.rowEven)}>
        <Tooltip 
          title={
            <span className={classNames(classes.txtToolTip)}>
              Click here to open the User manual document
            </span>
          }
        >
          <span>
            <a target="_blank" rel="noopener noreferrer" href={ userManualLink }>How-To</a>
            <HelpIcon className={classNames(classes.infoIcon)}/>
          </span>
        </Tooltip>
      </div>
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    cyclicVotaSt: state.cyclicvolta,
    sweepTypeSt: state.ui.sweepType,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addNewPairPeakAct: addNewCylicVoltaPairPeak,
    setWorkWithMaxPeakAct: setWorkWithMaxPeak,
    selectPairPeakAct: selectPairPeak,
    removePairPeakAct: removeCylicVoltaPairPeak,
    setUiSweepTypeAct: setUiSweepType,
  }, dispatch)
);

CyclicVoltammetryPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  feature: PropTypes.object.isRequired,
  molSvg: PropTypes.string.isRequired,
  layoutSt: PropTypes.string.isRequired,
  onExapnd: PropTypes.func.isRequired,
  cyclicVotaSt: PropTypes.object.isRequired,
  addNewPairPeakAct: PropTypes.func.isRequired,
  setWorkWithMaxPeakAct: PropTypes.func.isRequired,
  selectPairPeakAct: PropTypes.func.isRequired,
  removePairPeakAct: PropTypes.func.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
  sweepTypeSt: PropTypes.string.isRequired,
  userManualLink: PropTypes.string,
};

CyclicVoltammetryPanel.defaultProps = {
  jcampIdx: 0,
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(withStyles(styles)(CyclicVoltammetryPanel));
  