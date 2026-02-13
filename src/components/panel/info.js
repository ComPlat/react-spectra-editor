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
  subSectionHeader: {
    backgroundColor: '#eee',
    height: 32,
    lineHeight: '32px',
    paddingLeft: 10,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    borderTop: '1px solid #dcdcdc',
    color: 'rgba(0, 0, 0, 0.87)',
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
  quillContainer: {
    margin: '10px 10px',
    backgroundColor: '#fff',
    '& .ql-container': {
      border: 'none',
    },
    '& .ql-editor': {
      minHeight: '60px',
    },
    '& .ql-editor.ql-blank::before': {
      fontStyle: 'normal',
      color: 'rgba(0, 0, 0, 0.54)',
    },
  },
});

const simTitle = () => (
  'Simulated signals from NMRshiftDB'
);

const simContent = (nmrSimPeaks) => (
  nmrSimPeaks && nmrSimPeaks.sort((a, b) => a - b).join(', ')
);

const normalizeQuillValue = (val) => {
  if (!val) return '';
  if (val === '<p><br></p>' || val === '<p></p>') return '';
  return val;
};

const handleDescriptionChanged = (value, onDescriptionChanged) => {
  onDescriptionChanged(normalizeQuillValue(value));
};

const aucValue = (integration) => {
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
  return values.join(', ');
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
  layoutSt, simulationSt, shiftSt, curveSt, exactMass,
  onExapnd, canChangeDescription, onDescriptionChanged, detectorSt,
  metaSt, updateDSCMetaDataAct,
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
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{ `${parseInt(observeFrequency, 10)} MHz` || ' - ' }</span>
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
          Format.isMsLayout(layoutSt) && exactMass
            ? (
              <div className={classNames(classes.rowRoot, classes.rowOdd)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Exact mass: </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{`${parseFloat(exactMass).toFixed(6)} g/mol`}</span>
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
        {
          !editorOnly && Format.isNmrLayout(layoutSt)
            ? (
              <>
                <div className={classes.subSectionHeader}>
                  { simTitle() }
                </div>
                <div className={classNames(classes.rowRoot, classes.rowOddSim)}>
                  <span className={classNames(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt')}>
                    { simContent(simulationSt.nmrSimPeaks) }
                  </span>
                </div>
              </>
            )
            : null
        }
        {
          !Format.isCyclicVoltaLayout(layoutSt)
            ? (
              <>
                <div className={classes.subSectionHeader}>
                  Content
                </div>
                <div className={classes.quillContainer}>
                  <ReactQuill
                    className={classNames(classes.quill, 'card-sv-quill')}
                    value={normalizeQuillValue(descriptions)}
                    placeholder={canChangeDescription ? 'Peaks will be written here...' : undefined}
                    readOnly={!canChangeDescription}
                    modules={{ toolbar: false }}
                    onChange={(value) => handleDescriptionChanged(value, onDescriptionChanged)}
                  />
                </div>
              </>
            ) : null
        }
      </div>
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
  descriptions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  layoutSt: PropTypes.string.isRequired,
  simulationSt: PropTypes.array.isRequired,
  shiftSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
  onExapnd: PropTypes.func.isRequired,
  canChangeDescription: PropTypes.bool.isRequired,
  onDescriptionChanged: PropTypes.func,
  exactMass: PropTypes.string,
  detectorSt: PropTypes.object.isRequired,
  metaSt: PropTypes.object.isRequired,
  updateDSCMetaDataAct: PropTypes.func.isRequired,
};

export default connect( // eslint-disable-line
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(InfoPanel)); // eslint-disable-line
