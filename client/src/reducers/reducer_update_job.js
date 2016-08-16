export default function (state = [], action) {
	switch (action.type){
		case 'NEW_JOB': 
			console.log('inside new job reducer', action.payload); 
			return action.payload;
		case 'COMPLETE_JOB': 
			console.log('inside complete job reducer', action.payload)
			return action.payload;
	}
	return state; 
}