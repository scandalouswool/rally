/*
  PRIMES ALGORITHM VISUALIZATION
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class PrimesVisualView extends Component {
  constructor(props) {
    super(props);
    this.graph = null;
    this.svgWidth = 600;
    this.svgHeight = 400;
  }

  componentDidMount() {
    this.graph = d3.select('#visualizer').append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);
    
    console.log('Drawing primes visualization');
    this.drawPrimesGraph();
  }

  // componentWillReceiveProps() {
  componentDidUpdate() {
    console.log('Updating primes visualization');
    this.drawPrimesGraph();
  }

  drawPrimesGraph() {
    const xScale = d3.scaleLinear()
      .domain([0, this.props.project.jobsLength])
      .range([0, this.svgWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 5000])
      .range([0, this.svgHeight]);

    let notes = this.graph.selectAll('rect')
      .data(this.props.results, (d, i) => {
        return d;
      });
    
    // ENTER
    notes.enter()
      .append('rect')
      .attr('x', (d, i) => {
        return xScale(i);
      })
      .attr('y', (d) => {
        return this.svgHeight - yScale(d.length)
      })
      .attr('height', (d) => {
        return yScale(d.length);
      })
      .attr('width', this.svgWidth / 20 - 5)
      .attr('fill', '#3CC76A');

    // UPDATE

    notes
      .transition()
      .ease(d3.easeSin)
      .attr('x', (d, i) => {
        return xScale(i);
      })
      .attr('y', (d) => {
        return this.svgHeight - yScale(d.length)
      })
      .attr('height', (d) => {
        return yScale(d.length);
      })
      .attr('width', this.svgWidth / 20 - 5)
      .attr('fill', '#3CC76A');

    // EXIT
    notes.exit()
      .remove();
  }

  render() {
    return (
      <div>
        This is a visualizer
        <div id="visualizer"></div>
        <div>{this.props.results === null ? 'zero' : this.props.results.length}</div>
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

export default connect(mapStateToProps)(PrimesVisualView);