import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withStyles from '@mui/styles/withStyles';
import { Dialog, CircularProgress, Typography } from '@mui/material';

const styles = () => ({
  card: {
    alignItems: 'center',
    display: 'flex',
    gap: 16,
    padding: '20px 28px',
  },
});

// A steady spinner: the default one grows and shrinks its arc, which reads as starting over
// during a long conversion.
function Loading({ loadingSt, classes }) {
  return (
    <Dialog open={loadingSt}>
      <div className={classes.card} role="status">
        <CircularProgress disableShrink size={32} thickness={4} />
        {/* Typography: the dialog renders outside the page's font scope. */}
        <Typography sx={{ color: '#3e4c59', fontSize: 15 }}>Processing…</Typography>
      </div>
    </Dialog>
  );
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    loadingSt: state.loading,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
  }, dispatch)
);

Loading.propTypes = {
  loadingSt: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Loading));
