//Need to find a way to have back-end emit the current 
//list of available projects to here

//This is hardcoded

export default function (state = {}, action) {
  switch(action.type) {
    case 'ALL_PROJECTS':
      console.log('Receiving the projects list:', action.payload);

      const newState = action.payload.map( (project) => {
        return {
          projectId: project.projectId,
          projectType: project.projectType,
          jobsLength: project.jobsLength,
          title: project.title
        }
      });

      return newState;

    default:
      return state;
  }

  return state;
}