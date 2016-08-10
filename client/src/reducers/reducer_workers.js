export default function (state = null, action) {
	switch(action.type){
		case 'WORKERS_UPDATED':
			console.log('inside workers reducer', action.payload); 
			return action.payload; 
	}
	return state; 
}