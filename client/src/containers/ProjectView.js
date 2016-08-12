import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectedProjectView from './SelectedProjectView';
import Progress from 'react-progressbar';
import PrimesVisualView from './PrimesVisual';

class ProjectView extends Component {
  componentDidMount() {
    console.log('Fetching all projects update');
    this.props.socket.emit('getAllProjectsUpdate');
  }

  connectToProject() {
    console.log('Joining...');
    this.props.socket.emit('userReady', this.props.selectedProject.projectId);
  }

  disconnectFromProject() {
    console.log(`Disconnecting from project: ${this.props.selectedProject['title']}`);
    this.props.socket.emit('userDisconnect');
    this.props.webWorker.terminate();
  }

  render() {

    if (this.props.selectedProject === null) {
      this.context.router.push('menu');
      return null;
    } else {
      let visualization;
      const projectId = this.props.selectedProject.projectId;

      console.log('Ongoing projects:', this.props.projects);

      let thisProject; 
      
      this.props.projects.forEach( (item) => {
        if (item.projectId === projectId) {
          thisProject = item;
        }
      });

      if (this.props.selectedProject.projectType === 'primes') {
        visualization = <PrimesVisualView />
      } else {
        visualization = undefined;
      }

      console.log('Results so far:', this.props.results[projectId]);
      console.log('Workers in this project:', thisProject.workers);
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
            Number of Workers: {thisProject.workers.length}
          </div>
          <div>
            Number of Jobs Completed: {this.props.results[projectId].length === 0  ? 'Project is currently not in progress' : this.props.results[projectId].length}
          </div>
          <div>
            Total number of jobs: {this.props.results[projectId].length === 0 ? 'Project is currently not in progress': this.props.selectedProject.jobsLength}
          </div>
          <div className="progressbar">
            Progress: {this.props.results[projectId].length === 0 ? '0': Math.floor(this.props.results[projectId].length / this.props.selectedProject.jobsLength * 100 || 100)}
            %
            <Progress color='#3CC76A' completed={this.props.results[projectId].length === 0 ? 0 : this.props.results[projectId].length / this.props.selectedProject.jobsLength * 100 } />
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
    selectedProject: state.selectedProject,
    projects: state.projects,
    socket: state.createdSocket,
    results: state.updateResults,
    job: state.updateJob,
    webWorker: state.webWorker
  }
}

export default connect(mapStateToProps)(ProjectView);
