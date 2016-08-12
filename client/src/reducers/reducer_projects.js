//Need to find a way to have back-end emit the current 
//list of available projects to here

//This is hardcoded

export default function (state = null, action) {
  switch(action.type) {
    case 'ALL_PROJECTS':
      console.log('Receiving the projects list:', action.payload);

      const newState = action.payload.map( (project) => {
        return {
          projectId: project.projectId,
          projectType: project.projectType,
          title: project.title
        }
      });

      console.log(newState);

      return newState;

    default:
      return state;
  }

  return state;
}