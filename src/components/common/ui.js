import React from 'react';
import classNames from 'classnames';

import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import HelpOutline from '@material-ui/icons/HelpOutline';

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
      return <CheckCircleOutline style={{ color: '#4caf50' }} />;
    case 'warning':
      return <ErrorOutline style={{ color: '#ffc107' }} />;
    case 'reject':
      return <HighlightOff style={{ color: '#e91e63' }} />;
    default:
      return <HelpOutline style={{ color: '#5d4037' }} />;
  }
};

export { TabLabel, TxtLabel, StatusIcon };
