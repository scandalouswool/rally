import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectedProjectView from './SelectedProjectView';
import Progress from 'react-progressbar';
import PrimesVisualView from './PrimesVisual';
import Promise from 'bluebird';
import {
        createWebWorkersPool,
        resetWebWorkersPool
       } from '../actions/actions';

class ProjectView extends Component {

  connectToProject() {
    this.props.socket.emit('userReady', {
      projectId: this.props.selectedProject.projectId,
      projectType: this.props.selectedProject.projectType,
      socketId: '/#' + this.props.socket.id,
      maxWorkerJobs: this.props.webWorkersPool === null ? 1 : this.props.webWorkersPool.length
    }); 
  }

  disconnectFromProject() {
    console.log(`Disconnecting from project: ${this.props.selectedProject['title']}`);
    this.props.socket.emit('userDisconnect');
    console.log(this.props);
    this.props.resetWebWorkersPool({
      webWorkersPool: this.props.webWorkersPool,
      socket: this.props.socket
    });
    this.props.createWebWorkersPool({
      webWorkersPool: this.props.webWorkersPool,
      socket: this.props.socket
    });
  }

  render() {
    if (this.props.selectedProject === null) {
      this.context.router.push('menu');
      return null;
    } else {
      let visualization;
      const projectId = this.props.selectedProject.projectId;

      let thisProject; 

      this.props.projects.forEach( (item) => {
        if (item.projectId === projectId) {
          thisProject = item;
        }
      });

      // Display Custom Visualization
      if (this.props.selectedProject.projectType === 'primes') {
        visualization = <PrimesVisualView />
      } else {
        visualization = undefined;
      }

      // Display Project Data
      if (this.props.selectedProject.projectType !== 'ANN') {
        return (
          <div>
            <SelectedProjectView />

            {visualization}

            <button className="btn-success btn-lg createProject" onClick={this.connectToProject.bind(this)}>Join Project</button>
            <button className="btn-danger btn-lg createProject" onClick={this.disconnectFromProject.bind(this)}>Leave Project</button>
            
            <div>
              Number of Workers: {thisProject === undefined ? null : thisProject.workers.length}
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
            Final Result: {thisProject.finalResult}
            </div>
            <div>
            Final Time: {thisProject.projectTime ? thisProject.projectTime + ' milliseconds' : ''}
            </div>
          </div>
        );
      } else if (this.props.selectedProject.projectType === 'ANN') {
        return(
          <div>
            <SelectedProjectView />

            {visualization}

            <button className="btn-success btn-lg createProject" onClick={this.connectToProject.bind(this)}>Join Project</button>
            <button className="btn-danger btn-lg createProject" onClick={this.disconnectFromProject.bind(this)}>Leave ProjectView</button>
            

            <div>
              This is a Neural Network Project
              <div>
              Total Number of Training Data Available: {thisProject.availableJobsNum}
              </div>
            </div>
          </div>
        );
      }

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
    webWorkersPool: state.webWorkersPool
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createWebWorkersPool,
      resetWebWorkersPool
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectView);