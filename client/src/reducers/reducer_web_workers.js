export default function (state = null, action) {
  switch (action.type){
    case 'CREATE_WEB_WORKER':
      return action.payload;
    default:
      return state;
  }
}