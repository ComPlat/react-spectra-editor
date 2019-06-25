import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

const styleLoading = {
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
};

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
    return (
      <div style={styleLoading}>
        <CircularProgress style={{ color: 'blue', fontSize: 50 }} />
      </div>
    );
  }

  renderNotFound() {
    return (
      <div style={styleLoading}>
        <ErrorOutline style={{ color: '#ffc107', fontSize: 50, margin: 20 }} />
        <h3>Structure Not Found</h3>
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

export default SectionLoading;
