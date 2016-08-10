import {combineReducers} from 'redux';
import ProjectsList from './reducer_projects';
import SelectedProject from './reducer_selected_project';
import CreatedSocket from './reducer_socket_methods';

const rootReducer = combineReducers({
  projects: ProjectsList,
  selectedProject: SelectedProject,
  createdSocket: CreatedSocket
});

export default rootReducer;