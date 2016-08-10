export default function (state=null, action) {
  switch(action.type) {
    case 'SOCKET':
      return action.payload
  }
  return state;
}