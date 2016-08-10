import {combineReducers} from 'redux';
import AlgorithmsList from './reducer_algorithms';
import SelectedAlgorithm from './reducer_selected_algorithm';
import CreatedSocket from './reducer_socket_methods';

const rootReducer = combineReducers({
  algorithms: AlgorithmsList,
  selectedAlgorithm: SelectedAlgorithm,
  createdSocket: CreatedSocket
});

export default rootReducer;