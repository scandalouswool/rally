import React, { Component } from 'react';
import { connect } from 'react-redux';

class SelectedProjectView extends Component {
  constructor(props) {
    super(props);

    this.webWorker = null;
  }

  render() {
    if (!this.props.project) {
      return <div className="padded">Select a project</div>;
    }

    return (
      <div className="padded">
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