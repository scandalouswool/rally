const Project = require('./Project.js');
const nqueensOptions = require('../projects/nQueens.js');

class ANNProject extends Project {
  test() {
    console.log('This is a test');
  }
}

const neuralProject = new ANNProject();

