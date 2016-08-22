const Project = require('./Project.js');
const Job = require('./Job.js');
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

    this.availableJobs = ( () => {
      console.log('Using custom job creation method for ANN');
      const dataSet = this.dataSet || this.generateDataSet();
      const length = dataSet.length / 5;
      const trainingSets = [];

      // By default, create five trainingSets from dataSet
      for (var i = 0; i < 5; i++) {
        const newJob = new Job(dataSet.slice(i * length, (i + 1) * length), i, this.projectId);

        newJob.jobType = 'ANN';

        trainingSets.push(newJob);
      }
      console.log(trainingSets);
      return trainingSets;
    })();

    this.jobsLength = this.availableJobs.length;
  }
}

module.exports = ANNProject;









