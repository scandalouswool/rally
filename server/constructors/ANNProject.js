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

    this.network = this.perceptron.trainer.network.toJSON();

    this.trainerOptions = options.trainerOptions;

    // this.dataSet = options.dataSet ? JSON.parse(options.dataSet) : this.generateDataSet()

    this.availableJobs = ( () => {
      console.log('Using custom job creation method for ANN');
      const dataSet = JSON.parse(this.dataSet) || this.generateDataSet();
      const length = dataSet.length / 5;
      const trainingSets = [];

      // By default, create five trainingSets from dataSet
      for (var i = 0; i < 5; i++) {
        const newJob = new Job(dataSet.slice(i * length, (i + 1) * length), i, this.projectId);

        newJob.jobType = 'ANN';
        newJob.ANNNetwork = this.network;
        newJob.trainerOptions = this.trainerOptions;

        trainingSets.push(newJob);
      }

      return trainingSets;
    })();

    this.testSet = ( () => {
      // TODO: implement a better way to get testSet
      return JSON.parse(this.dataSet).slice(-10);
    })();

    this.jobsLength = this.availableJobs.length;
  }

  testNetwork(trainedNetwork) {
    // console.log('ANNProject running tests on trained network', trainedNetwork);
    // console.log(this.testSet);
    // this.testSet.forEach( (set) => {
    //   console.log(trainedNetwork.activate(set.input));
    // });

    const trainer = new Trainer(trainedNetwork);
    console.log('New trainer:', trainer);
    console.log('Test set:', this.testSet);
    console.log('Trainer options:', this.trainerOptions);
    const result = trainer.test(this.testSet, this.trainerOptions)
    console.log(result);

    return;
  }
}

module.exports = ANNProject;









