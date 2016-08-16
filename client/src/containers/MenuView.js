import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectProject } from '../actions/actions';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import SelectedProjectView from './SelectedProjectView';

class MenuView extends Component {

  renderList() {

    if (this.props.projects) {

      return this.props.projects.map( (project) => {
        return (

          <Link key={project.projectId} className="white" to="/project" onClick={() => this.props.selectProject(project) }>
            <button className="btn-success btn-sm">
                {project.title}
            </button>
          </Link>
        );
      });
    }
  }

  render() {
    return (

      <div className="center-block">
        <Link to="createProject" className="white"><button className="btn-success btn-lg">Create New Project</button></Link>
        <Link to="createNQueens" className="white"><button className="btn-success btn-lg">Create n-Queens Project</button></Link>
        <Link to="createPrimes" className="white"><button className="btn-success btn-lg">Create Prime-Finder Project</button></Link>

        <div>
          <SelectedProjectView />
        </div>
        <ul className="list-group col-sm-4">
          {this.renderList()}
        </ul>
      </div>
    );
  }
}
function mapStateToProps(state) {
  //Whatever is returned from here will show up
  //as props inside of MenuView
  return {
    allProjects: state.allProjects,
    projects: state.projects,
    project: state.selectedProject
  };
}

//anything returned from this function will end up as props
// on the MenuView container
function mapDispatchToProps(dispatch) {
//   //whenever selectProject is called, the result should be passed
//   //to all of our reducers
  return bindActionCreators({ selectProject: selectProject }, dispatch);
}

//promote booklist from a component to a container - it needs to know
//about this new dispatch method, selectProject. Make it available
//as a prop
export default connect(mapStateToProps, mapDispatchToProps)(MenuView);
