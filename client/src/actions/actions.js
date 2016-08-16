export function selectProject(project) {
  return {
    type: 'PROJECT_SELECTED',
    payload: project
  }
}

export function createdSocket(socket) {
  return {
    type: 'SOCKET_CREATED',
    payload: socket
  }
}

export function updateWorkers(workersList) {
	return {
		type: 'WORKERS_UPDATED',
		payload: workersList
	}
}

export function newJob(job) {
	return {
		type: 'NEW_JOB', 
		payload: job
	}
}

export function completeJob(job) {
	return {
		type: 'COMPLETE_JOB', 
		payload: job
	}
}

export function sendCompleteJob(socket, job) {
	return {
		type: 'SEND_COMPLETE_JOB', 
		payload: {socket, job}
	}
}

export function updateResults(results) {
	return {
		type: 'COMPLETED_RESULTS', 
		payload: results
	}
}

export function finalResults(final) {
	return {
		type: 'FINAL_RESULTS', 
		payload: final
	}
}

export function updateProjects(projects) {
  return {
    type: 'ALL_PROJECTS',
    payload: projects
  }
}

export function updateAllProjects(allProjectsUpdate) {
  return {
    type: 'UPDATE_ALL_PROJECTS',
    payload: allProjectsUpdate
  }
}

export function createWebWorkersPool(webWorkersPool) {
  return {
    type: 'CREATE_WEB_WORKER',
    payload: webWorkersPool
  }
}

// Adds firebase listener for changes to client's authentication state
export function startListeningToAuth(firebaseApp) {
  return (dispatch, getState) => {
    firebaseApp.auth().onAuthStateChanged((authData) => {
      // If firebase event is user logging in, set auth state to that user
      if (authData) {
        dispatch({
          type: 'LOGIN',
          uid: authData.uid,
          username: authData.displayName
        });
      // Otherwise, event is user logging out, so set state accordingly
      } else {
        dispatch({
          type: 'LOGOUT'
        });
      }
    });
  };
}

// Sets username on signup
export function setUsername(userIdentifiers) {
  return {
    type: 'LOGIN',
    uid: userIdentifiers.uid,
    username: userIdentifiers.username
  };
}
