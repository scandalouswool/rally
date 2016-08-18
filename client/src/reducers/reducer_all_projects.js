export default (state = {}, action) => {
  switch (action.type) {

    case 'UPDATE_ALL_PROJECTS':
      // console.log('Updating all projects information');
      return action.payload;

    default:
      return state;
  }
};
