import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppViewer from './components/app_viewer';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#fff',
    boxShadow: 'none',
  },
});

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event, value) {
    this.setState({ value });
  }

  render() {
    const {
      classes, input, cLabel, xLabel, yLabel, peakObj,
    } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={value}
            onChange={this.onChange}
          >
            <Tab label="Spectrum" />
            <Tab label="Analysis" />
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
        {value === 1 && <div>Item Two</div>}
      </div>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObj: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
