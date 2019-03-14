import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ViewerLine from './viewer_line';
import NmrViewer from './predict/nmr_viewer';
import IrViewer from './predict/ir_viewer';
import { TabLabel } from './common/ui';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#fff',
    boxShadow: 'none',
  },
  tabLabel: {
    fontSize: '14px',
  },
});

class PredictViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabNum: 0,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event, tabNum) {
    this.setState({ tabNum });
  }

  render() {
    const {
      classes, input, cLabel, xLabel, yLabel, peakObj, predictObj,
      isNmr, isIr,
    } = this.props;
    const { tabNum } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={tabNum}
            onChange={this.onChange}
          >
            <Tab label={TabLabel(classes, 'Spectrum', 'txt-prd-tab-label')} />
            <Tab label={TabLabel(classes, 'Analysis', 'txt-prd-tab-label')} />
          </Tabs>
        </AppBar>
        {
          <ViewerLine
            input={input}
            cLabel={cLabel}
            xLabel={xLabel}
            yLabel={yLabel}
            peakObj={peakObj}
            isHidden={tabNum !== 0}
          />
        }
        {
          tabNum === 1 && isNmr && (
            <NmrViewer
              peakObj={peakObj}
              predictObj={predictObj}
            />
          )
        }
        {
          tabNum === 1 && isIr && (
            <IrViewer
              peakObj={peakObj}
              predictObj={predictObj}
            />
          )
        }
      </div>
    );
  }
}

PredictViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObj: PropTypes.object.isRequired,
  predictObj: PropTypes.object.isRequired,
  isNmr: PropTypes.bool.isRequired,
  isIr: PropTypes.bool.isRequired,
};

export default compose(
  withStyles(styles),
)(PredictViewer);
