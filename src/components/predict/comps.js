import React from 'react';
import classNames from 'classnames';

import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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

  return (
    <span
      className={classNames(classes.txtLabel, extClsName)}
    >
      { `${confidence} %` }
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

const sectionBtn = (classes, molecule, layoutSt, predictSt, predictCb, clearCb) => {
  const hasResult = Object.keys(predictSt).length !== 0;
  const title = hasResult ? 'Clear' : `Predict - ${layoutSt}`;
  const color = hasResult ? 'secondary' : 'primary';
  const onClickCb = hasResult ? clearCb : predictCb;

  return (
    <div className={classNames(classes.title)}>
      <Button
        variant="contained"
        color={color}
        className={classNames(classes.btn, 'txt-btn-save')}
        onClick={onClickCb}
        disabled={!molecule}
      >
        { title }
      </Button>
    </div>
  );
};

export {
  TxtLabel, StatusIcon, ConfidenceLabel, sectionInput, sectionBtn,
};
