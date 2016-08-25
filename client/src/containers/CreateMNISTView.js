import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class CreateMNISTView extends Component {
  constructor(props) {
    super(props);

    

  }

  handleInputChange(event) {
    let newState = {};
    newState[event.target.id] = event.target.value;
    this.setState(newState);
  }

  generateProjectOptions(event) {
    event.preventDefault();

    //title, dataSet, generateDataSet, mapData, reduceResults
    const projectOptions = {
      
    };

    // Send projectOptions to the server
    this.props.socket.emit('createProject', projectOptions);

    this.context.router.push('/menu');
  }

  render() {
    return (
      <div>
        <form onSubmit={this.generateProjectOptions.bind(this)}>
          <label>Please input a range in which to find primes</label>
          <input
            id="min" type="number" placeholder="Minimum value"
            onChange={this.handleInputChange.bind(this)}
          />
          <input
            id="max" type="number" placeholder="Maximum value"
            onChange={this.handleInputChange.bind(this)}
          />
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
CreateMNISTView.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    socket: state.createdSocket
  };
}

export default connect(mapStateToProps)(CreateMNISTView);
