import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  panel: {
    backgroundColor: '#eee',
    display: 'table-row',
  },
  panelSummary: {
    backgroundColor: '#eee',
    height: 32,
  },
  txtBadge: {
  },
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)', // ROI
    overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  tRowHeadPos: {
    backgroundColor: '#2196f3',
    height: 32,
  },
  tRowHeadNeg: {
    backgroundColor: '#fa004f',
    height: 32,
  },
  tTxtHead: {
    color: 'white',
    padding: '4px 0 4px 5px',
  },
  tTxtHeadXY: {
    color: 'white',
    padding: '4px 0 4px 90px',
  },
  tTxt: {
    padding: 0,
  },
  tRow: {
    height: 28,
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  rmBtn: {
    color: 'red',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: 'red',
      color: 'white',
    },
  },
  moCard: {
    textAlign: 'left',
  },
  moCardHead: {
    backgroundColor: '#999',
    color: 'white',
  },
  moExtId: {
    border: '2px solid white',
    borderRadius: 12,
    color: 'white',
    margin: '0 5px 0 5px',
    padding: '0 5px 0 5px',
  },
  moExtTxt: {
    margin: '0 5px 0 5x',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
  moSelect: {
    margin: '0 5x 0 5px',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
  moCBox: {
    marginLeft: 24,
    padding: '4px 0 4px 4px',
  },
  btnRf: {
    color: '#fff',
    float: 'right',
    minWidth: 40,
    right: 15,
  },
});

const ComparePanel = ({
  classes, expand, onExapnd,
}) => {
  const digits = 4;

  return (
    <ExpansionPanel
      expanded={expand}
      onChange={onExapnd}
      className={classNames(classes.panel)}
      TransitionProps={{ unmountOnExit: true }} // increase ExpansionPanel performance
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
          <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
            Compare Spectra
          </span>
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        <span>123</span>
      </div>
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

ComparePanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  onExapnd: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(ComparePanel));
