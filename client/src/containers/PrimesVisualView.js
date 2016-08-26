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
    this.svgWidth = 900;
    this.svgHeight = 500;
  }

  componentDidMount() {
    this.graph = d3.select('#graph-viz').append('svg')
      .attr('perserveAspectRatio', 'xMinYMin')
      .attr('viewBox', `0 0 ${this.svgWidth} ${this.svgHeight}`)
      .classed('svg-content', true);

    this.drawPrimesGraph();
  }

  componentDidUpdate() {
    this.drawPrimesGraph();
  }

  drawPrimesGraph() {
    const xScale = d3.scaleLinear()
      .domain([0, this.props.project.jobsLength])
      .range([0, this.svgWidth + 30]);

    const yScale = d3.scaleLinear()
      .domain([0, 1500])
      .range([0, this.svgHeight]);


    let notes = this.graph.selectAll('rect')
      .data(this.props.results[this.props.project.projectId], (d, i) => {
        return d;
      });
    
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
        return yScale(d === null ? 0 : d.length);
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
        return yScale(d === null ? 0 : d.length);
      })
      .attr('width', this.svgWidth / 20 - 5)
      .attr('fill', '#3CC76A');

    // EXIT
    notes.exit()
      .remove();

    // Add axes
    var xAxis = d3.axisBottom(xScale);
    this.graph.append('g')
    .attr('transform', 'translate(0, 500)')
    .call(xAxis);

    const yScaleInverse = d3.scaleLinear()
      .domain([1500, 0])
      .range([0, this.svgHeight]);

    var yAxis = d3.axisLeft(yScaleInverse);
    this.graph.append('g').call(yAxis);
  }

  render() {
    return (
      <div id="graph-viz"></div>
    );
  }
}


function mapStateToProps(state) {
  return {
    results: state.updateResults,
    project: state.selectedProject
  };
}

export default connect(mapStateToProps)(PrimesVisualView);