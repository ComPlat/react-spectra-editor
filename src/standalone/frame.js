/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import withStyles from '@mui/styles/withStyles';
import {
  createTheme, ThemeProvider,
} from '@mui/material/styles';

import Content from './components/content';
import InputMol from './components/input_mol';
import InputFile from './components/input_file';
import InputForm from './components/input_form';
import InputPredJson from './components/input_pred_json';
import Loading from './components/loading';
import Notice from './components/notice';

// A sans-serif system font for the page. ScopedCssBaseline applies it, and MUI's baseline,
// to this page's own subtree only, never to a host page.
const theme = createTheme({
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
});

const styles = () => ({
  page: {
    backgroundColor: '#fff',
    padding: '16px 24px',
  },
  // The inputs and Submit in one row that wraps on narrow windows.
  inputBar: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
  },
  slotWide: {
    flex: '2 1 240px',
    minWidth: 0,
  },
  slotNarrow: {
    flex: '1 1 200px',
    minWidth: 0,
  },
  slotText: {
    color: '#52606d',
    flex: '3 1 320px',
    fontSize: 14,
    lineHeight: 1.5,
    margin: 0,
  },
});

function FullVersion({ classes }) {
  return (
    <div className={classes.inputBar}>
      <div className={classes.slotWide}>
        <InputMol />
      </div>
      <div className={classes.slotWide}>
        <InputFile />
      </div>
      <div className={classes.slotNarrow}>
        <InputPredJson />
      </div>
      <InputForm />
    </div>
  );
}

FullVersion.propTypes = {
  classes: PropTypes.object.isRequired,
};

const editortext = (classes) => (
  <p className={classNames(classes.slotText, 'txt-sv-etext')}>
    Add a spectrum file (*.dx, *.jdx, *.JCAMP, *.zip from Bruker, *.RAW from Thermo Fisher,
    *.mz(X)ML) and click Submit. One 1D spectrum at a time; 2D spectra are not supported.
  </p>
);

function EditorVersion({ classes }) {
  return (
    <div className={classes.inputBar}>
      { editortext(classes) }
      <div className={classes.slotWide}>
        <InputFile />
      </div>
      <InputForm />
    </div>
  );
}

EditorVersion.propTypes = {
  classes: PropTypes.object.isRequired,
};

function Frame({ classes, editorOnly }) {
  return (
    <ThemeProvider theme={theme}>
      <ScopedCssBaseline className={classes.page}>
        {
          editorOnly
            ? <EditorVersion classes={classes} />
            : <FullVersion classes={classes} />
        }
        <Content editorOnly={editorOnly} />
        <Notice />
        <Loading />
      </ScopedCssBaseline>
    </ThemeProvider>
  );
}

Frame.propTypes = {
  classes: PropTypes.object.isRequired,
  editorOnly: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Frame);
