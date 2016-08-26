import React, { Component } from 'react';
import _ from 'lodash';

class UserView extends Component {
  constructor(props) {
    super(props);
    this.graph = null;
    this.svgWidth = 900;
    this.svgHeight = 500;
    this.userRadius = 45;
    this.projectRadius = 65;
  }

  componentDidMount() {
    this.graph = d3.select('#user-viz').append('svg')
      .attr('perserveAspectRatio', 'xMinYMin')
      .attr('viewBox', `0 0 ${this.svgWidth} ${this.svgHeight}`)
      .classed('svg-content', true);

    this.addCoordinates();
    this.drawUsers();
  }

  componentDidUpdate() {
    this.addCoordinates();
    this.drawUsers();
  }

  getRandomColor() {
    var letters = '6789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getValidCoordinates() {
    let x, y;
    let condition = true;
    while (condition) {
      x = this.getRandomInt(this.userRadius, this.svgWidth - this.userRadius);
      y = this.getRandomInt(this.userRadius, this.svgHeight - this.userRadius);

      let between = ((x > ((this.svgWidth / 2) - this.userRadius - this.projectRadius))
        && (x < ((this.svgWidth / 2) + this.userRadius + this.projectRadius))
        && (y > ((this.svgHeight / 2) - this.userRadius - this.projectRadius))
        && (y < ((this.svgHeight / 2) + this.userRadius + this.projectRadius)));

      if (!between) {
        condition = false;
      }
    }

    return {x, y};
  }

  addCoordinates() {
    let coords = this.getValidCoordinates();
    _.map(this.props.workerArray, (item, index) => {
      item.x = item.x ? item.x : coords.x;
      item.y = item.y ? item.y : coords.y;
      item.index = index + 1;
      return item;
    });
  }

  drawUsers() {
    console.log(this.props.workerArray);
    // Make the lines
    let lines = this.graph.selectAll('line')
      .data(this.props.workerArray);

    lines.enter().append('line')
      .attr('x1', (d) => { return d.x; })
      .attr('y1', (d) => { return d.y; })
      .attr('x2', this.svgWidth / 2).attr('y2',this.svgHeight / 2)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('class', 'lines');

    lines.exit().remove();

    // Make the circles
    let field = this.graph.selectAll('circle')
      .data(this.props.workerArray);

    field.enter().append('circle')
      .attr('cx', (d) => { return d.x; })
      .attr('cy', (d) => { return d.y; })
      .attr('r', this.userRadius)
      .attr('fill', this.getRandomColor())
      .attr('class', 'circles');

    field.exit().remove();

    // Add text labels to each user
    let text = this.graph.selectAll('text')
      .data(this.props.workerArray);

    text.enter().append('text')
      .attr('x', (d) => { return d.x - (this.userRadius / 2.5); })
      .attr('y', (d) => { return d.y + (this.userRadius / 9); })
      .text((d) => { return `User ${d.index}`;} );

    text.exit().remove();

    this.graph.append('ellipse')
      .attr('cx', this.svgWidth / 2)
      .attr('cy', this.svgHeight / 2)
      .attr('rx', this.projectRadius)
      .attr('ry', this.projectRadius)
      .attr('fill', 'pink')
      .text('Das Project')
      .attr('class', 'project-circle');
  }

  render() {
    return (
      <div id="user-viz"></div>
    );
  }
}

export default UserView;
