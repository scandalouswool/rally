import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectedProjectView from './SelectedProjectView';
import Progress from 'react-progressbar';
import PrimesVisualView from './PrimesVisual';

class ProjectView extends Component {

  componentDidMount() {
    if (this.props.selectedProject.projectType === 'ANN') {
      console.log('Initializing ANN project');
      this.initializeANNWebWorkers();
   
      setTimeout( () => {
        this.workerPool[1].worker.postMessage('test');
      }, 2000)
    }
  }

  connectToProject() {
    console.log('Joining project', this.props.selectedProject.projectId);
    this.props.socket.emit('userReady', {
      projectId: this.props.selectedProject.projectId,
      socketId: '/#' + this.props.socket.id,
      maxWorkerJobs: this.props.webWorkersPool === null ? 1 : this.props.webWorkersPool.length
    });
  }

  disconnectFromProject() {
    console.log(`Disconnecting from project: ${this.props.selectedProject['title']}`);
    this.props.socket.emit('userDisconnect');
  }

  /*
    NEURAL NETWORK METHODS
  */
  initializeANNWebWorkers() {
    // TODO: Should this be a promise? These are async ops
    const MAX_WORKERS = navigator.hardwareConcurrency || 2;
    this.workerPool = {};

    for (var i = 0; i < MAX_WORKERS; i++) {
      const worker = {
        worker: new Worker('/ANNworker'),
        workerId: i,
        isBusy: false
      }
    
      worker.worker.onmessage = (e) => {
        console.log(e.data);
      }

      this.workerPool[i] = worker;
    }
    console.log(this.workerPool);
  }

  render() {
    if (this.props.selectedProject === null) {
      this.context.router.push('menu');
      return null;
    } else {
      let visualization;
      const projectId = this.props.selectedProject.projectId;

      let thisProject; 
      console.log('Projects are:', this.props.projects);
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

      if (this.props.selectedProject.projectType !== 'ANN') {
        return (
          <div>
            <SelectedProjectView />

            {visualization}

            <button className="btn-success btn-lg" onClick={this.connectToProject.bind(this)}>Join</button>
            <button className="btn-danger btn-lg" onClick={this.disconnectFromProject.bind(this)}>Leave</button>
            
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
            This is a Neural Network Project
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

export default connect(mapStateToProps)(ProjectView);
