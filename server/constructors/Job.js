//begin job constructor, takes item (job data), index, projectId as arguments
class Job {
  constructor(index, projectId, item) {
    this.jobId = index;
    this.projectId = projectId;
    this.data = item;
    this.result = null; 
  }
}

//export job constructor
module.exports = Job;