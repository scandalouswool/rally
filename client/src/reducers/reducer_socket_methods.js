export default function (state = null, action) {
  switch(action.type) {
  case 'SOCKET_CREATED':
    return action.payload;
  }

  return state;
}