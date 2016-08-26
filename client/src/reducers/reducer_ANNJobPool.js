export default function (state = [], action) {
  switch(action.type) {
    
    case 'ANN_JOBPOOL_READY':
      return action.payload; 
  
    default:
      return state;
  }
};