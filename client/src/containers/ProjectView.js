import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectedProjectView from './SelectedProjectView';
import Progress from 'react-progressbar';
import PrimesVisualView from './PrimesVisualView';
import NQueensVisualView from './NQueensVisualView';
import UserView from '../components/UserView';
import _ from 'lodash';
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
    // Check that a project is currently selected
    if (this.props.selectedProject === null) {
      this.context.router.push('menu');
      return null;

    // This the actual project view
    } else {
      let visualization, thisProject;
      const projectId = this.props.selectedProject.projectId;

      this.props.projects.forEach( (item) => {
        if (item.projectId === projectId) {
          thisProject = item;
        }
      });

      // Display Custom Visualization
      if (this.props.selectedProject.projectType === 'primes') {
        visualization = <PrimesVisualView />;
      } else if (this.props.selectedProject.projectType === 'nqueens') {
        visualization = <NQueensVisualView />;
      } else {
        visualization = <div className="viz-placeholder"></div>;
      }

      // Change stats depending on the type of project (ANN or otherwise)
      let stats;
      if (this.props.selectedProject.projectType === 'ANN') {
        stats = (
          <div className="row stats">
            This is a Neural Network Project
            <div>
            Total Number of Training Data Available: {thisProject.availableJobsNum}
            </div>
          </div>
        );
      } else {
        stats = (
          <div className="row stats">
            <div className="progressbar">
              Progress: {this.props.results[projectId].length === 0 ? '0': Math.floor(this.props.results[projectId].length / this.props.selectedProject.jobsLength * 100 || 100)}
              %
              <Progress color='#3CC76A' completed={this.props.results[projectId].length === 0 ? 0 : this.props.results[projectId].length / this.props.selectedProject.jobsLength * 100 } />
            </div>
            <div>
            Final Result: {thisProject.finalResult}
            </div>
            <div>
            Final Time: {thisProject.projectTime ? Math.round((thisProject.projectTime / 1000), 1) + ' seconds' : ''}
            </div>
          </div>
        );
      }

      // Display Project Data
      return (
        <div className="container">

          <div className="row">
            <div className="col-sm-8">
              <SelectedProjectView />
            </div>

            <div className="col-sm-4">
              <button
                className="btn-success btn-lg createProject btn-padding btn-size"
                onClick={this.connectToProject.bind(this)}>
                Join
              </button>
              <button
                className="btn-danger btn-lg createProject btn-padding btn-size"
                onClick={this.disconnectFromProject.bind(this)}>
                Abandon
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 viz-block">
              {visualization}
            </div>
          </div>

         {stats}

          <div className="row">
            <div className="col-sm-12 user-container">
              <UserView workerArray={thisProject.workers}/>
            </div>
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
    webWorkersPool: state.webWorkersPool
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createWebWorkersPool,
      resetWebWorkersPool
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectView);
