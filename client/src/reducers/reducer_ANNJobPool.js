export default function (state = [], action) {
  switch(action.type) {
    case 'ANN_JOBPOOL_READY':
      console.log('ANN JOB POOL: ', action.payload);
      return action.payload; 
  }
  return state;
}