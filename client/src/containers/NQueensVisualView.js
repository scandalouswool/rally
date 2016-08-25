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
    this.svgWidth = 600;
    this.svgHeight = 700;
  }

  componentDidMount() {
    this.graph = d3.select('#visualizer').append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);
    
    // this.drawNQueensGraph();
  }

  componentDidUpdate() {
    // this.drawNQueensGraph();
  }   

  render() {
    return (
      <div>
        <div id="visualizer"></div>
        <div>{this.props.results[this.props.project.projectId] === null ? 'zero' : this.props.results[this.props.project.projectId].length}</div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    results: state.updateResults,
    project: state.selectedProject
  };
}

export default connect(mapStateToProps)(NQueensVisualView);