export default function (state = null, action) {
	switch (action.type){
		case 'NEW_JOB': 
			console.log('inside job reducer', action.payload); 
			return action.payload;
		case 'COMPLETE_JOB': 
			console.log('inside complete job', action.payload)
			return action.payload;
	}
	return state; 
}