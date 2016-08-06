//begin worker constructor, projectId and socket as arguments

  this.projectId = projectId;
  this.workerId = socket.id;
  this.currentJob = null;
  this.socket = socket;

//export job constructor