import {combineReducers} from 'redux';
import AllProjectsUpdate from './reducer_all_projects';
import ANNJobPoolReady from './reducer_ANNJobPool';
import ProjectsList from './reducer_projects';
import SelectedProject from './reducer_selected_project';
import CreatedSocket from './reducer_socket_methods';
import UpdateWorkers from './reducer_workers';
import UpdateJob from './reducer_update_job';
import UpdateResults from './reducer_results';
import WebWorkersPool from './reducer_web_workers';
import Auth from './reducer_auth';
import PendingProjects from './reducer_pending_projects';
import UpdatedNetwork from './reducer_testing_results';

const rootReducer = combineReducers({
  allProjects: AllProjectsUpdate,
  projects: ProjectsList,
  selectedProject: SelectedProject,
  createdSocket: CreatedSocket,
  updateWorkers: UpdateWorkers,
  updateJob: UpdateJob,
  updateResults: UpdateResults,
  auth: Auth,
  webWorkersPool: WebWorkersPool,
  pendingProjects: PendingProjects,
  ANNJobPoolReady: ANNJobPoolReady,
  updatedNetwork: UpdatedNetwork
});

export default rootReducer;
