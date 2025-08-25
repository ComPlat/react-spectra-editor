/* eslint-disable function-paren-newline, react/require-default-props,
react/no-unused-prop-types, react/jsx-closing-tag-location, max-len, react/jsx-one-expression-per-line,
react/jsx-indent, react/no-unescaped-entities, react/jsx-wrap-multilines, camelcase, no-shadow,
arrow-body-style, react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import { withStyles } from '@mui/styles';
import {
  Accordion, AccordionSummary, Table, TableHead, TableBody, TableCell, TableRow,
  Tooltip, Divider, Typography, Checkbox,
} from '@mui/material';
import {
  addNewCylicVoltaPairPeak, setWorkWithMaxPeak, selectPairPeak, removeCylicVoltaPairPeak, selectRefPeaks,
} from '../../actions/cyclic_voltammetry';
import { setUiSweepType } from '../../actions/ui';
import { LIST_UI_SWEEP_TYPE } from '../../constants/list_ui';
import { GetCyclicVoltaRatio, GetCyclicVoltaPeakSeparate } from '../../helpers/chem';
import Format from '../../helpers/format';

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
    overflowWrap: 'anywhere',
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
    color: 'red',
  },
  btnAddRow: {
    color: 'green',
  },
  tTxt: {
    padding: 5,
  },
  infoIcon: {
    width: '15px',
    height: '16px',
  },
  txtToolTip: {
    lineHeight: 'normal !important',
    fontSize: '14px !important',
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
  selectRefPeaksAct, sweepTypeSt, setUiSweepTypeAct, jcampIdx, userManualLink,
}) => {
  const { spectraList } = cyclicVotaSt;
  const spectra = spectraList[jcampIdx];
  let list = [];
  if (spectra !== undefined) {
    list = spectra.list;
  }

  const formatCurrent = (y, feature, cyclicVotaSt) => {
    const baseY = feature && feature.yUnit ? String(feature.yUnit) : 'A';
    const isMilli = /mA/i.test(baseY);
    console.log('isMilli', isMilli);
    const useDensity = cyclicVotaSt && cyclicVotaSt.useCurrentDensity;

    const rawArea = (cyclicVotaSt && cyclicVotaSt.areaValue === '' ? 1.0 : cyclicVotaSt?.areaValue) || 1.0;
    const areaUnit = (cyclicVotaSt && cyclicVotaSt.areaUnit) ? cyclicVotaSt.areaUnit : 'cm²';
    const safeArea = rawArea > 0 ? rawArea : 1.0;

    let val = y;
    let unit = isMilli ? 'mA' : 'A';

    if (useDensity) {
      val = y / safeArea;
      unit = `${unit}/${areaUnit}`;
    }

    if (isMilli) {
      val *= 1000.0;
      console.log('val', val);
    }

    return `${parseFloat(val).toExponential(2)} ${unit}`;
  };

  const selectCell = (idx, isMax) => {
    setWorkWithMaxPeakAct({ isMax, jcampIdx });
    selectPairPeakAct({ index: idx, jcampIdx });
    if (sweepTypeSt === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK || sweepTypeSt === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK) {
      if (isMax) {
        setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK, jcampIdx);
      } else {
        setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK, jcampIdx);
      }
    } else if (sweepTypeSt === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK || sweepTypeSt === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK) {
      if (isMax) {
        setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK, jcampIdx);
      } else {
        setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK, jcampIdx);
      }
    }
  };

  const changeCheckRefPeaks = (idx, event) => {
    selectRefPeaksAct({ index: idx, jcampIdx, checked: event.target.checked });
  };

  const getDelta = (data) => {
    return (data.max && data.min) ? Format.strNumberFixedLength(GetCyclicVoltaPeakSeparate(data.max.x, data.min.x) * 1000, 3) : 'nd';
  };

  const getRatio = (feature, data) => {
    const featureData = feature.data[0];
    const idx = featureData.x.indexOf(feature.maxX);
    const y_pecker = data.pecker ? data.pecker.y : featureData.y[idx];
    return (data.max && data.min) ? Format.strNumberFixedLength(GetCyclicVoltaRatio(data.max.y, data.min.y, y_pecker), 3) : 'nd';
  };

  const rows = list.map((o, idx) => (
    {
      idx,
      max: o.max ? `E: ${Format.strNumberFixedLength(parseFloat(o.max.x), 3)} V,\nI: ${formatCurrent(o.max.y, feature, cyclicVotaSt)}` : 'nd',
      min: o.min ? `E: ${Format.strNumberFixedLength(parseFloat(o.min.x), 3)} V,\nI: ${formatCurrent(o.min.y, feature, cyclicVotaSt)}` : 'nd',
      pecker: o.pecker ? `${formatCurrent(o.pecker.y, feature, cyclicVotaSt)}` : 'nd',
      delta: `${getDelta(o)} mV`,
      ratio: getRatio(feature, o),
      e12: (typeof o.e12 === 'number') ? `${Format.strNumberFixedLength(o.e12, 3)} V` : 'nd',
      isRef: o.isRef,
      onClickMax: () => selectCell(idx, true),
      onClickMin: () => selectCell(idx, false),
      remove: () => removePairPeakAct({ index: idx, jcampIdx }),
      onCheckRefChanged: (e) => changeCheckRefPeaks(idx, e),
    }
  ));

  return (
    <Accordion
      data-testid="PanelVoltammetry"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
        <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
          Voltammetry data
        </span>
        </Typography>
      </AccordionSummary>
      <Divider />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              Ref
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              Anodic
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              Cathodic
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              I <sub>λ0</sub>
              <Tooltip
                title={
                  <p className={classNames(classes.txtToolTip)}>
                    Baseline correction value for I ratio <br />
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
              E<sub>1/2</sub>
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              ΔE<sub>p</sub>
              <Tooltip
                title={
                  (
                    <span className={classNames(classes.txtToolTip)}>
                      | Epa - Epc |
                    </span>
                  )
                }
              >
                <InfoIcon className={classNames(classes.infoIcon)} />
              </Tooltip>
            </TableCell>
            <TableCell
              align="left"
              className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
            >
              <AddCircleOutlineIcon onClick={() => addNewPairPeakAct(jcampIdx)} className={classNames(classes.btnAddRow)} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows.map((row) => (
              <TableRow key={row.idx}>
                <TableCell
                  align="left"
                  className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
                >
                  <Checkbox checked={row.isRef} onChange={row.onCheckRefChanged} />
                </TableCell>
                <TableCell
                  align="left"
                  className={
                    classNames(classes.tTxt, classes.square, (spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'))
                  }
                  onClick={row.onClickMax}
                >
                  {
                    row.max.split('\n').map((s, index) => (
                      <React.Fragment key={index}>
                        {s}
                        <br />
                      </React.Fragment>
                    ))
                  }
                </TableCell>
                <TableCell
                  align="left"
                  className={
                    classNames(classes.tTxt, classes.square, (!spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'))
                  }
                  onClick={row.onClickMin}
                >
                  {
                    row.min.split('\n').map((s, index) => (
                      <React.Fragment key={index}>
                        {s}
                        <br />
                      </React.Fragment>
                    ))
                  }
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
                  { row.e12 }
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
                  <RemoveCircleIcon
                    className={classNames(classes.btnRemove)}
                    onClick={row.remove}
                  />
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      <div className={classNames(classes.rowRoot, classes.rowEven)}>
        <Tooltip
          title={
            (
              <span className={classNames(classes.txtToolTip)}>
                Click here to open the User manual document
              </span>
            )
          }
        >
          <span>
            <a target="_blank" rel="noopener noreferrer" href={userManualLink}>How-To </a>
            <HelpIcon className={classNames(classes.infoIcon)} />
          </span>
        </Tooltip>
      </div>
    </Accordion>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    cyclicVotaSt: state.cyclicvolta,
    sweepTypeSt: state.ui.sweepType,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    addNewPairPeakAct: addNewCylicVoltaPairPeak,
    setWorkWithMaxPeakAct: setWorkWithMaxPeak,
    selectPairPeakAct: selectPairPeak,
    removePairPeakAct: removeCylicVoltaPairPeak,
    selectRefPeaksAct: selectRefPeaks,
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
  selectRefPeaksAct: PropTypes.func.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
  sweepTypeSt: PropTypes.string.isRequired,
  userManualLink: PropTypes.string,
  jcampIdx: PropTypes.number,
};

CyclicVoltammetryPanel.defaultProps = {
  jcampIdx: 0,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(CyclicVoltammetryPanel));
