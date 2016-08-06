//begin worker constructor, projectId and socket as arguments
class Worker {
  constructor(projectId, socket) {
    this.projectId = projectId;
    this.workerId = socket.id;
    this.socket = socket;
    this.currentJob = null;
  }
}
//export job constructor
module.exports = Worker;