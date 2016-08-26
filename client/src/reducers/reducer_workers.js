export default function (state = [], action) {
	switch(action.type){
		
    case 'WORKERS_UPDATED':
			return action.payload; 
	  
    default:
      return state;
  }
};