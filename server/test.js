const testOptions = require('./projects/tester.js');
const Project = require('./constructors/Project.js');
const Worker = require('./constructors/Worker.js');

var testProject = new Project({
  dataSet: null,
  generateDataSet: () => {
    return [1, 2, 3];
  },
  reduceResults: (dataSet) => {
    return dataSet.reduce( (acc, next) => {
      return acc + next;
    }, 0);
  }  
}, 'testProject');

testProject.completedJobs = [2, 4, 6];
testProject.completeProject();
console.log(testProject.finalResult); // 12