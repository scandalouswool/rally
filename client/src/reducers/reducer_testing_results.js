export default function (state = [], action) {
  switch (action.type) {

    case 'UPDATE_TEST_RESULT':
     return action.payload;
    
    default: 
     return state;
  }
};