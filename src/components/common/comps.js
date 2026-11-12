import React from 'react';
import classNames from 'classnames';

function TabLabel(classes, label, extClsName = 'txt-tab-label') {
  const { tabLabel } = classes;
  return (
    <span
      className={classNames(tabLabel, extClsName)}
    >
      { label }
    </span>
  );
}

export {
  TabLabel, // eslint-disable-line
};
