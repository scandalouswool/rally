import React, { Component } from 'react';
import { connect } from 'react-redux';

class SelectedProjectView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.project) {
      return <h3 className="selected">Please select or create a project to begin</h3>;
    }

    return (
      <div>
        <h3 className="selected">Currently Selected Project: <span className="customGreen">{this.props.project.title}</span></h3>
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