const Job = require('../constructors/Job.js');
const Project = require('../constructors/Project.js');
const Worker = require('../constructors/Worker.js');

var results = [];

const testOptions = {
  dataSet: null,
  generateDataSet: () => {
    var dataSet = [];
    for (var i = 0; i < 2; i++) {
      dataSet.push( [i * 100000, i * 100000 + 99999]);
    }
    return dataSet;
  },  
  mapData: (min, max) => {
    const primeTester = (num) => {
      for (var i = 2; i < num - 1; i++) {
        if (num % i === 0) {
          return false;
        }
      }
      return true;
    };

    for (var i = min; i <= max; i++) {
      if (primeTester(i)) {
        result.push(i);
      }
    }
    console.log(result.length);
    return result;
  },
  reduceResult: (results) => {
    console.log(results);
  }
}