export default function (state = [], action) {
	switch(action.type){
		case 'WORKERS_UPDATED':
			console.log('inside workers reducer', action.payload); 
			return action.payload; 
	  default:
      return state;
  }
}