export default function (state = [], action) {
  switch(action.type) {
    case 'ALL_PROJECTS':
      return action.payload;

    default:
      return state;
  }

  return state;
}