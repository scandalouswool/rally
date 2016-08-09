import {combineReducers} from 'redux';
import AlgorithmsList from './reducer_algorithms';

const rootReducer = combineReducers({
  algorithms: AlgorithmsList
});

export default rootReducer;