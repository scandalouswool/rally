import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectedProjectView from './SelectedProjectView';
import Progress from 'react-progressbar';
import PrimesVisualView from './PrimesVisual';

class ProjectView extends Component {
  componentDidMount() {
    console.log('Fetching results for this project');
    this.props.socket.emit('fetchProjectResults', this.props.project.projectId);
  }

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

    if (this.props.project === null) {
      this.context.router.push('menu');
    } else {
      let visualization;
      console.log('Project is:', this.props.project);
      console.log('Project type:', this.props.project.projectType);
      console.log('Project total number of jobs:', this.props.project.jobsLength);
      if (this.props.project.projectType === 'primes') {
        visualization = <PrimesVisualView />
      } else {
        visualization = undefined;
      }
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
            Current number of jobs: {this.props.results.length === 0  ? 'Project is currently not in progress' : this.props.results.length}
          </div>
          <div>
            Total number of jobs: {this.props.results.length === 0 ? 'Project is currently not in progress': this.props.job.totalJobs}
          </div>
          <div className="progressbar">
            Progress: {this.props.results.length === 0 ? '0': Math.floor(this.props.results.length / this.props.job.totalJobs * 100 || 100)}
            %
            <Progress color='#3CC76A' completed={this.props.results.length === 0 ? 0 : this.props.results.length / this.props.job.totalJobs * 100 } />
          </div>
          <div>
          Final Result: {Array.isArray(this.props.results)? '' : this.props.results}
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
    job: state.updateJob
  }
}

export default connect(mapStateToProps)(ProjectView);
