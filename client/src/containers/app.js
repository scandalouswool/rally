import React, { Component } from 'react';
import io from 'socket.io-client';
import Navbar from '../components/navbar';

export default class App extends Component {
  constructor() {
    super();
    this.socket = io();
  }

  componentDidMount() {
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

    this.socket.on('updateWorkers', (workers) => {
      // console.log('New workers list received:', workers);
      console.log('Updating workers in updateWorkers: ', workers);
    });

    this.socket.on('newJob', (job) => {
      
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
      console.log('Updating job in newJob: ', job);

      // const that = this;

      setTimeout(() => {
        console.log('Sending finished job');
        job.result = [];
        this.socket.emit('userJobDone', job);
      }, 2000);
    });

    this.socket.on('updateResults', (results) => {
      // console.log(results);
      // $('#nQueensSolutions').empty();

      // results.forEach( function(item) {
      //   if (item !== null) {
      //     $('#nQueensSolutions').append('<li>Worker found ' + item + ' solutions!');        
      //   }

      // });
      console.log('Updating results in updateResults: ', results);
    });

    this.socket.on('finalResult', (final) => {
      // console.log('Received final results!');
      // $('#nQueensSolutions').append('<li>Final nQueens result after applying the mirror-image algorithm: ' + final);
      console.log('Updating finalResult: ', final);
    });

    setTimeout(() => sendReady(), 2000);

  }

  render() {
    return (
      <div className='app'>
        <Navbar />
      
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

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ selectAlgorithm: selectAlgorithm }, dispatch)
// }

// export default connect(mapStateToProps, mapDispatchToProps)(App);