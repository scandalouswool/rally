const Project = require('./Project.js');
const Synaptic = require('synaptic');

const Architect = Synaptic.Architect;
const Layer = Synaptic.Layer;
const Network = Synaptic.Network;
const Trainer = Synaptic.Trainer;

const nqueensOptions = require('../projects/nQueens.js');

class ANNProject extends Project {
  /*
    Options for ANN projects need:
    {
      inputLayer: NUMBER,
      hiddenLayer: ARRAY OF NUMBERS,
      outputLayer: NUMBER,
      trainerOptions: {
        rate: NUMBER,
        iterations: NUMBER,
        error: NUMBER,
        shuffle: BOOLEAN,
        log: NUMBER,
        cost: STRING
      }
    }

  */
  constructor(options, projectId) {
    super(options, projectId);
    // ANNProject class only supports Perceptron network architecture
    this.perceptron = new Architect.Perceptron(options.inputLayer, ...options.hiddenLayer, options.outputLayer);

    this.trainerOptions = options.trainerOptions;
  }

  assignJob(worker) {
    console.log('Assigning training sets for ANN project');
    const trainingSet = [];

    for (var i = 0; i < this.jobsLength / 5; i++) {
      if (this.availableJobs.length > 0) {
        let newJob = this.availableJobs.shift();
        newJob.workerId = worker.workerId;
        newJob.jobsLength = this.jobsLength;
        worker.currentJob.push(newJob);
      
        trainingSet.push(newJob);
      }
    }

    // Alternate timer
    if (this.timer.state() === 'clean' || this.timer.state() === 'stopped') {
      this.timer.start();
    }
    console.log(trainingSet.length);
    return trainingSet;
  }
}

module.exports = ANNProject;









