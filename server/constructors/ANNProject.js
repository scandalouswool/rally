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
  constructor(options) {
    super(options);
    
    // ANNProject class only supports Perceptron network architecture
    this.perceptron = new Architect.Perceptron(options.inputLayer, ...options.hiddenLayer, options.outputLayer);

    this.trainerOptions = options.trainerOptions;
  }

  train() {
    this.perceptron.trainer.train(this.trainerOptions);
  }
}


// Tests
// const irisOptions = require('../projects/iris.js');

// const neuralProject = new ANNProject(irisOptions);
// const trainer = new Trainer(neuralProject.perceptron);
// console.log(neuralProject.trainerOptions);
// const result = trainer.train(neuralProject.dataSet, neuralProject.trainerOptions);
// console.log(result);

