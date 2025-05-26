/* eslint-disable no-mixed-operators, react/function-component-definition,
react/require-default-props, max-len */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SvgFileZoomPan from '@complat/react-svg-file-zoom-pan';
import ReactQuill from 'react-quill';

import {
  Accordion, AccordionSummary, Divider, Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { withStyles } from '@mui/styles';

import Format from '../../helpers/format';
import { updateDSCMetaData } from '../../actions/meta';

const styles = () => ({
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
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)', // ROI
    overflow: 'auto',
  },
  table: {
    width: 'auto',
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
  rowOddSim: {
    backgroundColor: '#fff',
    height: 108,
    lineHeight: '24px',
    overflowY: 'hidden',
    overflowWrap: 'word-break',
  },
  tHead: {
    fontWeight: 'bold',
    float: 'left',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
  tTxt: {
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    marginRight: 3,
  },
  quill: {
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    textAlign: 'left',
  },
});

const simTitle = () => (
  'Simulated signals from NMRshiftDB'
);

const simContent = (nmrSimPeaks) => (
  nmrSimPeaks && nmrSimPeaks.sort((a, b) => a - b).join(', ')
);

const aucValue = (integration, hplcMsSt) => {
  if (!integration) {
    return '';
  }
  const values = [];
  const stackIntegration = integration.stack;
  if (Array.isArray(stackIntegration)) {
    let sumVal = 0.0;
    stackIntegration.forEach((inte) => {
      if (inte.absoluteArea) {
        sumVal += inte.absoluteArea;
      }
    });
    sumVal = sumVal.toFixed(2);
    stackIntegration.forEach((inte) => {
      if (inte.absoluteArea) {
        const areaVal = inte.absoluteArea.toFixed(2);
        const percent = (areaVal * 100 / sumVal).toFixed(2);
        const valStr = areaVal + " (" + percent + "%)"; // eslint-disable-line
        values.push(valStr);
      }
    });
  }

  const spectraList = hplcMsSt?.uvvis?.spectraList || [];
  const listWaveLength = hplcMsSt?.uvvis?.listWaveLength || [];

  spectraList.forEach((spectrum, idx) => {
    const wavelength = listWaveLength[idx];
    const integrations = spectrum?.integrations || [];

    if (integrations.length > 0) {
      const sumArea = integrations.reduce((sum, integ) => sum + (integ.area || 0), 0);

      const integrationStrings = integrations.map((integ) => {
        const areaVal = integ.area?.toFixed(2) ?? '0.00';
        const percent = sumArea > 0 ? ((integ.area * 100) / sumArea).toFixed(2) : '0.00';
        return `${areaVal} (${percent}%)`;
      });

      values.push(`[${wavelength} nm]: ${integrationStrings.join(', ')}`);
    }
  });

  return values.join('\n');
};

const SECData = ({
  classes, layout, detector, secData,
}) => {
  if (Format.isSECLayout(layout) && secData) {
    const {
      d, mn, mp, mw,
    } = secData;
    return (
      <div>
        <div className={classNames(classes.rowRoot, classes.rowOdd)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Detector: </span>
          <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{detector}</span>
        </div>
        <div className={classNames(classes.rowRoot, classes.rowEven)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>D: </span>
          <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{d}</span>
        </div>
        <div className={classNames(classes.rowRoot, classes.rowOdd)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>MN: </span>
          <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{mn}</span>
        </div>
        <div className={classNames(classes.rowRoot, classes.rowEven)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>MP: </span>
          <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{mp}</span>
        </div>
        <div className={classNames(classes.rowRoot, classes.rowOdd)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>MW: </span>
          <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{mw}</span>
        </div>
      </div>
    );
  }
  return null;
};

SECData.propTypes = {
  classes: PropTypes.object.isRequired,
  layout: PropTypes.string.isRequired,
  detector: PropTypes.object.isRequired,
  secData: PropTypes.object.isRequired,
};

const DSCData = ({
  classes, layout, dscMetaData, updateAction,
}) => {
  if (Format.isDSCLayout(layout) && dscMetaData !== undefined) {
    const {
      meltingPoint, tg,
    } = dscMetaData;

    const onChange = (e) => {
      const { name, value } = e.target;
      const dataToUpdate = { meltingPoint, tg };
      dataToUpdate[name] = value;
      updateAction(dataToUpdate);
    };

    return (
      <div>
        <div className={classNames(classes.rowRoot, classes.rowOdd)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Melting Point: </span>
          <input type="text" name="meltingPoint" className={classNames(classes.tTxt, 'txt-sv-panel-txt')} value={meltingPoint} onChange={onChange} />
        </div>
        <div className={classNames(classes.rowRoot, classes.rowEven)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>TG: </span>
          <input type="text" name="tg" className={classNames(classes.tTxt, 'txt-sv-panel-txt')} value={tg} onChange={onChange} />
        </div>
      </div>
    );
  }
  return null;
};

DSCData.propTypes = {
  classes: PropTypes.object.isRequired,
  layout: PropTypes.string.isRequired,
  dscMetaData: PropTypes.object.isRequired,
  updateAction: PropTypes.func.isRequired,
};

const InfoPanel = ({
  classes, expand, feature, integration, editorOnly, molSvg, descriptions,
  layoutSt, simulationSt, shiftSt, curveSt, theoryMass,
  onExapnd, canChangeDescription, onDescriptionChanged, detectorSt,
  metaSt, updateDSCMetaDataAct, hplcMsSt,
}) => {
  if (!feature) return null;
  const {
    title, observeFrequency, solventName, secData,
  } = feature;
  const { dscMetaData } = metaSt;
  const { curveIdx } = curveSt;
  const { curves } = detectorSt;

  const getSelectedDetectorForCurve = (_detectorSt, targetCurveIdx) => {
    const targetCurve = curves.find((curve) => curve.curveIdx === targetCurveIdx);

    return targetCurve ? targetCurve.selectedDetector.name : '';
  };

  let selectedDetector = getSelectedDetectorForCurve(detectorSt, curveIdx);

  // default detector from jcamp
  if (!selectedDetector && feature.detector) {
    selectedDetector = feature.detector;
  }

  const { shifts } = shiftSt;
  const selectedShift = shifts[curveIdx];
  let showSolvName = solventName;
  if (selectedShift !== undefined) {
    const shiftName = selectedShift.ref.name;
    showSolvName = shiftName === '- - -' ? solventName : shiftName;
  }

  let originStack = null;
  if (integration) {
    originStack = integration.originStack;  // eslint-disable-line
  }

  return (
    <Accordion
      data-testid="PanelInfo"
      expanded={expand}
      onChange={onExapnd}
      className={classNames(classes.panel)}
      TransitionProps={{ unmountOnExit: true }} // increase Accordion performance
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
          <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
            Info
          </span>
        </Typography>
      </AccordionSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        <div className={classNames(classes.rowRoot, classes.rowOdd)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Title : </span>
          <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{ title }</span>
        </div>
        {
          Format.isNmrLayout(layoutSt)
            ? (
              <div className={classNames(classes.rowRoot, classes.rowEven)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Freq : </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{ `${parseInt(observeFrequency, 10)} Hz` || ' - ' }</span>
              </div>
            )
            : null
        }
        {
          Format.isNmrLayout(layoutSt)
            ? (
              <div className={classNames(classes.rowRoot, classes.rowOdd)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Solv : </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{showSolvName}</span>
              </div>
            )
            : null
        }
        {
          Format.isMsLayout(layoutSt) && theoryMass
            ? (
              <div className={classNames(classes.rowRoot, classes.rowOdd)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Theoretical mass: </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{`${parseFloat(theoryMass).toFixed(6)} g/mol`}</span>
              </div>
            )
            : null
        }
        <SECData classes={classes} layout={layoutSt} detector={selectedDetector} secData={secData} />
        {
          !molSvg
            ? null
            : (
              <SvgFileZoomPan
                svg={molSvg}
                duration={300}
                resize
              />
            )
        }
        {
          (Format.isHplcUvVisLayout(layoutSt)) ? (
            <div className={classNames(classes.rowRoot, classes.rowOddSim)}>
              <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>
                Area under curve (AUC):
              </span>
              <br />
              <span className={classNames(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt')}>
                {aucValue(integration)}
              </span>
            </div>
          ) : null
        }
        <DSCData classes={classes} layout={layoutSt} dscMetaData={dscMetaData} updateAction={updateDSCMetaDataAct} />
      </div>
      {/* <ReactQuill
        className={classNames(classes.quill, 'card-sv-quill')}
        value={descriptions}
        modules={{ toolbar: false }}
        readOnly
      /> */}
      {
        !Format.isCyclicVoltaLayout(layoutSt)
          ? (
            <ReactQuill
              className={classNames(classes.quill, 'card-sv-quill')}
              value={descriptions}
              modules={{ toolbar: false }}
              onChange={onDescriptionChanged}
              readOnly={canChangeDescription !== undefined ? !canChangeDescription : true}
            />
          ) : null
      }
      <div>
        {
            !editorOnly && Format.isNmrLayout(layoutSt)
              ? (
                <div className={classNames(classes.rowRoot, classes.rowOddSim)}>
                  <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>
                    { simTitle() }
                    :
                  </span>
                  <br />
                  <span className={classNames(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt')}>
                    { simContent(simulationSt.nmrSimPeaks) }
                  </span>
                </div>
              )
              : null
          }
      </div>
      {
        Format.isLCMsLayout(layoutSt) ? (
          <div className={classNames(classes.rowRoot, classes.rowOddSim)}>
            <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>
              Area under curve (AUC):
            </span>
            <br />
            <div
              className={classNames(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt')}
              style={{
                maxHeight: '80px',
                overflowY: 'auto',
                overflowX: 'hidden',
                wordBreak: 'break-word',
                marginBottom: '100px',
              }}
            >
              {aucValue(integration, hplcMsSt)
                .split('\n')
                .map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
            </div>
          </div>
        ) : null
      }
    </Accordion>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    simulationSt: state.simulation,
    shiftSt: state.shift,
    curveSt: state.curve,
    detectorSt: state.detector,
    metaSt: state.meta,
    hplcMsSt: state.hplcMs,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    updateDSCMetaDataAct: updateDSCMetaData,
  }, dispatch)
);

InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  feature: PropTypes.object.isRequired,
  integration: PropTypes.object.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  molSvg: PropTypes.string.isRequired,
  descriptions: PropTypes.array.isRequired,
  layoutSt: PropTypes.string.isRequired,
  simulationSt: PropTypes.array.isRequired,
  shiftSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
  onExapnd: PropTypes.func.isRequired,
  canChangeDescription: PropTypes.bool.isRequired,
  onDescriptionChanged: PropTypes.func,
  theoryMass: PropTypes.string,
  detectorSt: PropTypes.object.isRequired,
  metaSt: PropTypes.object.isRequired,
  updateDSCMetaDataAct: PropTypes.func.isRequired,
  hplcMsSt: PropTypes.object.isRequired,
};

export default connect( // eslint-disable-line
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(InfoPanel)); // eslint-disable-line
