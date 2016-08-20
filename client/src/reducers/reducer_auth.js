export default (state, action) => {
  let whiteList = ['Leah', 'Edmund', 'Frank', 'Clay'];
  switch (action.type) {

    case 'LOGIN':
      return {
        currently: 'LOGGED_IN',
        username: action.username,
        uid: action.uid,
        whiteList: whiteList
      };

    case 'LOGOUT':
      return {
        currently: 'GUEST',
        username: 'Guest',
        uid: null,
        whiteList: whiteList
      };

    default:
      return state || {
        currently: 'GUEST',
        username: 'Guest',
        uid: null,
        whiteList: whiteList
      };
  }
};
