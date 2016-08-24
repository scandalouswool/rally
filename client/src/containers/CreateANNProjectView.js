import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class CreateANNProjectView extends Component {
  constructor(props) {
    super(props);

    this.numRows = 6;
    this.numCols = 80;

    this.state = {
      title: '',
      projectType: 'ANN',
      dataSet: '',
      generateDataSet: '',
      testSet: '',
      trainingOptions: ''
    }
  }

  handleInputChange(event) {
    let newState = {};
    newState[event.target.id] = event.target.value;
    this.setState(newState);
  }

  submitNewProject(event) {
    event.preventDefault();

    // Check if user is allowed to create a project
    // and send submitted string to different routes accordingly
    let user = this.props.auth.username;
    let whiteList = this.props.auth.whiteList;
    console.log('Sending:', this.state);
    if (whiteList.indexOf(user) !== -1) {
      this.props.socket.emit('createProject', this.state);
    } else {
      this.props.socket.emit('pendProject', this.state);
    }
  
    this.context.router.push('/menu');
  }

  render() {
    let titleText = 'Please enter the name of your project.';
    let dataSetText = 'Please enter the training set that you would like'
      + 'to use with the Synaptic machine learning library. You can manually'
      + 'input the data here, or provide a function below that will generate'
      + 'the desired data set. At the moment, that function is unable to accept'
      + 'any arguments.\n'
      + 'Training data set must be an array with individual data objects' 
      + 'with the following form:\n'
      + '    {\n'
      + '      input: ARRAY,\n'
      + '      output: ARRAY\n'
      + '                       }';
    let testSetText = 'Please enter the test set that will be used to determine'
      + 'whether the neutral network has been sufficiently trained.'
      + 'The test set must have the same format as the training set, '
      + 'but will typically be composed of far fewer data items.\n'
      + 'Required format:\n'
      + '    {\n'
      + '      input: ARRAY,\n'
      + '      output: ARRAY\n'
      + '                       }';
    let trainingOptionsText = 'Please provide the options that you would like'
      + 'the Synaptic trainer to use. The options must have the following format:\n'
      + '    {\n'
      + '      rate: NUMBER,\n'
      + '      iterations: NUMBERS,\n'
      + '      error: NUMBER,\n'
      + '      shuffle: BOOLEAN,\n'
      + '      log: NUMBER,\n'
      + '    }';
  
    let rows = this.numRows;
    let cols = this.numCols;

    return (
      <div>
        <h2>Create a new ANN project</h2>

        <label className="block-label">Project Name:</label>
        <textarea
          rows="1" cols={cols} id="title"
          placeholder={titleText}
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <label className="block-label">Training Set:</label>
        <textarea
          rows={rows} cols={cols} id="dataSet"
          placeholder={dataSetText}
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <label className="block-label">Test Set:</label>
        <textarea
          rows={rows} cols={cols} id="testSet"
          placeholder={testSetText}
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <label className="block-label">Training Options</label>
        <textarea
          rows={rows} cols={cols} id="trainingOptions"
          placeholder={trainingOptionsText}
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

// Attach router to CreateANNProjectView's context to route back to menu on submit
CreateANNProjectView.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    socket: state.createdSocket,
    auth: state.auth
  };
}

export default connect(mapStateToProps)(CreateANNProjectView);