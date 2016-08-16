export default function (state = null, action) {
  switch (action.type){
    case 'CREATE_WEB_WORKER': 
      console.log('Created web worker', action.payload);
      return action.payload;
    default:
      return state;
  }
}