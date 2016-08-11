/*
  PRIMES ALGORITHM VISUALIZATION
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';

class PrimesVisualView extends Component {


}


function mapStateToProps(state) {
  return {
    updateResults: UpdateResults
  };
}

export default connect(mapStateToProps)(PrimesVisualView);