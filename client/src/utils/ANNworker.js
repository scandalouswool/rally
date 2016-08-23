importScripts('/synaptic');

onmessage = (e) => {
  console.log('ANN Worker received a job', e.data);
  // console.log(JSON.parse(e.data.data));

  const synaptic = self.WorkerGlobalScope.synaptic;
  const Layer = synaptic.Layer;
  const Network = synaptic.Network;
  const Trainer = synaptic.Trainer;

  const network = Network.fromJSON(e.data.ANNNetwork);
  const trainingSet = e.data.data;
  const trainerOptions = e.data.trainerOptions;

  const trainer = new Trainer(network);
  
  const trainingResult = trainer.train(trainingSet, trainerOptions);

  const trainedNetwork = network.toJSON();

  console.log('Worker sending back data now');
  postMessage({
    trainingResult: trainingResult,
    trainedNetwork: trainedNetwork,
    workerId: e.data.workerId
  });
}
