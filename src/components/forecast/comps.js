import React from 'react';
import classNames from 'classnames';
import SvgFileZoomPan from '@complat/react-svg-file-zoom-pan';

import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CloudOff from '@material-ui/icons/CloudOff';
import CircularProgress from '@material-ui/core/CircularProgress';

import SectionLoading from './section_loading';

const titleStyle = {
  backgroundColor: '#f5f5f5',
  border: '2px solid #e3e3e3',
  borderRadius: '10px',
  lineHeight: '200px',
  marginBottom: 10,
  marginTop: 10,
  marginLeft: 40,
  textAlign: 'center',
  width: '70%',
};

const txtStyle = {
  lineHeight: '20px',
};

const TxtLabel = (classes, label, extClsName = 'txt-label') => (
  <span
    className={classNames(classes.txtLabel, extClsName)}
  >
    { label }
  </span>
);

const StatusIcon = (status) => {
  switch (status) {
    case 'accept':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Accept</span>}
          placement="left"
        >
          <CheckCircleOutline style={{ color: '#4caf50' }} />
        </Tooltip>
      );
    case 'warning':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Warning</span>}
          placement="left"
        >
          <ErrorOutline style={{ color: '#ffc107' }} />
        </Tooltip>
      );
    case 'reject':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Reject</span>}
          placement="left"
        >
          <HighlightOff style={{ color: '#e91e63' }} />
        </Tooltip>
      );
    case 'missing':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Missing</span>}
          placement="left"
        >
          <HelpOutline style={{ color: '#5d4037' }} />
        </Tooltip>
      );
    case 'unknown':
      return (
        <Tooltip
          title={<span className="txt-sv-tp">Not Support</span>}
          placement="left"
        >
          <Help style={{ color: '#5d4037' }} />
        </Tooltip>
      );
    default:
      return null;
  }
};

const ConfidenceLabel = (classes, confidence, extClsName = 'txt-label') => {
  if (!confidence) return <span> - - </span>;
  const confidenceDp = parseFloat(
    Math.round(confidence * 100) / 100,
  ).toFixed(2);

  return (
    <span
      className={classNames(classes.txtLabel, extClsName)}
    >
      { `${confidenceDp} %` }
    </span>
  );
};

const sectionInput = (classes, molecule, inputFuncCb) => {
  if (!inputFuncCb) return null;

  return (
    <div
      className={classNames(classes.inputRoot)}
    >
      <Grid container>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={TxtLabel(classes, 'Molfile', 'txt-mol-label')}
            margin="normal"
            multiline
            onChange={inputFuncCb}
            rows="2"
            variant="outlined"
            value={molecule}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const SectionRunning = () => (
  <div style={titleStyle}>
    <h2 style={txtStyle}>
      <CircularProgress style={{ color: 'blue', fontSize: 50 }} />
      <br />
      <br />
      <p>The server is making predictions...</p>
    </h2>
  </div>
);

const SectionMissMatch = () => (
  <div style={titleStyle}>
    <h2 style={txtStyle}>
      <ErrorOutline style={{ color: 'red', fontSize: 50 }} />
      <p className="txt-predict-fail">Peak & Element count mismatch!</p>
      <p className="txt-predict-fail">
        <sup>1</sup>
        H multiplicity count should not be more than the proton group count. Multiplicity must be assigned manulally before predictions.
      </p>
      <p className="txt-predict-fail">
        <sup>13</sup>
        C peak count should not be more than the carbon count, and solvent peaks should be excluded.
      </p>
    </h2>
  </div>
);

const SectionNoService = () => (
  <div style={titleStyle}>
    <h2 style={txtStyle}>
      <CloudOff style={{ color: 'red', fontSize: 50 }} />
      <p>Service is not available.</p>
      <p>Please try it again later.</p>
    </h2>
  </div>
);

const SectionUnknown = () => (
  <div style={titleStyle}>
    <h2 style={txtStyle}>
      <HelpOutline style={{ color: 'purple', fontSize: 50 }} />
      <p>Unknown state.</p>
    </h2>
  </div>
);

const notToRenderAnalysis = (pds) => {
  if (pds.running) return <SectionRunning />;
  if (!pds.outline || !pds.outline.code) return <div />;

  if (pds.outline.code >= 500) return <SectionNoService />;
  if (pds.outline.code === 400) return <SectionMissMatch />;
  if (pds.outline.code >= 300) return <SectionUnknown />;
  return false;
};

const sectionSvg = (classes, predictions) => {
  const renderMsg = notToRenderAnalysis(predictions);
  if (renderMsg) return null;

  if (!predictions.output) return null;
  const targetSvg = predictions.output.result[0].svgs[0];
  if (!targetSvg) return <SectionLoading />;
  return (
    <SvgFileZoomPan
      svg={targetSvg}
      duration={300}
      resize
    />
  );
};

export {
  TxtLabel, StatusIcon, ConfidenceLabel,
  sectionInput, notToRenderAnalysis,
  sectionSvg,
};
