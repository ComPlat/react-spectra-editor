/* eslint-disable react/function-component-definition, react/destructuring-assignment,
max-len, react/prop-types */
import React from 'react';
import classNames from 'classnames';
import SvgFileZoomPan from '@complat/react-svg-file-zoom-pan';

import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import HighlightOff from '@mui/icons-material/HighlightOff';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Help from '@mui/icons-material/Help';
import {
  Tooltip, TextField, CircularProgress,
} from '@mui/material';
import CloudOff from '@mui/icons-material/CloudOff';

import SectionLoading from './section_loading';

const TxtLabel = (classes, label, extClsName = 'txt-label') => (
  <span
    className={classNames(classes.txtLabel, extClsName)}
  >
    { label }
  </span>
);

const statusBadgeClass = (classes, status) => {
  switch (status) {
    case 'accept':
      return classes.statusAccept;
    case 'warning':
      return classes.statusWarning;
    case 'reject':
      return classes.statusReject;
    case 'missing':
      return classes.statusMissing;
    case 'unknown':
      return classes.statusUnknown;
    default:
      return classes.statusUnknown;
  }
};

const StatusIcon = (classes, status) => {
  const badgeCls = classNames(classes.statusBadge, statusBadgeClass(classes, status));

  switch (status) {
    case 'accept':
      return (
        <Tooltip title={<span className="txt-sv-tp">Accept</span>} placement="left">
          <span className={badgeCls}>
            <CheckCircleOutline style={{ color: '#4caf50', fontSize: 18 }} />
          </span>
        </Tooltip>
      );
    case 'warning':
      return (
        <Tooltip title={<span className="txt-sv-tp">Warning</span>} placement="left">
          <span className={badgeCls}>
            <ErrorOutline style={{ color: '#ffc107', fontSize: 18 }} />
          </span>
        </Tooltip>
      );
    case 'reject':
      return (
        <Tooltip title={<span className="txt-sv-tp">Reject</span>} placement="left">
          <span className={badgeCls}>
            <HighlightOff style={{ color: '#e91e63', fontSize: 18 }} />
          </span>
        </Tooltip>
      );
    case 'missing':
      return (
        <Tooltip title={<span className="txt-sv-tp">Missing</span>} placement="left">
          <span className={badgeCls}>
            <HelpOutline style={{ color: '#795548', fontSize: 18 }} />
          </span>
        </Tooltip>
      );
    case 'unknown':
      return (
        <Tooltip title={<span className="txt-sv-tp">Not Support</span>} placement="left">
          <span className={badgeCls}>
            <Help style={{ color: '#66727c', fontSize: 18 }} />
          </span>
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
    <div className={classNames(classes.inputSection)}>
      <div className={classes.sectionHeader}>Molfile</div>
      <TextField
        fullWidth
        className={classes.molField}
        margin="dense"
        multiline
        onChange={inputFuncCb}
        placeholder="Paste or edit molfile..."
        rows={3}
        variant="outlined"
        value={molecule}
      />
    </div>
  );
};

const SectionRunning = ({ classes }) => (
  <div className={classes.messageBox}>
    <CircularProgress size={40} style={{ color: '#2196f3' }} />
    <p className={classes.messageText}>The server is making predictions...</p>
  </div>
);

const SectionMissMatch = ({ classes }) => (
  <div className={classes.messageBox}>
    <ErrorOutline style={{ color: '#e91e63', fontSize: 40 }} />
    <p className={classes.messageText}>Peak &amp; element count mismatch!</p>
    <p className={classes.messageSubText}>
      <sup>1</sup>
      H multiplicity count should not be more than the proton group count.
      Multiplicity must be assigned manually before predictions.
    </p>
    <p className={classes.messageSubText}>
      <sup>13</sup>
      C peak count should not be more than the carbon count,
      and solvent peaks should be excluded.
    </p>
  </div>
);

const SectionNoService = ({ classes }) => (
  <div className={classes.messageBox}>
    <CloudOff style={{ color: '#e91e63', fontSize: 40 }} />
    <p className={classes.messageText}>Service is not available.</p>
    <p className={classes.messageSubText}>Please try again later.</p>
  </div>
);

const SectionUnknown = ({ classes }) => (
  <div className={classes.messageBox}>
    <HelpOutline style={{ color: '#66727c', fontSize: 40 }} />
    <p className={classes.messageText}>Unknown state.</p>
  </div>
);

const notToRenderAnalysis = (pds, classes) => {
  if (pds.running) return <SectionRunning classes={classes} />;
  if (!pds.outline || !pds.outline.code) return <div />;

  if (pds.outline.code >= 500) return <SectionNoService classes={classes} />;
  if (pds.outline.code === 400) return <SectionMissMatch classes={classes} />;
  if (pds.outline.code >= 300) return <SectionUnknown classes={classes} />;
  return false;
};

const sectionSvg = (classes, predictions) => {
  const renderMsg = notToRenderAnalysis(predictions, classes);
  if (renderMsg) return null;

  if (!predictions.output) return null;
  const targetSvg = predictions.output.result[0].svgs[0];
  if (!targetSvg) return <SectionLoading classes={classes} />;
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
