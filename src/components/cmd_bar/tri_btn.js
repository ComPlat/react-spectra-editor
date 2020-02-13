import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import Cfg from '../../helpers/cfg';

const styles = () => ({
  btn: {
    minWidth: 40,
  },
  btnTxt: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  btnYes: {
    color: 'green',
  },
  btnNo: {
    color: 'red',
  },
  btnTxtConfirm: {
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

class TriBtn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggled: false,
    };

    this.onToggle = this.onToggle.bind(this);
    this.renderStageOne = this.renderStageOne.bind(this);
    this.renderStageTwo = this.renderStageTwo.bind(this);
  }

  onToggle(e) {
    e.stopPropagation();
    e.preventDefault();
    const { toggled } = this.state;
    this.setState({ toggled: !toggled });
  }

  renderStageOne() {
    const {
      content, classes, layoutSt, children,
    } = this.props;
    const { tp } = content;
    const title = <span className="txt-sv-tp">{ tp }</span>;

    return (
      <Tooltip title={title}>
        <span>
          <Button
            className={classes.btn}
            disabled={Cfg.btnCmdMpy(layoutSt)}
            onClick={this.onToggle}
          >
            { children }
          </Button>
        </span>
      </Tooltip>
    );
  }

  renderStageTwo() {
    const {
      classes, layoutSt, cb,
    } = this.props;
    const onExec = (e) => {
      cb();
      this.onToggle(e);
    };

    return (
      <span disabled={Cfg.btnCmdMpy(layoutSt)}>
        <span className={classNames(classes.btnTxtConfirm, 'cmd-txt-btn')}>
          Delete ALL?
        </span>
        <Button
          className={classes.btn}
          onClick={onExec}
        >
          <span className={classNames(classes.btnTxt, classes.btnYes, 'cmd-txt-btn')}>Yes</span>
        </Button>
        <Button
          className={classes.btn}
          onClick={this.onToggle}
        >
          <span className={classNames(classes.btnTxt, classes.btnNo, 'cmd-txt-btn')}>No</span>
        </Button>
      </span>
    );
  }

  render() {
    const { toggled } = this.state;

    return (
      !toggled
        ? this.renderStageOne()
        : this.renderStageTwo()
    );
  }
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

TriBtn.propTypes = {
  classes: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
  cb: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(TriBtn));
