7uyhb # Project Name

> Rally - Building A Distributed Network With Your Browser


## Table of Contents

1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
1. [Team](#team)
1. [Notes for Development Team](#notes-for-development-team)

## Team

  - Development Team Members: Frank Lee, Edmund To, Leah Loversky, Clay Han

## Requirements

- Node 4.4.7
- PostgreSQL or MySQL

### Installing Dependencies

Install all npm dependencies.
```sh
npm install
```

Create client/src/environment/ folder with a file called environment.js. Add the following code to environment.js, replacing empty strings with firebase config variables:
```sh
const ENV = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  storageBucket: ''
};

export { ENV };
```

Initiate webpack.
```sh
npm run build: dev
```

Launch mysql server and create a database named 'rally' using mysql as the root user:
mysql start
mysql -u root -p
create database rally;

Open the server with Nodemon.
```sh
npm start
```

## Testing

1. To add new tests, create a file containing your tests in 'client/src/tests/' 
   with the suffix '-test' (see existing files for examples)
2. To execute tests, run 'npm test' from the command line
3. Note: Karma will launch and close Chrome each time you run the tests; this typically
   takes about 10 seconds. If you'd like Chrome to stay open, change the 'singleRun' 
   option to false in karma.conf.js

## Notes for Development Team

1. Socket event handlers for server:
  - 'disconnect': user disconnected its socket connection
  - 'userReady': user is ready to receive Job
  - 'userDisconnect': user leaves a project
  - 'userJobDone': user sent back a finished Job
  - 'createProject': need to instantiate a new Project
  - 'getAllProjects': user is requesting list of all Projects
  - 'error'

2. Socket event handlers for client:
  - 'newJob': received new Job from server
  - 'updateWorkers': received list of all workers
  - 'updateResults': received array of all results so far
  - 'finalResult': Project has concluded and received final result 
  - 'allProjects': received a list of all project IDs from server