import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import App from './components/app';
import PanelViewer from './components/panel/index';

const Styles = () => ({
  panels: {
    maxHeight: 630,
    overflowX: 'hidden',
    overflowY: 'scroll',
    padding: '10px 0 0 0',
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
  input, cLabel, xLabel, yLabel, peakObjs, operations,
  managerSt, classes,
}) => {
  const [peakAll, peakEdit] = peakObjs;
  const hasEdit = peakEdit && peakEdit.data
    ? peakEdit.data[0].x.length > 0
    : false;

  const peakObj = hasEdit && managerSt.isEdit ? peakEdit : peakAll;

  return (
    <div className="react-spectrum-viewer">
      <Grid container>
        <Grid item xs={9}>
          { SpectrumViewer(input, cLabel, xLabel, yLabel, peakObj) }
        </Grid>
        <Grid
          item
          align="center"
          xs={3}
          className={classNames(classes.panels)}
        >
          <PanelViewer
            peakObj={peakObj}
            hasEdit={hasEdit}
            operations={operations}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak,
    thresSt: state.threshold,
    statusSt: state.status,
    managerSt: state.manager,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

Frame.propTypes = {
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObjs: PropTypes.array.isRequired,
  operations: PropTypes.array.isRequired,
  managerSt: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(Styles)(Frame));
