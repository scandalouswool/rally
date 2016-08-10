export default function (state = null, action) {
  switch(action.type) {
  case 'SOCKET_CREATED':
    action.payload.emit('userReady', 'project0');
    return action.payload;
  case 'SEND_COMPLETE_JOB':
 	  console.log('inside socket method reducer', action.payload)
  	action.payload.socket.emit('userJobDone', action.payload.job)
  	return action.payload.socket; 
  }

  return state;
}