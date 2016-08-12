/*
  PRIMES ALGORITHM VISUALIZATION
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UpdateResults } from '../actions/actions';
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
    console.log('Defined graph', this.graph);
    console.log(this.props.results.length);
    this.drawPrimesGraph();
  }

  componentWillReceiveProps() {
    console.log('Receiving component');
    this.drawPrimesGraph();
  }

  drawPrimesGraph() {
    console.log('Drawing graph', this.graph);

    const xScale = d3.scaleLinear()
      .domain([0, 20])
      .range([0, this.svgWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 5000])
      .range([0, this.svgHeight]);

    let notes = this.graph.selectAll('rect')
      .data(this.props.results);
    console.log(notes);
    
    // ENTER
    notes.enter()
      .append('rect')
      .attr('x', (d, i) => {
        return xScale(i);
      })
      .attr('y', (d) => {
        return this.svgHeight - yScale(d === null ? 0 : d.length)
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
        return this.svgHeight - yScale(d === null ? 0 : d.length)
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
    results: state.updateResults
  };
}

export default connect(mapStateToProps)(PrimesVisualView);