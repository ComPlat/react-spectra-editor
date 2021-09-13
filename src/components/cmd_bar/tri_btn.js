import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import Cfg from '../../helpers/cfg';
import { MuButton, commonStyle } from './common';

const styles = () => (
  Object.assign(
    {
      btnYes: {
        color: 'green',
      },
      btnNo: {
        color: 'red',
      },
      btnTxtConfirm: {
        fontFamily: 'Helvetica',
        fontSize: 12,
      },
    },
    commonStyle,
  )
);

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
      content, layoutSt, children,
    } = this.props;
    const { tp } = content;
    const title = <span className="txt-sv-tp">{ tp }</span>;

    return (
      <Tooltip title={title}>
        <span>
          <MuButton
            className={
              classNames(
                'btn-sv-bar-one',
              )
            }
            disabled={Cfg.btnCmdMpy(layoutSt) && Cfg.btnCmdIntg(layoutSt)}
            onClick={this.onToggle}
          >
            { children }
          </MuButton>
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
      <span disabled={Cfg.btnCmdMpy(layoutSt) && Cfg.btnCmdIntg(layoutSt)}>
        <span className={classNames(classes.txtLabel, 'txt-sv-bar-desc')}>
          Delete ALL?
        </span>
        <MuButton
          className={
            classNames(
              'btn-sv-bar-yes',
            )
          }
          onClick={onExec}
        >
          <span className={classNames(classes.txt, classes.btnYes, 'txt-sv-bar-yes')}>Y</span>
        </MuButton>
        <MuButton
          className={
            classNames(
              'btn-sv-bar-no',
            )
          }
          onClick={this.onToggle}
        >
          <span className={classNames(classes.txt, classes.btnNo, 'txt-sv-bar-no')}>N</span>
        </MuButton>
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
