import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import PanelViewer from './components/panel/index';
import Content from './content';

const styles = () => ({
});

const Frame = ({
  input, cLabel, xLabel, yLabel, peakObjs, operations, predictObj,
  managerSt,
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
          <Content
            input={input}
            cLabel={cLabel}
            xLabel={xLabel}
            yLabel={yLabel}
            peakObj={peakObj}
            predictObj={predictObj}
          />
        </Grid>
        <Grid item xs={3} align="center">
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
  predictObj: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  managerSt: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(Frame));
