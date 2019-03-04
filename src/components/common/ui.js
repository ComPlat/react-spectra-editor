import React from 'react';
import classNames from 'classnames';

const TabLabel = (classes, label, extClsName = 'txt-tab-label') => (
  <span
    className={classNames(classes.tabLabel, extClsName)}
  >
    { label }
  </span>
);

export { TabLabel }; // eslint-disable-line
