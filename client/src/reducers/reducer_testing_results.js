export default function (state = [], action) {
  switch (action.type) {
    case 'UPDATE_TEST_RESULT':
     console.log('Updating ANN test results', action.payload);
     return action.payload;
    default: 
     return state;
  }
  return state;
}