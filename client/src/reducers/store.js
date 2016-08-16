import {combineReducers} from 'redux';
import AllProjectsUpdate from './reducer_all_projects';
import ProjectsList from './reducer_projects';
import SelectedProject from './reducer_selected_project';
import CreatedSocket from './reducer_socket_methods';
import UpdateWorkers from './reducer_workers';
import UpdateJob from './reducer_update_job';
import UpdateResults from './reducer_results';
import WebWorker from './reducer_web_workers';
import Auth from './reducer_auth';

const rootReducer = combineReducers({
  allProjects: AllProjectsUpdate,
  projects: ProjectsList,
  selectedProject: SelectedProject,
  createdSocket: CreatedSocket,
  updateWorkers: UpdateWorkers,
  updateJob: UpdateJob,
  updateResults: UpdateResults,
  auth: Auth,
  webWorker: WebWorker
});

export default rootReducer;
