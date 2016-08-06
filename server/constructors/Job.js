//begin job constructor, takes item (job data), index, projectId as arguments
class Job {
  constructor(item, index, projectId) {
    this.jobId = index;
    this.projectId = projectId;
    this.workerId = null;
    this.data = item;
    this.result = null; 
  }
}

//export job constructor
module.exports = Job;