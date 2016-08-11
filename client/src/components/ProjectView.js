import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectedProjectView from '../containers/SelectedProjectView';

class ProjectView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.project);
    
    return (
      <div>
        <SelectedProjectView />
        This is the project view.
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    project: state.selectedProject
  }
}

export default connect(mapStateToProps)(ProjectView);