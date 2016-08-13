export default (state, action) => {
  switch (action.type) {

    case 'LOGIN':
      return {
        currently: 'LOGGED_IN',
        username: action.username,
        uid: action.uid
      };

    case 'LOGOUT':
      return {
        currently: 'GUEST',
        username: 'Guest',
        uid: null
      };

    default:
      return state || {
        currently: 'GUEST',
        username: 'Guest',
        uid: null
      };
  }
};
