export default function (state = null, action) {
  switch (action.type){
    case 'CREATE_WEB_WORKER': 
      console.log(action.payload);
      return action.payload;
  }
  return state; 
}