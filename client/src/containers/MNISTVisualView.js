/*
  MNIST MACHINE LEARNING VISUALIZATION
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class MNISTVisualView extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.maxWidth = 900;
    this.maxHeight = 500;
    this.dataSet = [];
  }

  componentDidMount() {
    this.chart = d3.select('#visualizer').append('canvas')
      .attr('width', this.maxWidth)
      .attr('height', this.maxHeight);

    this.context = this.chart.node().getContext('2d');
    // console.log('Canvas context is:', this.context);
    // Create an in-memory element to hold the data
    this.detachedContainer = document.createElement('custom');

    // Create a D3 selection for the detached container
    this.dataContainer = d3.select(this.detachedContainer);

    this.drawChart(this.props.ANNJobPoolReady);
  }

  componentDidUpdate() {
    console.log('From Inside componentDidUpdate:', this.props.ANNJobPoolReady);
    this.drawChart(this.props.ANNJobPoolReady);
  }

  drawChart (dataSet) {
    const dataBinding = this.dataContainer.selectAll('custom')
      .data(dataSet, (d) => { return d; });

    // UPDATE
    dataBinding
      .classed('rect', true)
      .attr('opacity', 0.5)
      .attr('x', (d, i) => {
        return 10 + (28 * (i % 10)) + (1 * (i % 10));
      })
      .attr('y', (d, i) => {
        return 10 + (28 * Math.floor(i / 10)) + Math.floor(1 * (i / 10));
      })
      .attr('num', (d) => { return d; })

    // ENTER
    dataBinding.enter()
      .append('custom')
      .classed('rect', true)
      .attr('x', (d, i) => {
        return 10 + (28 * (i % 10)) + (1 * (i % 10));
      })
      .attr('y', (d, i) => {
        return 10 + (28 * Math.floor(i / 10)) + Math.floor(1 * (i / 10));
      })
      .attr('num', (d) => { return d; })

    // EXIT
    dataBinding.exit()
      .remove();
    // console.log(this.detachedContainer);
    this.drawCanvas(dataBinding);
  }

  drawCanvas() {
    // clear the existing canvas
    console.log('Drawing numbers');
    this.context.fillStyle = '#fff';
    this.context.rect(0, 0, this.chart.attr('width'), this.chart.attr('height'));
    this.context.fill();

    const elements = this.dataContainer.selectAll("custom.rect");

    // Draw each image
    // context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
    // s- is the coordinate to start clipping
    const self = this;

    elements.each(function(d) {
      const node = d3.select(this);
      const image = new Image();
      const randomY = Math.floor( Math.random() * 10 );

      image.onload = () => {
        self.context.drawImage(image, node.attr('num') * 28 + 1 * node.attr('num'), 0 + randomY * 28 + randomY * 1, 28, 28, node.attr('x'), node.attr('y'), 28, 28);        
      }
      image.src = '../../assets/mnist.png';
    });
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
    project: state.selectedProject,
    ANNJobPoolReady: state.ANNJobPoolReady
  };
}

export default connect(mapStateToProps)(MNISTVisualView);