import React from 'react';
import classNames from 'classnames';

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

export { TabLabel, TxtLabel };
