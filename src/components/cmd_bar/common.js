/* eslint-disable no-unused-vars, max-len, indent, react/function-component-definition, react/self-closing-comp, react/prop-types, react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import classNames from 'classnames';

const TOOLBAR_INPUT_H = 28;
const TOOLBAR_CONTROL_H = TOOLBAR_INPUT_H;
const TOOLBAR_LABEL_SLOT = 6;
const TOOLBAR_PAD = 4;
const TOOLBAR_GROUP_GAP = 2;
const TOOLBAR_GROUP_MARGIN_LEFT = 6;
const TOOLBAR_GROUP_PADDING_LEFT = 6;
const TOOLBAR_BTN_MARGIN_X = 1;

const useStyles = makeStyles((theme) => ({
  muiBtn: {
    backgroundColor: '#fff',
    border: '1px solid #d6dce2',
    borderRadius: 6,
    boxShadow: '0 1px 2px rgba(17, 24, 39, 0.06)',
    color: '#25313b',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 20,
    height: TOOLBAR_CONTROL_H,
    lineHeight: '20px',
    minWidth: 30,
    padding: 0,
    textTransform: 'none',
    width: 30,
    '&:hover': {
      backgroundColor: '#f7fafc',
      borderColor: '#aeb8c2',
      boxShadow: '0 2px 5px rgba(17, 24, 39, 0.1)',
    },
    '&.Mui-disabled': {
      backgroundColor: '#f6f7f8',
      borderColor: '#e1e5e8',
      color: '#a8b0b8',
    },
  },
}));

const MuButton = (props) => {
  const classes = useStyles();
  const { className, ...other } = props;
  return (
    <Button className={classNames(classes.muiBtn, className)} {...other} />
  );
};

const TOOLBAR_MENU_MAX_H = 288;

const toolbarSep = {
  backgroundColor: '#e1e5e8',
  bottom: 0,
  content: '""',
  height: TOOLBAR_CONTROL_H,
  left: 0,
  position: 'absolute',
  width: 1,
};

const toolbarSelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: TOOLBAR_MENU_MAX_H,
    },
  },
};

const commonStyle = {
  card: {
    boxSizing: 'border-box',
    margin: '0 4px 5px 4px',
    overflow: 'visible',
    padding: `${TOOLBAR_PAD}px 6px`,
    width: 'calc(100% - 8px)',
    backgroundColor: '#fff',
    '& .MuiFormControl-root, & .MuiTextField-root': {
      flex: '0 0 auto',
      margin: '0 2px 0 0',
      overflow: 'visible',
    },
    '& .MuiInputLabel-root, & .MuiFormLabel-root': {
      overflow: 'visible',
    },
    '& .MuiInputBase-root': {
      backgroundColor: '#fff',
      borderRadius: 6,
      color: '#25313b',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: 12,
    },
    '& .MuiOutlinedInput-root': {
      height: TOOLBAR_INPUT_H,
      transition: 'background-color 120ms ease, box-shadow 120ms ease',
    },
    '& .MuiOutlinedInput-root:hover': {
      backgroundColor: '#f8fafc',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d6dce2',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#aeb8c2',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2196f3',
      borderWidth: 1,
    },
    '& .MuiInputLabel-root': {
      backgroundColor: '#fff',
      color: '#66727c',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: 10,
      lineHeight: 1.3,
      padding: '0 4px',
      transform: 'translate(8px, -6px) scale(0.9)',
      zIndex: 1,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1976d2',
      transform: 'translate(8px, -6px) scale(0.9)',
    },
    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
      transform: 'translate(8px, -6px) scale(0.9)',
    },
    '& .MuiSelect-icon': {
      color: '#66727c',
      right: 4,
    },
    '& .MuiInputAdornment-root': {
      color: '#66727c',
    },
    '& .MuiButton-root': {
      flex: '0 0 auto',
      margin: `0 ${TOOLBAR_BTN_MARGIN_X}px`,
    },
  },
  group: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    flex: '0 0 auto',
    gap: TOOLBAR_GROUP_GAP,
    margin: `0 0 0 ${TOOLBAR_GROUP_MARGIN_LEFT}px`,
    overflow: 'visible',
    paddingLeft: TOOLBAR_GROUP_PADDING_LEFT,
    paddingTop: 0,
    position: 'relative',
    '&::before': toolbarSep,
  },
  groupRightMost: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    flex: '0 0 auto',
    gap: TOOLBAR_GROUP_GAP,
    margin: `0 0 0 ${TOOLBAR_GROUP_MARGIN_LEFT}px`,
    overflow: 'visible',
    paddingTop: TOOLBAR_LABEL_SLOT,
  },
  groupRight: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    flex: '0 0 auto',
    gap: TOOLBAR_GROUP_GAP,
    margin: `0 0 0 ${TOOLBAR_GROUP_MARGIN_LEFT}px`,
    overflow: 'visible',
    paddingLeft: TOOLBAR_GROUP_PADDING_LEFT,
    paddingTop: TOOLBAR_LABEL_SLOT,
    position: 'relative',
    '&::before': toolbarSep,
  },
  btnHt: {
    backgroundColor: '#2196f3',
    color: '#fff',
    borderColor: '#1e88d8',
    boxShadow: '0 2px 6px rgba(33, 150, 243, 0.25)',
    '&:hover': {
      backgroundColor: '#1976d2',
      borderColor: '#1976d2',
    },
  },
  iconWp: {
    border: '1px dashed #aeb8c2',
    borderRadius: 6,
  },
  icon: {
    fontSize: 20,
  },
  iconMdi: {
    fontSize: 20,
  },
  txt: {
    color: '#25313b',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  txtLabel: {
    color: '#25313b',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 12,
  },
  txtInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    color: '#25313b',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 12,
    height: TOOLBAR_INPUT_H,
    paddingRight: 4,
    '& input': {
      padding: '5px 4px 5px 8px',
    },
  },
  txtOpt: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 12,
  },
  selectLabel: {
    backgroundColor: '#fff',
    color: '#66727c',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 10,
    lineHeight: 1.3,
    padding: '0 4px',
    transform: 'translate(8px, -6px) scale(0.9)',
    zIndex: 1,
  },
  selectInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    color: '#25313b',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 12,
    height: TOOLBAR_INPUT_H,
    minHeight: TOOLBAR_INPUT_H,
    '& .MuiSelect-select': {
      alignItems: 'center',
      display: 'block',
      lineHeight: '20px',
      minHeight: '0 !important',
      overflow: 'hidden',
      padding: '4px 30px 4px 8px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  txtLabelBottomInput: {
    position: 'absolute',
    left: 8,
    top: 0,
    fontFamily: 'Helvetica, Arial, sans-serif',
    backgroundColor: '#fff',
    color: '#66727c',
    fontSize: 10,
    lineHeight: 1,
    margin: 0,
    padding: '0 4px',
    pointerEvents: 'none',
    transform: 'scale(0.9)',
    transformOrigin: 'top left',
    zIndex: 1,
  },
  txtLabelTopInput: {
    position: 'absolute',
    left: 8,
    top: -6,
    fontFamily: 'Helvetica, Arial, sans-serif',
    backgroundColor: '#fff',
    color: '#66727c',
    fontSize: 10,
    lineHeight: 1,
    margin: 0,
    padding: '0 4px',
    pointerEvents: 'none',
    transform: 'scale(0.9)',
    transformOrigin: 'top left',
    zIndex: 1,
  },
};

const focusStyle = (criteria, cls) => (criteria ? [cls.btnHt] : []);

export {
  MuButton,
  commonStyle,
  focusStyle,
  toolbarSelectMenuProps,
  TOOLBAR_CONTROL_H,
  TOOLBAR_INPUT_H,
  TOOLBAR_LABEL_SLOT,
  TOOLBAR_PAD,
  TOOLBAR_GROUP_GAP,
  TOOLBAR_GROUP_MARGIN_LEFT,
  TOOLBAR_GROUP_PADDING_LEFT,
  TOOLBAR_BTN_MARGIN_X,
} // eslint-disable-line
