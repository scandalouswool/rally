/*
  PRIMES ALGORITHM VISUALIZATION
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UpdateResults } from '../actions/actions';

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

    this.drawPrimesGraph();
  }

  drawPrimesGraph() {
    console.log('Drawing graph', this.graph);

    const xScale = d3.scaleLinear()
      .domain([0, 20])
      .range([0, this.svgWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 4])
      .range([this.svgHeight, 0]);

    let notes = this.graph.selectAll('rect')
      // .data(this.props.results);
      .data([[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]);
    console.log(notes);
    
    // ENTER
    notes.enter()
      .append('rect')
      .attr('x', (d, i) => {
        return xScale(i);
      })
      .attr('y', 0)
      .attr('height', (d) => {
        return yScale(d.length);
      })
      .attr('width', this.svgWidth / 4)
      .attr('fill', 'blue');

    // UPDATE

    notes
      .transition()
      .ease(d3.easeSin)
      .attr('x', (d, i) => {
        return xScale(i);
      })
      .attr('y', 0)
      .attr('height', (d) => {
        return yScale(d.length);
      })
      .attr('width', this.svgWidth / 4)
      .attr('fill', 'blue');

    // EXIT
    notes.exit()
      .remove();
  }

  render() {
    return (
      <div>
        <div id="visualizer">This is a visualizer</div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    results: UpdateResults
  };
}

export default connect(mapStateToProps)(PrimesVisualView);