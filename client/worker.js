/*
  ==================
  WEB WORKER HANDLER
  ==================
*/

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

onmessage = function(event) {
  console.log('Web Worker received data from the main script');
  var job = event.data;
  console.log(job);
  var result = findPrimes(job.data[0], job.data[1]);
  job.result = result;
  console.log('Job complete. Result is: ', result);
  console.log('Sending result back to server');
  postMessage(job);
}