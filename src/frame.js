import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
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
  btnWrite: {
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

const txtBtnSave = () => (
  <span className="txt-btn-save">
    Save to file
  </span>
);

const txtBtnWrite = () => (
  <span className="txt-btn-write">
    Write Peaks
  </span>
);

const onWriteClick = (write, peakObj) => {
  if (!peakObj.data) return null;
  const data = peakObj.data[0];
  const { length } = data.x;
  let i;
  let peaks = '';
  for (i = 0; i < length; i += 1) {
    const valX = Math.round(parseFloat(data.x[i]) * 10) / 10;
    const valY = (Math.round(parseFloat(data.y[i]) * 10) / 10).toExponential(1);
    peaks += `${valX}, ${valY}; `;
  }
  return () => write(peaks);
};

const btnWrite = (writePeaks, peakObj, classes) => (
  !writePeaks
    ? null
    : (
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classNames(classes.btnWrite)}
          onClick={onWriteClick(writePeaks, peakObj)}
        >
          {txtBtnWrite()}
          <EditIcon className={classes.icon} />
        </Button>
      </div>
    )
);

const Frame = ({
  input, cLabel, xLabel, yLabel, peakObj, writePeaks, classes,
}) => (
  <div className="react-spectrum-viewer">
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
        { btnWrite(writePeaks, peakObj, classes) }
        <div>
          <Button
            variant="contained"
            color="primary"
            className={classNames(classes.btnSave)}
          >
            {txtBtnSave()}
            <SaveIcon className={classes.icon} />
          </Button>
        </div>
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
  writePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(Styles)(Frame);
