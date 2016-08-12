export default (state, action) => {
  switch (action.type) {
    case 'ATTEMPTING_LOGIN':
      console.log('Login attempted');
      return { // These will be intended values of redux state
      };

    case 'LOGIN':
      console.log('Attempting login: ', action.username, action.uid);
      return {
        currently: 'LOGGED_IN',
        username: action.username,
        uid: action.uid
      };

    case 'LOGOUT':
      console.log('Logging out!');
      return {
        currently: 'LOGGED_OUT',
        username: 'guest',
        uid: null
      };

    default:
      return state || {
        currently: 'ANONYMOUS',
        username: 'guest',
        uid: null
      };
      
    default: return state || null;
  }
};
