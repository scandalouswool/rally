$(document).ready(function() {

  /************************************************
  // Function that finds primes between two values
  ************************************************/
  var findPrimes = function(min, max) {
    var primeTester = function(n) {
      for (var i = 2; i < n - 1; i++) {
        if (n % i === 0) {
          return false;
        }
      }
      return true;
    };

    var result = [];
    for (var i = min; i <= max; i++) {
      if (primeTester(i)) {
        result.push(i);
      }
    }
    return result;
  }

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
    
    if (myWebWorker !== null) {
      console.log('Web Worker assigned to the new job!');
      myWebWorker.postMessage(job);

    } else {
      console.log('This browser does not support Web Workers. mapData will run in the main browser process.');
      var result = findPrimes(job.data[0], job.data[1]);
      job.result = result;
      console.log('Job complete. Result is: ', result);
      console.log('Sending result back to server');
      socket.emit('userJobDone', job);
    }

  });

  socket.on('updateResults', function(results) {
    console.log(results);
    $('#results').empty();

    results.forEach( function(item) {
      if (item !== null) {
        $('#results').append('<li>Found ' + item.length + ' primes!');        
      }

    });
  });

  socket.on('finalResult', function(final) {
    console.log('Received final results!');
    $('#results').append('<li>Final result! Found primes: ' + final.length);
  });

  /************************************************
  // Web Worker
  ************************************************/
  var myWebWorker = null;

  if (typeof(Worker) !== 'undefined') {
    console.log('Initializing new Web Worker');
    myWebWorker = new Worker('worker.js');
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





