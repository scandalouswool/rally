import React, { Component } from 'react';
import { js_beautify as beautify } from 'js-beautify';

class PendingProjectView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let proj = this.props.project;

    return (
      <div>
        <div>
          <span>{`Title: ${proj.title}`}</span>
          <button
            onClick={() => {this.props.enactDecision(true, this.props.id);}}>
            Accept
          </button>
          <button onClick={() => {this.props.enactDecision(false, this.props.id);}}>
          Reject
          </button>
        </div>

        <div>
          <h5>Data Set:</h5>
          <pre>{beautify(proj.dataSet, {indent_size: 2})}</pre>
        </div>
        <div>
          <h5>Generate Data Set:</h5>
          <pre>{beautify(proj.generateDataSet, {indent_size: 2})}</pre>
        </div>
        <div>
          <h5>Map Function:</h5>
          <pre>{beautify(proj.mapData, {indent_size: 2})}</pre>
        </div>
        <div>
          <h5>Reduce Function:</h5>
          <pre>{beautify(proj.reduceResults, {indent_size: 2})}</pre>
        </div>
      </div>
    );
  }
}

export default PendingProjectView;
