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
         finalResults
       } from '../actions/actions';

export default class AppView extends Component {
  constructor() {
    super();
    this.socket = io();
  }

  componentWillMount() {
    console.log('This is the socket state: ', this.socket);

    const sendReady = () => {
      // Hard coded for now - eventually generate from server
      // and send to client for storage
      var projectId = 'project0';  
      this.socket.emit('userReady', projectId);
    }

    // Client must be able to handle the following events:
    // - newJob
    // - updateWorkers
    // - updateResults
    // - finalResult
    // - connect
    this.socket.on('connect', () => {
      // this.props.createdSocket(this.socket);
    });

    this.socket.on('updateWorkers', (workers) => {
      this.props.updateWorkers(workers); 
    });

    this.socket.on('newJob', (job) => {
      this.props.newJob(job)
      // //if myWebWorker is not null, that means we were able to create it
      // if (myWebWorker !== null) {
      //   console.log('Web Worker assigned to the new job!');
      //   //send the job item to the web worker, postMessage sends a message to the web worker
      //   myWebWorker.postMessage(job);
      // } else {
      //   console.log('This browser does not support Web Workers. mapData will run in the main browser process.');

      //   var mapDataFunc = eval('(' + job.mapData + ')');
      //   job.result = mapDataFunc(job.data);

      //   console.log('Job complete. Result is: ', job.result);
      //   console.log('Sending result back to server');
        
      //   this.socket.emit('userJobDone', job);
      // }
      //console.log('Updating job in newJob: ', job);

      // const that = this;

      setTimeout(() => {
        console.log('Sending finished job');
        job.result = [];
        this.socket.emit('userJobDone', job);
      }, 2000);
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
      console.log('Receiving new projects:', projects);
      this.props.updateProjects(projects);
    });

    // setTimeout(() => sendReady(), 2000);
    const socketMethods = {
      socket: this.socket,
      sendReady: sendReady
    }

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


// function mapStateToProps(state) {
//   return {

//   }
// }

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { createdSocket, 
      updateProjects,
      updateWorkers, 
      newJob, 
      completeJob, 
      sendCompleteJob, 
      updateResults, 
      finalResults 
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(AppView);