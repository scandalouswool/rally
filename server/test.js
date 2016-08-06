const testOptions = require('./projects/tester.js');
const Project = require('./constructors/Project.js');
const Worker = require('./constructors/Worker.js');

var testProject = new Project({
  dataSet: undefined,
  generateDataSet: function() {
    return [1, 2, 3];
  }
});

var testWorker = new Worker(123, {
  id: 'hello',
  emit: (event, msg) => {
    console.log('Event:', event);
    console.log('Msg:', msg);
  }
});
console.log(testWorker);
testProject.assignJob(testWorker);
console.log(testWorker); // should have currentJob 
testProject.assignJob(testWorker);
console.log(testWorker);