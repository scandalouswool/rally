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
  // - 

  socket.on('updateWorkers', function(workers) {
    console.log('New workers list received:', workers);
  });

  socket.on('newJob', function(job) {
    console.log('Working on new job:', job);
    
    var result = findPrimes(job.data[0], job.data[1]);
    job.result = result;
    console.log('Job complete. Result is: ', result);
    console.log('Sending result back to server');
    socket.emit('userJobDone', job);

  });

  socket.on('updateResults', function(results) {
    console.log(results);
    $('#results').empty();

    results.forEach( function(item) {
      $('#results').append('<li>Found ' + item.length + ' primes!');
    });
  });

  socket.on('finalResult', function(final) {
    console.log('Received final results!');
    $('#results').append('<li>Final result! Found primes: ' + final.length);
  });

  sendReady();
});





