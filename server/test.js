const testOptions = require('./projects/tester.js');
const Project = require('./constructors/Project.js');

var test = new Project({
  dataSet: undefined,
  generateDataSet: function() {
    return [1, 2, 3];
  }
});

console.log(test.availableJobs); 
console.log(test.jobsLength);