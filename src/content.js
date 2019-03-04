import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppViewer from './components/app_viewer';
import PredictViewer from './components/predict_viewer';
import { TabLabel } from './components/common/ui';

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

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };

    this.onChange = this.onChange.bind(this);
    this.isHidePredictViewer = this.isHidePredictViewer.bind(this);
  }

  onChange(event, value) {
    this.setState({ value });
  }

  isHidePredictViewer() {
    const { predictObj, layoutSt } = this.props;
    const isEmpty = Object.keys(predictObj).length === 0
      && predictObj.constructor === Object;
    const notTarget = ['1H', '13C'].indexOf(layoutSt) < 0;
    return isEmpty || notTarget;
  }

  render() {
    const {
      classes, input, cLabel, xLabel, yLabel, peakObj, predictObj,
    } = this.props;
    const { value } = this.state;

    const isHidePv = this.isHidePredictViewer();
    if (isHidePv) {
      return (
        <AppViewer
          input={input}
          cLabel={cLabel}
          xLabel={xLabel}
          yLabel={yLabel}
          peakObj={peakObj}
          isHidden={false}
        />
      );
    }

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={value}
            onChange={this.onChange}
          >
            <Tab label={TabLabel(classes, 'Spectrum', 'txt-prd-tab-label')} />
            <Tab label={TabLabel(classes, 'Analysis', 'txt-prd-tab-label')} />
          </Tabs>
        </AppBar>
        {
          <AppViewer
            input={input}
            cLabel={cLabel}
            xLabel={xLabel}
            yLabel={yLabel}
            peakObj={peakObj}
            isHidden={value !== 0}
          />
        }
        {
          value === 1 && (
            <PredictViewer
              peakObj={peakObj}
              predictObj={predictObj}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObj: PropTypes.object.isRequired,
  predictObj: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Content);
