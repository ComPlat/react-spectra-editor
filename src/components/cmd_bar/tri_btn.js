/* eslint-disable prefer-object-spread */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import Cfg from '../../helpers/cfg';
import { MuButton, commonStyle } from './common';

const styles = () => (
  Object.assign(
    {
      btnYes: {
        backgroundColor: '#eef8f0',
        borderColor: '#9ccfa7',
        color: '#1f7a35',
        '&:hover': {
          backgroundColor: '#dff2e3',
          borderColor: '#6fb980',
        },
      },
      btnNo: {
        backgroundColor: '#fff1f0',
        borderColor: '#efb0aa',
        color: '#b42318',
        '&:hover': {
          backgroundColor: '#ffe3e0',
          borderColor: '#df8379',
        },
      },
      btnTxtConfirm: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: 12,
      },
      confirmWrap: {
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        border: '1px solid #dbe3ea',
        borderRadius: 7,
        display: 'inline-flex',
        gap: 4,
        height: 30,
        padding: '0 4px 0 8px',
      },
      confirmText: {
        color: '#25313b',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.02em',
        marginRight: 2,
        whiteSpace: 'nowrap',
      },
      confirmBtn: {
        height: 24,
        minWidth: 24,
        width: 24,
      },
      confirmIcon: {
        fontSize: 17,
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
      content, layoutSt, children, isClearAllDisabled,
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
            disabled={(isClearAllDisabled === false ? false : (Cfg.btnCmdMpy(layoutSt)
              && Cfg.btnCmdIntg(layoutSt)))}
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
      <span
        className={classes.confirmWrap}
        disabled={Cfg.btnCmdMpy(layoutSt) && Cfg.btnCmdIntg(layoutSt)}
      >
        <span className={classNames(classes.confirmText, 'txt-sv-bar-desc')}>
          Delete ALL?
        </span>
        <MuButton
          className={
            classNames(
              classes.confirmBtn,
              classes.btnYes,
              'btn-sv-bar-yes',
            )
          }
          onClick={onExec}
        >
          <CheckRoundedIcon className={classNames(classes.confirmIcon, 'txt-sv-bar-yes')} />
        </MuButton>
        <MuButton
          className={
            classNames(
              classes.confirmBtn,
              classes.btnNo,
              'btn-sv-bar-no',
            )
          }
          onClick={this.onToggle}
        >
          <CloseRoundedIcon className={classNames(classes.confirmIcon, 'txt-sv-bar-no')} />
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

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
  }, dispatch)
);

TriBtn.propTypes = {
  classes: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
  cb: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  isClearAllDisabled: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(TriBtn));
