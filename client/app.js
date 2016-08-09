$(document).ready(function() {
  /************************************************
  // Socketing
  ************************************************/
  var socket = io();

  var sendReady = function() {
    // Hard coded for now - eventually generate from server
    // and send to client for storage
    var projectId = 0;  
    socket.emit('userReady', projectId);
  }

  // Client must be able to handle the following events:
  // - newJob
  // - updateWorkers
  // - updateResults
  // - finalResult

  socket.on('updateWorkers', function(workers) {
    console.log('New workers list received:', workers);
  });

  socket.on('newJob', function(job) {
    
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
      
      socket.emit('userJobDone', job);
    }

  });

  socket.on('updateResults', function(results) {
    console.log(results);
    $('#nQueensSolutions').empty();

    results.forEach( function(item) {
      if (item !== null) {
        $('#nQueensSolutions').append('<li>Worker found ' + item + ' solutions!');        
      }

    });
  });

  socket.on('finalResult', function(final) {
    console.log('Received final results!');
    $('#nQueensSolutions').append('<li>Final nQueens result after applying the mirror-image algorithm: ' + final);
  });

  /************************************************
  // Web Worker
  ************************************************/
  
  //initialize a variable for a webWorker
  var myWebWorker = null;

  //this checks if your computer can run web workers, Worker is a global variable that is native to the browser
  if (typeof(Worker) !== 'undefined') {
    console.log('Initializing new Web Worker');
    //initialize a web worker based on webWorker.js in the client folder
    myWebWorker = new Worker('webWorker.js');
  } else {
    console.log('This browser does not support Web Workers. The main browser process will perform the calculations, which will likely cause noticeable delays.');
  }

  // myWebWorker will send back a Job object with the 
  // data field populated. Send this object to the server
  myWebWorker.onmessage = function(event) {
    var job = event.data;
    socket.emit('userJobDone', job);
  }

  sendReady();

});





