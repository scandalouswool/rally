export default function (state = [], action) {
	switch(action.type){
		case 'COMPLETED_RESULTS': 
			console.log('inside completed results', action.payload)
      let nextState = action.payload.map( (item) => {
        if (item === null) {
          console.log('Null result found');
          return [];
        } else {
          return item;
        }
      });

		  return nextState;
		
    case 'FINAL_RESULTS': 
			console.log('inside final result reducer', action.payload)
		  return action.payload;

    default: 
      return state; 	
	}	
	return state; 
}