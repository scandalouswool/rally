//Need to find a way to have back-end emit the current 
//list of available projects to here

//This is hardcoded

export default function (state = null, action) {
  console.log('Insider reducer. Initial state is:', state);
  switch(action.type) {
    case 'ALL_PROJECTS':
      console.log('Receiving the projects list:', action.payload);
      return action.payload;

    default:
      return state;
  }

  return state;
}