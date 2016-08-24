import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectProject } from '../actions/actions';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import SelectedProjectView from './SelectedProjectView';

class MenuView extends Component {

  renderList(status) {
    // 'status' is a boolean indicating whether projects
    // in list are complete (true if complete...)
    if (this.props.projects) {
      return this.props.projects.map((project) => {
        let name = `Project ${project.projectId.split('project')[1]}: ${project.title}`;
        if (project.complete === status) {
          return (
            <Link
              key={project.projectId}
              className="white"
              to="/project"
              onClick={() => this.props.selectProject(project)}>
              <button className="btn-success btn-sm">{name}</button>
            </Link>
          );
        }
      });
    }
  }

  render() {
    return (

      <div className="center-block">

        <div>
          <SelectedProjectView />
        </div>

        <div>
          <h3>Create a new project:</h3>
          <Link to="createProject" className="createProject white"><button className="btn-success btn-lg">Custom</button></Link>
          <Link to="createANNProject" className="createProject white"><button className="btn-success btn-lg">Custom Machine Learning Project</button></Link>
          <Link to="createNQueens" className="createProject white"><button className="btn-success btn-lg">n-Queens</button></Link>
          <Link to="createPrimes" className="createProject white"><button className="btn-success btn-lg">Prime-Finder</button></Link>
        </div>

        <div>
          <h3>View an existing project:</h3>

          <div className="container">
            <h4>In-progress</h4>
            <div>
              <ul className="list-group col-sm-4">
                {this.renderList(false)}
              </ul>
            </div>
          </div>

          <div className="container">
            <h4>Archived</h4>
            <div>
              <ul className="list-group col-sm-4">
                {this.renderList(true)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    allProjects: state.allProjects,
    projects: state.projects,
    project: state.selectedProject,
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectProject }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuView);
