// Example of a distributed computing problem that uses the Rally API
// mapData and reduceResults functions may use lodash methods
const _ = require('lodash');

/*
  EXAMPLE USE CASE OF RALLY API

  The following example uses the Rally distributed computing system
  to generate an array of all prime numbers between 1 and 1,000,000.
  This example intentionally uses a brute-force algorithm.

  Rally uses Project constructor to instantiate new calculation projects.
  The Project constructor takes a single 'options' object, which has the 
  following structure:

    options = {
      title: STRING,
      dataSet: ARRAY,
      generateDataSet: FUNCTION,
      mapData: FUNCTION,
      reduceResults: FUNCTION
    }

  'dataSet' is an array of items that you wish to be used in the distributed
  calculation. dataSet can be an array of arrays. You can provide the dataSet
  in the options object, or provide a 'generateDataSet' function that can be
  used to generate the desired dataSet. At the moment, generateDataSet cannot
  take in any parameters.

  The Project constructor will use 'dataSet' or 'generateDataSet' to initialize
  the Jobs that are available for our workers. Project constructor defaults to
  using the dataSet array if both dataSet and generateDataSet are provided in options.

  mapData is a function that your workers will run on every item of dataSet.
  This function takes a single parameter (dataSubset) and returns the result
  of the mapData calculation. Client worker sends the result back to the 
  server to be stored in an array. The results will be stored in the same
  order of their input dataSet. Suppose that your mapData function simply 
  doubles every number it finds. Then your original dataSet of [1, 2, 3, 4]
  will create a results array of [2, 4, 6, 8].

  reduceResults is fun on the array of final results once all jobs have been
  completed. Using the above example, if the reduceResults function sums up
  all numbers in an array, the final result of the distributed calculation 
  will be 2 + 4 + 6 + 8, which is 20.
*/
const testOptions = {
  title: 'Primes',
  projectType: 'primes',

  dataSet: null,

  generateDataSet: () => {
    var dataSet = [];

    for (var i = 0; i < 20; i++) {
      dataSet.push( [i * 50000, i * 50000 + 49999]);
    }
    return dataSet;
  },  

  mapData: (dataSubset) => {
    const primeTester = (num) => {
      for (var i = 2; i < num - 1; i++) {
        if (num % i === 0) {
          return false;
        }
      }
      return true;
    };

    var min = dataSubset[0];
    var max = dataSubset[1];
    var result = [];

    for (var i = min; i <= max; i++) {
      if (primeTester(i)) {
        result.push(i);
      }
    }
    console.log('prime tester')
    console.log(result.length);
    return result;
  },

  reduceResults: (results) => {
    return _.flatten(results).length;
  }
}

module.exports = testOptions;