import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectedProjectView from './SelectedProjectView';
import Progress from 'react-progressbar';
import PrimesVisualView from './PrimesVisual';

class ProjectView extends Component {
  componentDidMount() {
    console.log('Fetching all projects update');
    this.props.socket.emit('getAllProjects');
  }

  connectToProject() {
    console.log('Joining...');
    this.props.socket.emit('userReady', this.props.project.projectId);
  }

  disconnectFromProject() {
    console.log(`Disconnecting from project: ${this.props.project['title']}`);
    this.props.socket.emit('userDisconnect');
    this.props.webWorker.terminate();
  }

  render() {

    if (this.props.project === null) {
      this.context.router.push('menu');
      return null;
    } else {
      let visualization;
      const projectId = this.props.project.projectId;

      console.log('Project is:', this.props.project);
      console.log('Project type:', this.props.project.projectType);
      console.log('Project total number of jobs:', this.props.project.jobsLength);
      if (this.props.project.projectType === 'primes') {
        visualization = <PrimesVisualView />
      } else {
        visualization = undefined;
      }
      console.log('Results so far:', this.props.results[projectId]);
      return (
        <div>
          {visualization}
          <SelectedProjectView />
          Project View
          <br />
          <br />
          <button className="btn-success btn-lg" onClick={this.connectToProject.bind(this)}>Join</button>
          <button className="btn-danger btn-lg" onClick={this.disconnectFromProject.bind(this)}>Leave</button>
          <div>
            Number of Jobs Completed: {this.props.results[projectId].length === 0  ? 'Project is currently not in progress' : this.props.results[projectId].length}
          </div>
          <div>
            Total number of jobs: {this.props.results[projectId].length === 0 ? 'Project is currently not in progress': this.props.project.jobsLength}
          </div>
          <div className="progressbar">
            Progress: {this.props.results[projectId].length === 0 ? '0': Math.floor(this.props.results[projectId].length / this.props.project.jobsLength * 100 || 100)}
            %
            <Progress color='#3CC76A' completed={this.props.results[projectId].length === 0 ? 0 : this.props.results[projectId].length / this.props.project.jobsLength * 100 } />
          </div>
          <div>
          Final Result: {Array.isArray(this.props.results[projectId])? '' : this.props.results[projectId]}
          </div>
        </div>
      );
    }
  }
}

// Attach router to context
ProjectView.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    project: state.selectedProject,
    socket: state.createdSocket,
    results: state.updateResults,
    job: state.updateJob,
    webWorker: state.webWorker
  }
}

export default connect(mapStateToProps)(ProjectView);
