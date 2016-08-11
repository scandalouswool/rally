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
          title: project.title,
          mapData: eval(project.mapData),
          reduceResults: eval(project.reduceResults)
        }
      });

      console.log(newState);

      return newState;

    default:
      return state;
  }

  return state;
}