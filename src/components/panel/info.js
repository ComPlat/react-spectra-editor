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

import Format from '../../helpers/format';

const styles = () => ({
  chip: {
    margin: '1px 0 1px 0',
  },
  panel: {
    backgroundColor: '#eee',
    display: 'table-row',
  },
  panelSummary: {
    backgroundColor: '#eee',
    height: 32,
  },
  panelDetail: {
    backgroundColor: '#fff',
    height: 'calc(78vh - 280px)',
    overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  rowOdd: {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    height: 36,
    lineHeight: '36px',
    overflow: 'hidden',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowEven: {
    backgroundColor: '#fafafa',
    border: '1px solid #eee',
    height: 36,
    lineHeight: '36px',
    overflow: 'hidden',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tHead: {
    fontWeight: 'bold',
    float: 'left',
    width: 90,
  },
  tTxt: {
    fontSize: '0.9rem',
    fontFamily: 'Helvetica',
    margin: '0 0 0 90',
  },
});

const InfoPanel = ({
  classes, expand, feature, layoutSt,
  onExapnd,
}) => {
  if (!feature) return null;
  const { title, observeFrequency, solventName } = feature;

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
            Info
          </span>
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        <div className={classNames(classes.rowOdd)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Title: </span>
          <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{ title }</span>
        </div>
        {
          Format.isNmrLayout(layoutSt)
            ? (
              <div className={classNames(classes.rowEven)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Frequency: </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{observeFrequency}</span>
              </div>
            )
            : null
        }
        {
          Format.isNmrLayout(layoutSt)
            ? (
              <div className={classNames(classes.rowOdd)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Solvent: </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{solventName}</span>
              </div>
            )
            : null
        }
      </div>
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  feature: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  onExapnd: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(InfoPanel));
