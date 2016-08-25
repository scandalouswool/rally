/*
  NQUEENS ALGORITHM VISUALIZATION
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class NQueensVisualView extends Component {
  constructor(props) {
    super(props);
    this.graph = null;
    this.svgWidth = 900;
    this.svgHeight = 500;
  }

  componentDidMount() {
    this.graph = d3.select('#visualizer').append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .attr('class', 'svg-block');
    
    // this.drawNQueensGraph();
  }

  componentDidUpdate() {
    // this.drawNQueensGraph();
  }   

  render() {
    return (
      <div id="visualizer"></div>
    );
  }
}


function mapStateToProps(state) {
  return {
    results: state.updateResults,
    project: state.selectedProject
  };
}

export default connect(mapStateToProps)(NQueensVisualView);