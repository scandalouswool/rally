export default function (state = null, action) {
  switch (action.type) {
  case 'SOCKET_CREATED':
    return action.payload;

  case 'SEND_COMPLETE_JOB':
    action.payload.socket.emit('userJobDone', action.payload.job);
    return state;

  default:
    return state;
    
  }
};
