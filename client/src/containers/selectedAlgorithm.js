import React, { Component } from 'react';
import { connect } from 'react-redux';
import Algorithm from '../components/algorithm';

class SelectedAlgorithm extends Component {
  render() {
    if (!this.props.algorithm) {
      return <div>Select an algorithm</div>;
    }

    return (
      <div>
        <h3>Currently Selected Algorithm:</h3>
        <div>{this.props.algorithm.title}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    algorithm: state.selectedAlgorithm
  }
}

export default connect(mapStateToProps)(SelectedAlgorithm);