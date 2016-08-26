export default function (state = [], action) {
	switch (action.type){

		case 'NEW_JOB': 
			return action.payload;
		
    case 'COMPLETE_JOB': 
			return action.payload;
	
    default:
      return state;
  }
};