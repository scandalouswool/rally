const testOptions = require('./projects/tester.js');
const Project = require('./constructors/Project.js');
const Worker = require('./constructors/Worker.js');

var testProject = new Project({
  dataSet: null,
  generateDataSet: function() {
    return [1, 2, 3];
  }
});

testProject.createWorker(123, {
  id: 'testWorker1',
  emit: (event, msg) => {
    console.log('Emitting new message');
    console.log('Event:', event);
    console.log('Msg:', msg);
  }
});

testProject.createWorker(123, {
  id: 'testWorker2',
  emit: (event, msg) => {
    console.log('Emitting new message');
    console.log('Event:', event);
    console.log('Msg:', msg);
  }
});