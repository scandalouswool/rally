// This is the reducer to set the state of pending projects
export default function (state = {}, action) {
  switch (action.type) {
    case 'UPDATE_PENDING_PROJECTS':
      return action.payload;

    default:
      return state;
  }
}
