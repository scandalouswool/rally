import React, { Component } from 'react';
import { js_beautify as beautify } from 'js-beautify';

class PendingProjectView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true
    };
  }

  toggleCodeDisplay() {
    this.setState({hidden: !this.state.hidden});
  }

  render() {
    let proj = this.props.project;
    let display = this.state.hidden ? 'hidden' : '';
    let displayGenerate = proj.generateDataSet ? '' : 'hidden';
    let displayData = proj.dataSet ? '' : 'hidden';
    let buttonDisplay = this.props.auth ? '' : 'hidden';

    if (proj.projectType === 'ANN') {
      return (
        <div>
          <div onClick={this.toggleCodeDisplay.bind(this)} className="container-fluid pointer pendingProject">
            <div className="row">
              <div className="col-sm-4 title-padding"><h4>{proj.title}</h4></div>
              <div className="col-sm-8 text-right">
                <button
                  className={`btn btn-default btn-padding btn-success ${buttonDisplay}`}
                  onClick={() => {this.props.enactDecision(true, this.props.id);}}>
                  Accept
                </button>
                <button
                  className={`btn btn-default btn-padding btn-danger ${buttonDisplay}`}
                  onClick={() => {this.props.enactDecision(false, this.props.id);}}>
                  Reject
                </button>
              </div>
            </div>

            <div className={display}>
              <div className={displayData}>
                <h5>Data Set:</h5>
                <pre>{beautify(proj.dataSet, {indent_size: 2})}</pre>
              </div>
              <div className={displayGenerate}>
                <h5>Generate Data Set:</h5>
                <pre>{beautify(proj.generateDataSet, {indent_size: 2})}</pre>
              </div>
              <div>
                <h5>Test Set:</h5>
                <pre>{beautify(proj.testSet, {indent_size: 2})}</pre>
              </div>
              <div>
                <h5>trainingOptions:</h5>
                <pre>{beautify(proj.trainingOptions, {indent_size: 2})}</pre>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div onClick={this.toggleCodeDisplay.bind(this)} className="container-fluid pointer pendingProject">
            <div className="row">
              <div className="col-sm-4 title-padding"><h4>{proj.title}</h4></div>
              <div className="col-sm-8 text-right">
                <button
                  className={`btn btn-default btn-padding btn-success ${buttonDisplay}`}
                  onClick={() => {this.props.enactDecision(true, this.props.id);}}>
                  Accept
                </button>
                <button
                  className={`btn btn-default btn-padding btn-danger ${buttonDisplay}`}
                  onClick={() => {this.props.enactDecision(false, this.props.id);}}>
                  Reject
                </button>
              </div>
            </div>

            <div className={display}>
              <div className={displayData}>
                <h5>Data Set:</h5>
                <pre>{beautify(proj.dataSet, {indent_size: 2})}</pre>
              </div>
              <div className={displayGenerate}>
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
          </div>
        </div>
      );
    }
  }
}

export default PendingProjectView;
