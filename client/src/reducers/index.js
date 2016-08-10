import {combineReducers} from 'redux';
import ProjectsList from './reducer_projects';
import SelectedProject from './reducer_selected_project';
import CreatedSocket from './reducer_socket_methods';
import UpdateWorkers from './reducer_workers';  

const rootReducer = combineReducers({
  projects: ProjectsList,
  selectedProject: SelectedProject,
  createdSocket: CreatedSocket,
  updateWorkers: UpdateWorkers
});

export default rootReducer;