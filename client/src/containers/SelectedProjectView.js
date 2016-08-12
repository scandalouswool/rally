import React, { Component } from 'react';
import { connect } from 'react-redux';

class SelectedProjectView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.project) {
      return <h3>Select a project to begin</h3>;
    }

    return (
      <div>
        <h3>Currently Selected Project:</h3>
        <div>{this.props.project.title}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    project: state.selectedProject
  }
}

export default connect(mapStateToProps)(SelectedProjectView);