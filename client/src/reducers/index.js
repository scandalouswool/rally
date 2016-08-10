import {combineReducers} from 'redux';
import AlgorithmsList from './reducer_algorithms';
import SelectedAlgorithm from './reducer_selected_algorithm';

const rootReducer = combineReducers({
  algorithms: AlgorithmsList,
  selectedAlgorithm: SelectedAlgorithm

});

export default rootReducer;