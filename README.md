# rally
Building a Distributed Network With Your Browser

## Instructions to Run

1. Run npm build:dev
2. Run npm start

## Notes for Development Team:

1. Socket event handlers for server:
  - 'disconnect': user disconnected its socket connection
  - 'userReady': user is ready to receive Job
  - 'userJobDone': user sent back a finished Job
  - 'createProject': need to instantiate a new Project
  - 'error'

2. Socket event handlers for client:
  - 'newJob': received new Job from server
  - 'updateWorkers': received list of all workers
  - 'updateResults': received array of all results so far
  - 'finalResult': Project has concluded and received final result