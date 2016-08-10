//This needs to fire something off to the back-end 
//so the back-end knows the user wants to join that project

//state argument is not application state, only the state
//this reducer is responsible for
export default function (state = null, action) {
  switch(action.type) {
  case 'ALGORITHM_SELECTED':
    return action.payload;
  }

  return state;
}
