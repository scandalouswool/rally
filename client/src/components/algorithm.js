import React, { Component } from 'react';
import SelectedAlgorithm from '../containers/selectedAlgorithm';

class AlgorithmView extends Component {
  render() {
    return (
      <div>
        <SelectedAlgorithm />
        This is the algorithm view.
      </div>
    )
  }
}

export default AlgorithmView;