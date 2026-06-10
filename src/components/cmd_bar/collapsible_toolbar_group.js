/* eslint-disable react/function-component-definition, react/require-default-props,
react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/material/Tooltip';
import { withStyles } from '@mui/styles';

import { MuButton, TOOLBAR_GROUP_GAP } from './common';

const COLLAPSE_THRESHOLD = 4;

const styles = () => ({
  groupItemsShell: {
    display: 'inline-flex',
    overflow: 'hidden',
    transition: 'max-width 260ms ease, opacity 200ms ease',
  },
  groupItemsCollapsed: {
    maxWidth: 0,
    opacity: 0,
  },
  groupItemsExpanded: {
    maxWidth: 720,
    opacity: 1,
  },
  groupItemsTrack: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    flexWrap: 'nowrap',
    gap: TOOLBAR_GROUP_GAP,
    whiteSpace: 'nowrap',
  },
  groupChevron: {
    fontSize: 20,
    transition: 'transform 220ms ease',
  },
  groupChevronExpanded: {
    transform: 'rotate(90deg)',
  },
});

const countItems = (children) => (
  React.Children.toArray(children).filter((child) => child != null && child !== false).length
);

const CollapsibleToolbarGroup = ({
  classes, className, children, collapseThreshold, ...rest
}) => {
  const itemCount = countItems(children);
  const isCollapsible = itemCount > collapseThreshold;
  const [expanded, setExpanded] = useState(false);

  if (!isCollapsible) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <span className={className} {...rest}>
      <Tooltip title={expanded ? 'Replier' : 'Déplier'}>
        <span>
          <MuButton
            className="btn-sv-bar-group-toggle"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            <ChevronRightIcon
              className={classNames(classes.groupChevron, expanded && classes.groupChevronExpanded)}
            />
          </MuButton>
        </span>
      </Tooltip>
      <span
        className={classNames(
          classes.groupItemsShell,
          expanded ? classes.groupItemsExpanded : classes.groupItemsCollapsed,
        )}
      >
        <span className={classes.groupItemsTrack}>
          {children}
        </span>
      </span>
    </span>
  );
};

CollapsibleToolbarGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  collapseThreshold: PropTypes.number,
};

CollapsibleToolbarGroup.defaultProps = {
  collapseThreshold: COLLAPSE_THRESHOLD,
};

export default withStyles(styles)(CollapsibleToolbarGroup);
export { COLLAPSE_THRESHOLD };
