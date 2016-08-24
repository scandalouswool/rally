import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class CreateANNProjectView extends Component {
  constructor(props) {
    super(props);

    this.numRows = 6;
    this.numCols = 80;

    this.state = {
      title: '',
      dataSet: '',
      generateDataSet: '',
      
    }
  }
}