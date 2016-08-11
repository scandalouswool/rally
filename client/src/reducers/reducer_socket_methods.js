export default function (state = null, action) {
  switch(action.type) {
  case 'SOCKET_CREATED':
    console.log(state);
    console.log(action.payload);
    return action.payload;

  case 'SEND_COMPLETE_JOB':
 	  console.log('inside socket method reducer', action.payload)
  	action.payload.socket.emit('userJobDone', action.payload.job)
  	return state; 

  case 'CREATE_PROJECT':
    console.log('Sending project to the server');
    state.emit('createProject', action.payload);

  }
  return state;
}