importScripts('/synaptic');

onmessage = (e) => {
  console.log('ANN Worker received a job');
  // Testing promises-based worker handling system
  setTimeout( () => {
    postMessage('done');
  }, Math.floor(Math.random() * 3000));

  // console.log('Web Worker beginning work');
  // const synaptic = self.WorkerGlobalScope.synaptic;
  // const Layer = synaptic.Layer;
  // const Network = synaptic.Network;
  // const Trainer = synaptic.Trainer;

  // const network = Network.fromJSON(e.data.network);
  // const trainingSet = e.data.trainingSet;
  // const trainingOptions = e.data.trainingOptions;

  // const trainer = new Trainer(network);
  
  // const trainingResult = trainer.train(trainingSet, trainingOptions);

  // const trainedNetwork = network.toJSON();

  // // console.log('Worker sending back data now');
  // postMessage({
  //   trainingResult: trainingResult,
  //   trainedNetwork: trainedNetwork,
  //   workerId: e.data.workerId
  // });
}
