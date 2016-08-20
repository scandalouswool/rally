import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class PendingProjectsView extends Component {
  constructor(props) {
    super(props);
  }

  getDisplay() {
    // Helper function that returns true if user is an admin
    let auth = () => {
      let whiteList = this.props.auth.whiteList;
      let user = this.props.auth.username;
      return whiteList.indexOf(user) !== -1;
    };

    if (!auth()) {
      // If after five seconds the user isn't authenticated, route to homepage
      setTimeout(function() {
        if (!auth()) {
          this.context.router.push('/');
        }
      }.bind(this), 5000);
      return (<div>Checking authorization...</div>);
    } else {
      return (<div>You good!</div>);
    }
  }

  render() {
    return (
      <div>{this.getDisplay()}</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    pendingProjects: state.pendingProjects
  };
}

// Attach router to PendingProjectView's context
PendingProjectsView.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(PendingProjectsView);
