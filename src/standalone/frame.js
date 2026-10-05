/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Grid from '@mui/material/Grid';
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

const theme = createTheme();

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

const FullVersion = ({ classes, editorOnly }) => (
  <Grid container className={classes.root} spacing={10}>
    <Grid key="grid-drop-space" item xs={1} />
    <Grid key="grid-drop-mol" item xs={4}>
      <InputMol />
    </Grid>
    <Grid key="grid-drop-file" item xs={4}>
      <InputFile editorOnly={editorOnly} />
    </Grid>
    <Grid key="grid-drop-pred-json" item xs={2}>
      <InputPredJson />
    </Grid>
    <Grid key="grid-form-input" item xs={1}>
      <InputForm />
    </Grid>
  </Grid>
);

FullVersion.propTypes = {
  classes: PropTypes.object.isRequired,
  editorOnly: PropTypes.bool.isRequired,
};

const editortext = classes => (
  <span className={classNames(classes.etSpan, 'txt-sv-etext')}>
    (1) Upload a spectrum file to the dashed box on the right.
        Valid formats: *.dx, *.jdx, *.JCAMP, *.fid, *.zip (Bruker), *.RAW (ThermoFisher), *.mz(X)ML.
        A 2D spectrum is NOT available.
        One spectrum only, not several in parallel.
    (2) Click the submit button
  </span>
);

const EditorVersion = ({ classes, editorOnly }) => (
  <Grid container className={classes.root} spacing={24}>
    <Grid key="grid-drop-space" item xs={1} />
    <Grid key="grid-drop-mol" item xs={7}>
      { editortext(classes) }
    </Grid>
    <Grid key="grid-drop-file" item xs={2}>
      <InputFile editorOnly={editorOnly} />
    </Grid>
    <Grid key="grid-form-input" item xs={1}>
      <InputForm />
    </Grid>
    <Grid key="grid-drop-space" item xs={1} />
  </Grid>
);

EditorVersion.propTypes = {
  classes: PropTypes.object.isRequired,
  editorOnly: PropTypes.bool.isRequired,
};

const Frame = ({ classes, editorOnly }) => (
  <ThemeProvider theme={theme}>
    <div>
      {
        editorOnly
          ? <EditorVersion classes={classes} editorOnly={editorOnly} />
          : <FullVersion classes={classes} editorOnly={editorOnly} />
      }
      <Content editorOnly={editorOnly} />
      <Notice />
      <Loading />
    </div>
  </ThemeProvider>
);

Frame.propTypes = {
  classes: PropTypes.object.isRequired,
  editorOnly: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Frame);
