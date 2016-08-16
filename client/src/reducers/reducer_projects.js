//Need to find a way to have back-end emit the current 
//list of available projects to here

//This is hardcoded

export default function (state = [], action) {
  switch(action.type) {
    case 'ALL_PROJECTS':
      console.log('Receiving the projects list:', action.payload);

      return action.payload;

    default:
      return state;
  }

  return state;
}