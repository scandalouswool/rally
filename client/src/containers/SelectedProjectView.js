import React, { Component } from 'react';
import { connect } from 'react-redux';

class SelectedProjectView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.project) {
      return <h2>Please select or create a project to begin</h2>;
    }

    return (
      <div>
        <h2>Currently Selected Project: <span className="customGreen">{this.props.project.title}</span></h2>
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