export default (state = {}, action) => {
  switch (action.type) {
    
    case 'UPDATE_ALL_PROJECTS':
      return action.payload;

    default:
      return state;
  }
};
