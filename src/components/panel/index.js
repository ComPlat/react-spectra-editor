import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  withStyles, createMuiTheme, MuiThemeProvider,
} from '@material-ui/core/styles';

import PeakPanel from './peaks';
import MultiplicityPanel from './multiplicity';
import Format from '../../helpers/format';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = () => ({
  panels: {
    height: '63vh',
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
      expand: 'mpy',
    };

    this.onExapnd = this.onExapnd.bind(this);
  }

  onExapnd(expand) {
    this.setState({ expand });
  }

  render() {
    const { expand } = this.state;
    const { classes, layoutSt } = this.props;
    const onExapndPeak = () => this.onExapnd('peak');
    const onExapndMpy = () => this.onExapnd('mpy');

    return (
      <div>
        <div className={classNames(classes.panels)}>
          <MuiThemeProvider
            theme={theme}
          >
            { !Format.isMsLayout(layoutSt) ? <PeakPanel expand={expand === 'peak'} onExapnd={onExapndPeak} /> : null }
            { Format.isNmrLayout(layoutSt) ? <MultiplicityPanel expand={expand === 'mpy'} onExapnd={onExapndMpy} /> : null }
          </MuiThemeProvider>
        </div>
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
  layoutSt: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(PanelViewer));
