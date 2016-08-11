export default (state, action) => {
  switch (action.type) {
    case 'ATTEMPTING_LOGIN':
      console.log('Login attempted');
      return { // These will be intended values of redux state
      };
    case 'LOGIN_USER':
      return { // These will be intended values of redux state
      };
    default: return state || null;
  }
};
