import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class CreatePrimesView extends Component {
  constructor(props) {
    super(props);

    // Default prime-finding range to be 1 - 1,000,000
    this.state = {
      min: 1,
      max: 1000000
    };
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
      title: `Primes, ${this.state.min} - ${this.state.max}`,

      projectType: 'primes',

      dataSet: null,

      generateDataSet: `() => {
        var start = ${this.state.min};
        var end = ${this.state.max}
        var numPieces = end / 10000;
        var dataSet = [];

        for (var i = 0; i < numPieces; i++) {
          dataSet.push( [start + i * 10000, start + i * 10000 + 9999]);
        }
        return dataSet;
      }`,

      mapData: `(dataSubset) => {
        const primeTester = (num) => {
          for (var i = 2; i < num - 1; i++) {
            if (num % i === 0) {
              return false;
            }
          }
          return true;
        };

        var min = dataSubset[0];
        var max = dataSubset[1];
        var result = [];

        for (var i = min; i <= max; i++) {
          if (primeTester(i)) {
            result.push(i);
          }
        }

        return result;
      }`,

      reduceResults: `(results) => {
        return _.flatten(results).length + ' primes found!';
      }`
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
CreatePrimesView.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    socket: state.createdSocket
  };
}

export default connect(mapStateToProps)(CreatePrimesView);
