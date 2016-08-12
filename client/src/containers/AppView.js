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
         createWebWorker
       } from '../actions/actions';

export default class AppView extends Component {
  constructor() {
    super();
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

    const sendReady = () => {
      // Hard coded for now - eventually generate from server
      // and send to client for storage
      var projectId = 'project0';  
      this.socket.emit('userReady', projectId);
    };

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

      //if myWebWorker is not null, that means we were able to create it
      if (myWebWorker !== null) {
        console.log('Web Worker assigned to the new job!');
        //send the job item to the web worker, postMessage sends a message to the web worker
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

    this.socket.on('updateResults', (results) => {
      this.props.updateResults(results); 
      // Send action updateResults

      // console.log(results);
      // $('#nQueensSolutions').empty();

      // results.forEach( function(item) {
      //   if (item !== null) {
      //     $('#nQueensSolutions').append('<li>Worker found ' + item + ' solutions!');        
      //   }

      // });
      //console.log('Updating results in updateResults: ', results);
    });

    this.socket.on('finalResult', (final) => {
      // Send action 'finalResult'
      this.props.finalResults(final); 
      // console.log('Received final results!');
      // $('#nQueensSolutions').append('<li>Final nQueens result after applying the mirror-image algorithm: ' + final);
      //console.log('Updating finalResult: ', final);
    });

    this.socket.on('updateProjects', (projects) => {
      // Send action 'updateProjects'
      this.props.updateProjects(projects);
    });

    // setTimeout(() => sendReady(), 2000);
    const socketMethods = {
      socket: this.socket,
      sendReady: sendReady
    };    
  }

  render() {
    return (
      <div className='app'>
        <NavbarView />
      
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    webWorker: createWebWorker
  }
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
      createWebWorker 
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppView);