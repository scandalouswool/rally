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

// TODO: updateWorkers
export function updateWorkers(workersList){
	return {
		type: 'WORKERS_UPDATED',
		payload: workersList
	}
}
// TODO: newJob

// TODO: updateResults

// TODO: finalResults

// TODO: allProjects