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
         createWebWorker,
         updateAllProjects
       } from '../actions/actions';

export default class AppView extends Component {
  constructor(props) {
    super(props);
    this.socket = io();
  }

  componentWillMount() {
    /************************************************
    // Web Worker Handlers
    ************************************************/

    //initialize a variable for a webWorker
    let myWebWorker = null;

    //this checks if your computer can run web workers, Worker is a global variable that is native to the browser
    if (typeof(Worker) !== 'undefined') {
      console.log('Initializing new Web Worker');
      //initialize a web worker based on webWorker.js in the client folder
      myWebWorker = new Worker('/webworker');
    } else {
      console.log('This browser does not support Web Workers. The main browser process will perform the calculations, which will likely cause noticeable delays.');
    }

    // myWebWorker will send back a Job object with the 
    // data field populated. Send this object to the server
    myWebWorker.onmessage = (event) => {
      console.log('Sending completed job to server');
      const job = event.data;
      this.socket.emit('userJobDone', job);
    };

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

      if (myWebWorker !== null) {
        console.log('Web Worker assigned to the new job!');
        myWebWorker.postMessage(job);
      } else {
        console.log('This browser does not support Web Workers. mapData will run in the main browser process.');

        var mapDataFunc = eval('(' + job.mapData + ')');
        job.result = mapDataFunc(job.data);

        console.log('Job complete. Result is: ', job.result);
        console.log('Sending result back to server');
        
        this.socket.emit('userJobDone', job);
      }
      console.log('Updating job in newJob: ', job);
    });

    // this.socket.on('updateResults', (results) => {
    //   this.props.updateResults(results); 
    // });

    this.socket.on('finalResult', (final) => {
      this.props.finalResults(final); 
    });

    // this.socket.on('updateProjects', (projects) => {
    //   this.props.updateProjects(projects);
    // });

    this.socket.on('updateAllProjects', (allProjectsUpdate) => {
      console.log('Received updated site info:', allProjectsUpdate);

      const update = allProjectsUpdate;
      
      const projectList = [];
      const resultsList = {};

      update.map( (project) => {
        // Update the status of existing projects
        projectList.push({
          projectId: project.projectId,
          projectType: project.projectType,
          jobsLength: project.jobsLength,
          title: project.title,
          availableJobsNum: project.availableJobsNum
        });  

        // Update results of all projects
        resultsList[project.projectId] = project.completedJobs === null ? [] : project.completedJobs;
      });
      
      this.props.updateAllProjects(update);
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
    webWorker: createWebWorker,
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
      createWebWorker,
      updateAllProjects 
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppView);