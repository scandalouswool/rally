// Example of a distributed computing problem that uses the Rally API
// mapData and reduceResults functions may use lodash methods
const _ = require('lodash');

const testOptions = {
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
    console.log(result.length);
    return result;
  },
  reduceResults: (results) => {
    return _.flatten(results);
  }
}

module.exports = testOptions;