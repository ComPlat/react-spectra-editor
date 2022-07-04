import React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelSummary, ListItem, List } from "@material-ui/core";
import { selectCurve } from '../../actions/curve';

const styles = () => ({
  panelSummary: {
    backgroundColor: '#eee',
    height: 22,
  },
  curve: {
    width: '100%',
  },
  line: {
    height: '2px',
    borderWidth: '0',
    margin: '0'
  },
  curveDefault: {
    backgroundColor: '#fff',
    fontSize: '0.8em',
    margin: '0',
    padding: '10px 2px 2px 10px'
  },
  curveSelected: {
    backgroundColor: '#2196f3',
    fontSize: '0.8em',
    color: '#fff',
    padding: '10px 2px 2px 10px'
  },
});

const GraphSelectionPanel = ({
  classes, curveSt, selectCurveAct, entityFileNames
}) => {

  if (!curveSt) {
    return (<span/>)    
  }
  const {curveIdx, listCurves} = curveSt;

  const onChange = (idx) => {
    selectCurveAct(idx);
  }

  const items = listCurves.map((spectra, idx) => {
    const { color } = spectra;
    let filename = '';
    if (entityFileNames && idx < entityFileNames.length) {
        filename = entityFileNames[idx];
    }
    return { name: `${idx + 1}.`, idx, color, filename };
  });

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        xpandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
          <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
            Graph selection
          </span>
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <List>
        {
          items.map((item) => (
            <ListItem 
              key={item.idx} 
              onClick={() => onChange(item.idx)}
              className={
                classNames((item.idx === curveIdx ? classes.curveSelected : classes.curveDefault ))
              }
            >
              <span className={classNames(classes.curve)}>
                <i>{ item.name }</i>
                <span style={{float: "right", width: "95%"}}>
                    <hr className={classNames(classes.line)} style={{backgroundColor: item.color}}/>
                    {
                        item.filename !== '' ? <span>File: { item.filename }</span> : null
                    }
                </span>
              </span>
            </ListItem>
          ))
        }
      </List>
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    selectCurveAct: selectCurve,
  }, dispatch)
);

GraphSelectionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  layoutSt: PropTypes.string.isRequired,
  onExapnd: PropTypes.func.isRequired,
  curveSt: PropTypes.object.isRequired,
  selectCurveAct: PropTypes.func.isRequired,
  entityFileNames: PropTypes.array.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(withStyles(styles)(GraphSelectionPanel));