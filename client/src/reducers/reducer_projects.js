export default function (state = [], action) {
  switch(action.type) {
    case 'ALL_PROJECTS':
      // console.log('Receiving the projects list:', action.payload);

      return action.payload;

    default:
      return state;
  }

  return state;
}