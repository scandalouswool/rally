import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectedProjectView from '../containers/SelectedProjectView';
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

    let visualization;
    console.log('Project is:', this.props.project);
    console.log('Project type:', this.props.project.projectType);
    if (this.props.project.projectType === 'primes') {
      visualization = <PrimesVisualView />
    } else {
      visualization = undefined;
    }
    
    return (
      <div>
        {visualization}
        <SelectedProjectView />
        This is the project view. <br />
        <button onClick={this.connectToProject.bind(this)}>Join</button>
        <button onClick={this.disconnectFromProject.bind(this)}>Leave</button>
        <div>
          Current number of job: {this.props.results === null ? 'zero' : this.props.results.length}
        </div>
        <div>
          Total number of jobs: {this.props.results === null ? 'zero': this.props.job.totalJobs}
        </div>
        <div>
          Progress: {this.props.results === null ? 'zero': Math.floor(this.props.results.length / this.props.job.totalJobs * 100 || 100)}
          {this.props.results === null ? '': '%'}
          <Progress color='#3CC76A' completed={this.props.results === null ? 0 : this.props.results.length / this.props.job.totalJobs * 100 } />
        </div>
        <div>
        Final Result: {Array.isArray(this.props.results)? '' : this.props.results}
        </div>
      </div>
    );
  }
}



function mapStateToProps(state) {
  return {
    project: state.selectedProject,
    socket: state.createdSocket,
    results: state.updateResults,
    job: state.updateJob
  }
}

export default connect(mapStateToProps)(ProjectView);
