# Project Name

> Rally - Building A Distributed Network With Your Browser

## Team

  - Development Team Members: Frank Lee, Edmund To, Leah Loversky, Clay Han

## Table of Contents

1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
1. [Team](#team)

## Requirements

- Node 4.4.7
- PostgreSQL or MySQL

### Installing Dependencies

Install all npm dependencies.
```sh
npm install
```

Initiate webpack.
```sh
npm run build: dev
```

Open the server with Nodemon.
```sh
npm start
```

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