import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectedProjectView from '../containers/SelectedProjectView';

class ProjectView extends Component {
  connectToProject() {
    console.log('Joining...');
    this.props.socket.emit('userReady', this.props.project.projectId);
  }

  disconnectFromProject() {
    console.log(`Disconnecting from project: ${this.props.project['title']}`);
    this.props.socket.emit('userDisconnect');
    // TODO: terminate the existing worker
  }

  render() {
    console.log(this.props.results);
    
    return (
      <div>
        <SelectedProjectView />
        This is the project view. <br />
        <button onClick={this.connectToProject.bind(this)}>Join</button>
        <button onClick={this.disconnectFromProject.bind(this)}>Leave</button>
        <div>
          Number of results so far: {this.props.results === null ? 'zero' : this.props.results.length}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    project: state.selectedProject,
    socket: state.createdSocket,
    results: state.updateResults
  }
}

export default connect(mapStateToProps)(ProjectView);