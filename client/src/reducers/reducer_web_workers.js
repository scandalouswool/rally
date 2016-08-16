export default function (state = null, action) {
  switch (action.type){
    case 'CREATE_WEB_WORKER': 
      console.log('Inside WW reducer: ', action.payload);
      return action.payload;
    default:
      return state;
  }
}