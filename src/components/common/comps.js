import React from 'react';
import classNames from 'classnames';

import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';

const TabLabel = (classes, label, extClsName = 'txt-tab-label') => (
  <span
    className={classNames(classes.tabLabel, extClsName)}
  >
    { label }
  </span>
);

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

export {
  TabLabel, TxtLabel, StatusIcon, ConfidenceLabel,
};
