import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { rmFromPosList, rmFromNegList } from '../../actions/edit_peak';

const Styles = () => ({
  chip: {
    margin: '5px',
  },
  panelSummary: {
    backgroundColor: '#fbfbfb',
  },
});

const CenterBadge = withStyles({
  badge: {
    top: '50%',
  },
})(Badge);

const negPeakList = (negPeaks, rmFromNegListAct, classes) => (
  negPeaks.length === 0
    ? (
      <Typography className="txt-panel-content">
        <i>No peak deleted!</i>
      </Typography>
    )
    : (
      <div>
        {
          negPeaks.map((np) => {
            const onDelete = () => rmFromNegListAct(np);
            return (
              <div key={np.x}>
                <Chip
                  className={classNames(classes.chip, 'txt-panel-content')}
                  label={np.x}
                  onDelete={onDelete}
                />
              </div>
            );
          })
        }
      </div>
    )
);

const posPeakList = (posPeaks, rmFromPosListAct, classes) => (
  posPeaks.length === 0
    ? (
      <Typography className="txt-panel-content">
        <i>No peak created!</i>
      </Typography>
    )
    : (
      <div>
        {
          posPeaks.map((pp) => {
            const onDelete = () => rmFromPosListAct(pp);
            return (
              <div key={pp.x}>
                <Chip
                  className={classNames(classes.chip, 'txt-panel-content')}
                  label={pp.x}
                  onDelete={onDelete}
                />
              </div>
            );
          })
        }
      </div>
    )
);


const AddPanel = ({
  editPeakSt, rmFromPosListAct, classes,
}) => {
  const { pos } = editPeakSt;
  const posLength = pos.length;
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <CenterBadge
          color="primary"
          className={classNames(classes.badge, 'txt-panel-badge')}
          badgeContent={posLength}
        >
          <Typography className="txt-panel-header">
            Created Peaks
          </Typography>
        </CenterBadge>
      </ExpansionPanelSummary>
      <Divider />
      <ExpansionPanelDetails>
        { posPeakList(pos, rmFromPosListAct, classes) }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};


const RmPanel = ({
  editPeakSt, rmFromNegListAct, classes,
}) => {
  const { neg } = editPeakSt;
  const negLength = neg.length;
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <CenterBadge
          color="secondary"
          className={classNames(classes.badge, 'txt-panel-badge')}
          badgeContent={negLength}
        >
          <Typography className="txt-panel-header">
            Deleted Peaks
          </Typography>
        </CenterBadge>
      </ExpansionPanelSummary>
      <Divider />
      <ExpansionPanelDetails>
        { negPeakList(neg, rmFromNegListAct, classes) }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    rmFromPosListAct: rmFromPosList,
    rmFromNegListAct: rmFromNegList,
  }, dispatch)
);

AddPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  rmFromPosListAct: PropTypes.func.isRequired,
};

RmPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  rmFromNegListAct: PropTypes.func.isRequired,
};

const AddPeakPanel = connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(AddPanel));
const RmPeakPanel = connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(RmPanel));

export { AddPeakPanel, RmPeakPanel };
