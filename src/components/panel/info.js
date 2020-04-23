import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SvgFileZoomPan from 'react-svg-file-zoom-pan';
import ReactQuill from 'react-quill';

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
    maxHeight: 'calc(90vh - 220px)', // ROI
    overflow: 'auto',
  },
  table: {
    width: 'auto',
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
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    marginLeft: 24,
  },
  tTxt: {
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    marginRight: 3,
  },
  quill: {
    backgroundColor: '#fafafa',
    border: '1px solid #eee',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    padding: '0 10px 0 10px',
    textAlign: 'left',
  },
});

const InfoPanel = ({
  classes, expand, feature, molSvg, descriptions,
  layoutSt, shiftNameSt,
  onExapnd,
}) => {
  if (!feature) return null;
  const { title, observeFrequency, solventName } = feature;
  const showSolvName = shiftNameSt === '- - -' ? solventName : shiftNameSt;

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
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Title : </span>
          <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{ title }</span>
        </div>
        {
          Format.isNmrLayout(layoutSt)
            ? (
              <div className={classNames(classes.rowEven)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Freq : </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{ parseInt(observeFrequency, 10) || ' - ' }</span>
              </div>
            )
            : null
        }
        {
          Format.isNmrLayout(layoutSt)
            ? (
              <div className={classNames(classes.rowOdd)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Solv : </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{showSolvName}</span>
              </div>
            )
            : null
        }
        {
          !molSvg
            ? null
            : (
              <SvgFileZoomPan
                svg={molSvg}
                duration={300}
                resize
              />
            )
        }
      </div>
      <ReactQuill
        className={classNames(classes.quill, 'card-sv-quill')}
        value={descriptions}
        modules={{ toolbar: false }}
        readOnly
      />
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    shiftNameSt: state.shift.ref.name,
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
  molSvg: PropTypes.string.isRequired,
  descriptions: PropTypes.array.isRequired,
  layoutSt: PropTypes.string.isRequired,
  shiftNameSt: PropTypes.string.isRequired,
  onExapnd: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(InfoPanel));
