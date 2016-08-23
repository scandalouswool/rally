import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PendingProjectView from '../components/PendingProjectView';

class PendingMenuView extends Component {
  constructor(props) {
    super(props);
  }

  // Emits socket events to either reject or accept a project
  enactDecision(decision, projectId, project) {
    let pendingDecision = {
      decision: decision,
      projectId: projectId,
      project: this.props.pendingProjects[projectId]
    };
    this.props.socket.emit('pendToCreateProject', pendingDecision);
  }

  getDisplay() {
    // Helper function that returns true if user is an admin
    let auth = () => {
      let whiteList = this.props.auth.whiteList;
      let user = this.props.auth.username;
      return whiteList.indexOf(user) !== -1;
    };

    return (
      <div>
        <div className="header-padding">
          <h2>Pending Projects</h2>
        </div>
        {_.map(this.props.pendingProjects, (project, key) => {
          return (
            <PendingProjectView
              project={project}
              key={key}
              id={key}
              enactDecision={this.enactDecision.bind(this)}
              auth={auth()}
            />
          );
        })}
      </div>
    );
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
    pendingProjects: state.pendingProjects,
    socket: state.createdSocket
  };
}

// Attach router to PendingProjectView's context
PendingMenuView.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(PendingMenuView);
