export default function (state = null, action) {
  switch(action.type) {
  case 'SOCKET_CREATED':
    action.payload.emit('userReady');
    return action.payload;
  }

  return state;
}