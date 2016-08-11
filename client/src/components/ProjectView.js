import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectedProjectView from '../containers/SelectedProjectView';

class ProjectView extends Component {
  constructor(props) {
    super(props);


  }

  connectToProject() {
    console.log(`Connecting to project`);
  }

  disconnectFromProject() {
    console.log(`Disconnecting from project`);
  }

  render() {
    console.log(this.props.project);
    
    return (
      <div>
        <SelectedProjectView />
        This is the project view. <br />
        <button onClick={this.connectToProject}>Join</button>
        <button onClick={this.disconnectFromProject}>Leave</button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    project: state.selectedProject
  }
}

export default connect(mapStateToProps)(ProjectView);