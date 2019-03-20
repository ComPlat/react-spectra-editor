import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

import { enableAllBtn } from '../../actions/status';
import SwitchSequence from './switch_sequence';
import SubmitBtn from './submit_btn';

const Styles = () => ({
  formControl: {
    margin: '10px 20px 0px 10px',
    minWidth: 150,
  },
});

const operationSelect = (
  classes, operations, operation, onChangeSelect,
) => {
  const options = operations.map(o => (
    <MenuItem value={o.name} key={o.name}>
      <span className="txt-sv-input-label">{o.name}</span>
    </MenuItem>
  ));

  const selectedValue = operation.name || operations[0].name;

  return (
    <Tooltip
      title={<span className="txt-sv-tp">Operation</span>}
      placement="left"
      disableFocusListener
      disableTouchListener
    >
      <FormControl
        className={classNames(classes.formControl)}
      >
        <Select value={selectedValue} onChange={onChangeSelect}>
          { options }
        </Select>
      </FormControl>
    </Tooltip>
  );
};

class SubmitPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAscend: true,
      operation: false,
    };

    this.updateOperation = this.updateOperation.bind(this);
    this.onToggleSwitch = this.onToggleSwitch.bind(this);
  }

  componentDidMount() {
    const { operations } = this.props;
    this.setState({ operation: operations[0] }); // eslint-disable-line
  }

  onToggleSwitch() {
    const { isAscend } = this.state;
    const { enableAllBtnAct } = this.props;
    enableAllBtnAct();
    this.setState({ isAscend: !isAscend });
  }

  updateOperation(name) {
    const { operations } = this.props;
    let operation = false;
    operations.forEach((o) => {
      if (o.name === name) {
        operation = o;
      }
    });
    this.setState({ operation });
  }

  render() {
    const {
      operations, classes, feature,
    } = this.props;
    const { isAscend, operation } = this.state;

    const onChangeSelect = e => this.updateOperation(e.target.value);

    if (!operations || operations.length === 0) return null;

    return (
      <ExpansionPanelDetails>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <SwitchSequence
              isAscend={isAscend}
              onToggleSwitch={this.onToggleSwitch}
            />
          </Grid>
          <Grid item xs={8}>
            {
              operationSelect(
                classes, operations, operation, onChangeSelect,
              )
            }
          </Grid>
          <Grid item xs={4}>
            <SubmitBtn
              isAscend={isAscend}
              feature={feature}
              operation={operation}
            />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    );
  }
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {}
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    enableAllBtnAct: enableAllBtn,
  }, dispatch)
);

SubmitPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  enableAllBtnAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(SubmitPanel);
