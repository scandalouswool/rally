export default function (state = [], action) {
	switch(action.type){
		case 'COMPLETED_RESULTS': 
			console.log('inside completed results', action.payload)  
		  return action.payload;
		
    case 'FINAL_RESULTS': 
			console.log('inside final result reducer', action.payload)
		  return action.payload;

    default: 
      return state; 	
	}	
	return state; 
}