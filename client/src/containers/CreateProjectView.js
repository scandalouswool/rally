import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class CreateProjectView extends Component {
  constructor(props) {
    super(props);

    this.numRows = 6;
    this.numCols = 80;

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

    // If check whether user is allowed to create a project
    // and send submitted string to different routes accordingly
    let user = this.props.auth.username;
    let whiteList = this.props.auth.whiteList;

    if (whiteList.indexOf(user) !== -1) {
      this.props.socket.emit('createProject', this.state);
    } else {
      this.props.socket.emit('pendProject', this.state);
    }

    this.context.router.push('/menu');
  }

  render() {
    let titleText = 'Please enter the name of your project.';
    let dataSetText = 'Please enter an array of items that you would like to use in '
      + 'the distributed calculation. You can either manually enter the data set here, '
      + 'or provide a function below that will generate the desired data set. At the moment, that '
      + 'function is unable to accept any arguments.';
    let mapText = 'Please enter a function that you would like to run on each '
      + 'element of your data set. The function should accept a single argument and should '
      + 'return the result of your calculation. We will store the results of running this function on '
      + 'each element in your dataset in the same order as the original data set.'
      + '\n\nFor example, suppose that your map function simply doubles every number it finds. '
      + 'Then your original data set of [1, 2, 3, 4] will become [2, 4, 6, 8].';
    let reduceText = 'Please enter a function to reduce the array of results into a single value. '
      + 'The function should take one argument - the array of results calculated from the function above; it '
      + 'should return the results of the reduce calculation.\n\nFor example, if the reduce function sums all '
      + 'numbers in the results array, the result of the distributed calculation will be 2 + 4 + 6 + 8, and '
      + 'will return 20.';

    let rows = this.numRows;
    let cols = this.numCols;

    return (
      <div>
        <h2>Create a new project</h2>

        <label className="block-label">Project Name:</label>
        <textarea
          rows="1" cols={cols} id="title"
          placeholder={titleText}
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <label className="block-label">Data Set:</label>
        <textarea
          rows={rows} cols={cols} id="dataSet"
          placeholder={dataSetText}
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <textarea
          rows={rows} cols={cols} id="generateDataSet"
          placeholder="Function to generate data set (optional)"
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <label className="block-label">Map Function:</label>
        <textarea
          rows={rows} cols={cols} id="mapData"
          placeholder={mapText}
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <label className="block-label">Reduce Function:</label>
        <textarea
          rows={rows} cols={cols} id="reduceResults"
          placeholder={reduceText}
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
    socket: state.createdSocket,
    auth: state.auth
  };
}

export default connect(mapStateToProps)(CreateProjectView);
