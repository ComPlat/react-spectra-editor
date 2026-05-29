/* eslint-disable react/function-component-definition, react/require-default-props,
react/no-danger, no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@mui/styles';

const normalizeQuillValue = (val) => {
  if (!val) return '';
  if (val === '<p><br></p>' || val === '<p></p>') return '';
  return val;
};

const toQuillHtml = (val) => {
  const normalized = normalizeQuillValue(val);
  if (!normalized) return '';
  if (normalized.includes('<')) return normalized;
  return normalized
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => `<p>${line}</p>`)
    .join('');
};

const resolveElnContent = (desc, descChanged) => {
  const edited = normalizeQuillValue(descChanged);
  if (edited) return edited;
  return toQuillHtml(desc);
};

const styles = () => ({
  root: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    margin: '6px 12px 10px',
    maxWidth: 1180,
  },
  headerRow: {
    alignItems: 'baseline',
    display: 'flex',
    gap: 8,
    marginBottom: 4,
  },
  sectionHeader: {
    color: '#66727c',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  sectionHint: {
    color: '#a8b0b8',
    fontSize: '0.65rem',
  },
  contentBody: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e6e8eb',
    borderRadius: 6,
    maxHeight: 88,
    minHeight: 28,
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '5px 10px',
    scrollbarColor: '#cbd5df transparent',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      height: 4,
      width: 5,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#cbd5df',
      borderRadius: 4,
    },
  },
  contentText: {
    color: '#25313b',
    fontSize: '0.78rem',
    lineHeight: 1.35,
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    '& p': {
      margin: '0 0 2px',
    },
    '& p:last-child': {
      marginBottom: 0,
    },
  },
  placeholder: {
    color: '#a8b0b8',
    fontSize: '0.75rem',
    fontStyle: 'italic',
    lineHeight: 1.35,
  },
});

const StandaloneContentPanel = ({ classes, desc, descChanged }) => {
  const content = resolveElnContent(desc, descChanged);
  const isEmpty = !content;
  const isHtml = content.includes('<');

  return (
    <div className={classes.root}>
      <div className={classes.headerRow}>
        <span className={classes.sectionHeader}>Content</span>
        <span className={classes.sectionHint}>ELN field</span>
      </div>
      <div className={classes.contentBody}>
        {isEmpty ? (
          <span className={classes.placeholder}>
            Write peaks or edit panel content…
          </span>
        ) : isHtml ? (
          <div
            className={classes.contentText}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className={classes.contentText}>{content}</div>
        )}
      </div>
    </div>
  );
};

StandaloneContentPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  desc: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  descChanged: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default withStyles(styles)(StandaloneContentPanel);
export { normalizeQuillValue, resolveElnContent };
