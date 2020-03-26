import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  withStyles, createMuiTheme, MuiThemeProvider,
} from '@material-ui/core/styles';

import InfoPanel from './info';
import PeakPanel from './peaks';
import MultiplicityPanel from './multiplicity';
import Cfg from '../../helpers/cfg';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = () => ({
  panels: {
    maxHeight: 'calc(90vh - 220px)', // ROI
    display: 'table',
    overflowX: 'hidden',
    overflowY: 'auto',
    margin: '5px 0 0 0',
    padding: '0 0 0 0',
    width: '100%',
  },
});

class PanelViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: 'info',
    };

    this.onExapnd = this.onExapnd.bind(this);
  }

  onExapnd(input) {
    const { expand } = this.state;
    const nextExpand = input === expand ? '' : input;
    this.setState({ expand: nextExpand });
  }

  render() {
    const { expand } = this.state;
    const {
      classes, feature, molSvg, layoutSt,
    } = this.props;
    const onExapndInfo = () => this.onExapnd('info');
    const onExapndPeak = () => this.onExapnd('peak');
    const onExapndMpy = () => this.onExapnd('mpy');

    return (
      <div className={classNames(classes.panels)}>
        <MuiThemeProvider
          theme={theme}
        >
          <InfoPanel
            feature={feature}
            expand={expand === 'info'}
            molSvg={molSvg}
            onExapnd={onExapndInfo}
          />
          { Cfg.hidePanelPeak(layoutSt) ? null : <PeakPanel expand={expand === 'peak'} onExapnd={onExapndPeak} /> }
          { Cfg.hidePanelMpy(layoutSt) ? null : <MultiplicityPanel expand={expand === 'mpy'} onExapnd={onExapndMpy} /> }
        </MuiThemeProvider>
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

PanelViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  molSvg: PropTypes.string.isRequired,
  layoutSt: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(PanelViewer));
