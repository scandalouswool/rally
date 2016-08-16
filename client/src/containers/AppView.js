import React, { Component } from 'react';
import io from 'socket.io-client';
import NavbarView from '../components/NavbarView';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createdSocket,
         updateProjects,
         updateWorkers,
         newJob,
         completeJob,
         sendCompleteJob,
         updateResults,
         finalResults,
         createWebWorkersPool,
         updateAllProjects
       } from '../actions/actions';

export default class AppView extends Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.webWorkerPool = null;
  }

  componentWillMount() {
    /************************************************
    // Web Worker Handlers
    ************************************************/

    // Check if user's computer can run web workers
    if (typeof(Worker) === 'undefined') {
      console.log('This browser does not support Web Workers. The main browser process will perform the calculations, which will likely cause noticeable delays.');

    } else {

      // Create a Web Worker pool based on the maximum number of 
      // concurrent processes that user's CPU can support. Default to 
      // two workers if navigator.hardwareConcurrency is unavailable
      const MAX_WEBWORKERS = navigator.hardwareConcurrency || 2;
      this.webWorkerPool = [];

      for (var i = 0; i < MAX_WEBWORKERS; i++) {
        let newWorker = {
          worker: new Worker('/webWorker'),
          isBusy: false,
          jobId: null
        }
    
        newWorker.worker.onmessage = (event) => {
          console.log('Sending completed job to server');
          const job = event.data;

          this.webWorkerPool.forEach( (worker) => {
            if (worker.jobId === job.jobId) {
              worker.isBusy = false;
              worker.jobId = null;
            }
          });

          this.socket.emit('userJobDone', job);
        };

        this.webWorkerPool.push(newWorker);
      }
      console.log('Web worker pool initialized:', this.webWorkerPool);
      this.props.createWebWorkersPool(this.webWorkerPool);
    }

    /************************************************
    // Web Socket Handlers
    ************************************************/

    // Client must be able to handle the following events:
    // - newJob
    // - updateWorkers
    // - updateResults
    // - finalResult
    // - connect
    this.socket.on('connect', () => {
      this.props.createdSocket(this.socket);
    });

    this.socket.on('updateWorkers', (workers) => {
      this.props.updateWorkers(workers); 
    });

    this.socket.on('newJob', (job) => {
      this.props.newJob(job);
      console.log('Web worker pool:', this.webWorkerPool);

      if (this.webWorkerPool !== null) {
        console.log('Assigning new job to an available web worker');
        let availableWorker = false;

        this.webWorkerPool.forEach( (worker) => {
          if (!worker.isBusy) {
            availableWorker = worker;
          }
        });

        if (availableWorker) {
          availableWorker.worker.postMessage(job);
          availableWorker.jobId = job.jobId;
          availableWorker.isBusy = true;
        } else {
          console.log('Error: no web workers available');
        }

      } else {

        console.log('This browser does not support Web Workers. Analysis will run in the main browser process, which may cause noticeable delays in browser performance.');

        var mapDataFunc = eval('(' + job.mapData + ')');
        job.result = mapDataFunc(job.data);

        console.log('Job complete. Result is: ', job.result);
        console.log('Sending result back to server');
        
        this.socket.emit('userJobDone', job);
      }
    });

    this.socket.on('finalResult', (final) => {
      this.props.finalResults(final); 
    });

    this.socket.on('updateAllProjects', (allProjectsUpdate) => {

      const projectList = [];
      const resultsList = {};

      allProjectsUpdate.map( (project) => {
        // Update the status of existing projects
        projectList.push({
          projectId: project.projectId,
          projectType: project.projectType,
          jobsLength: project.jobsLength,
          title: project.title,
          availableJobsNum: project.availableJobsNum,
          workers: project.workers,
          finalResult: project.finalResult
        });  

        // Update results of all projects
        resultsList[project.projectId] = project.completedJobs === null ? [] : project.completedJobs;
      });
      this.props.updateAllProjects(allProjectsUpdate);
      this.props.updateProjects(projectList);
      this.props.updateResults(resultsList);
    });

    const socketMethods = {
      socket: this.socket
    };
  }

  render() {
    return (
      <div className="app">
        <NavbarView auth={this.props.auth}/>

        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { createdSocket, 
      updateProjects,
      updateWorkers, 
      newJob, 
      completeJob, 
      sendCompleteJob, 
      updateResults, 
      finalResults,
      createWebWorkersPool,
      updateAllProjects 
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppView);