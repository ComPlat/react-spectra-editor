import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { withStyles } from '@material-ui/core/styles';

import Settings from './settings';
import App from './components/app';

const Styles = () => ({
  settingCard: {
    margin: '10px 0 0 0',
  },
  icon: {
    margin: '0 0 0 20px',
  },
  btnSave: {
    margin: '20px 0 0 0',
  },
});

const SpectrumViewer = (input, cLabel, xLabel, yLabel, peakObj) => (
  <App
    input={input}
    cLabel={cLabel}
    xLabel={xLabel}
    yLabel={yLabel}
    peakObj={peakObj}
  />
);

const Frame = ({
  input, cLabel, xLabel, yLabel, peakObj, classes,
}) => (
  <div>
    <Grid container>
      <Grid item xs={9}>
        { SpectrumViewer(input, cLabel, xLabel, yLabel, peakObj) }
      </Grid>
      <Grid
        item
        align="center"
        xs={3}
      >
        <Card className={classNames(classes.settingCard)}>
          <CardContent>
            <Settings peakObj={peakObj} />
          </CardContent>
        </Card>
        <Button
          variant="contained"
          color="primary"
          className={classNames(classes.btnSave)}
        >
          Save to File
          <SaveIcon className={classes.icon} />
        </Button>
      </Grid>
    </Grid>
  </div>
);

Frame.propTypes = {
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObj: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(Styles)(Frame);
