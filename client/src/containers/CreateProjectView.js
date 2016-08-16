import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class CreateProjectView extends Component {
  constructor(props) {
    super(props);

    this.numRows = 5;
    this.numCols = 60;

    this.state = {
      title: '',
      dataSet: '',
      generateDataSet: '',
      mapData: '',
      reduceResults: ''
    };
  }

  handleInputChange(event) {
    let newState = {};
    newState[event.target.id] = event.target.value;
    this.setState(newState);
  }

  submitNewProject(event) {
    event.preventDefault();
    this.props.socket.emit('createProject', this.state);
    this.context.router.push('/menu');
  }

  render() {
    let rows = this.numRows;
    let cols = this.numCols;

    return (
      <div>
        <h2>Create a new project</h2>

        <textarea
          rows="1" cols={cols} id="title"
          placeholder="Project Name"
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <textarea
          rows={rows} cols={cols} id="dataSet"
          placeholder="Data Set"
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <textarea
          rows={rows} cols={cols} id="generateDataSet"
          placeholder="Function to generate data set (optional)"
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <textarea
          rows={rows} cols={cols} id="mapData"
          placeholder="Function to be performed on each value in the data set"
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <textarea
          rows={rows} cols={cols} id="reduceResults"
          placeholder="Function to reduce results"
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <form className="form" onSubmit={this.submitNewProject.bind(this)}>
          <button
            className="btn btn-success btn-block"
            type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

// Attach router to CreateProjectView's context to route back to menu on submit
CreateProjectView.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    socket: state.createdSocket
  };
}

export default connect(mapStateToProps)(CreateProjectView);
