import React, { Component } from 'react';
import { connect } from 'react-redux'
import { selectProject } from '../actions/index';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import SelectedProjectView from './SelectedProjectView';
import ProjectView from '../components/ProjectView';

class MenuView extends Component {

  renderList() {
    return this.props.projects.map( (project) => {
      return (
        <button key={project.title}>
          <Link to='/project' onClick={() =>  this.props.selectProject(project) }>
              {project.title}
          </Link>
        </button>
      );
    });
  }

  render() {
    console.log(this.props.createdSocket);
    return (
      <div className="padded">
        <div>
          <SelectedProjectView />
        </div>
        <ul className="list-group col-sm-4">
          {this.renderList()}
        </ul>
      </div>
    )
  }
}
function mapStateToProps(state) {
  //Whatever is returned from here will show up 
  //as props inside of MenuView
  return {
    projects: state.projects,
    project: state.selectedProject
  }
}

//anything returned from this function will end up as props
// on the MenuView container
function mapDispatchToProps(dispatch) {
//   //whenever selectProject is called, the result should be passed
//   //to all of our reducers
  return bindActionCreators({ selectProject: selectProject }, dispatch)
}

//promote booklist from a component to a container - it needs to know
//about this new dispatch method, selectProject. Make it available
//as a prop
export default connect(mapStateToProps, mapDispatchToProps)(MenuView);