export default function (state = null, action) {
	switch(action.type){
		case 'COMPLETED_RESULTS': 
			console.log('inside completed results', action.payload)
		return action.payload;
		case 'FINAL_RESULTS': 
			console.log('inside final result reducer', action.payload)
		return action.payload; 	
	}	
	return state; 
}