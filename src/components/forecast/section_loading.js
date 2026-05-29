import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutline from '@mui/icons-material/ErrorOutline';

class SectionLoading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 5000);
  }

  renderLoading() {
    const { classes } = this.props;
    return (
      <div className={classes.loadingWrap}>
        <CircularProgress size={36} style={{ color: '#2196f3' }} />
        <p className={classes.messageSubText}>Loading structure...</p>
      </div>
    );
  }

  renderNotFound() {
    const { classes } = this.props;
    return (
      <div className={classes.loadingWrap}>
        <ErrorOutline style={{ color: '#ffc107', fontSize: 36 }} />
        <p className={classes.messageText}>Structure not found</p>
      </div>
    );
  }

  render() {
    const { loading } = this.state;

    return (
      loading
        ? this.renderLoading()
        : this.renderNotFound()
    );
  }
}

SectionLoading.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default SectionLoading;
