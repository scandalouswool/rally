export default function (state = [], action) {
	switch(action.type){
		case 'COMPLETED_RESULTS': 
      let nextState = action.payload;
      
      for (var key in nextState) {
        nextState[key].map( (item) => {
          if (item === null) {
            console.log('Null result found');
            return [];
          } else {
            return item;
          }
        });
      }
      console.log('Results:', nextState);
		  return nextState;
		
    case 'FINAL_RESULTS':
		  return action.payload;

    default: 
      return state; 	
	}	
	return state; 
}