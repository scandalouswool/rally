import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class CreateNQueensView extends Component {
  constructor(props) {
    super(props);

    // Default n-queens squares to 10
    this.state = {
      numN: 10
    };
  }

  handleInputChange(event) {
    let newState = {};
    newState[event.target.id] = event.target.value;
    this.setState(newState);
  }

  generateProjectOptions(event) {
    event.preventDefault();

    //title, dataSet, generateDataSet, mapData, reduceResults
    const projectOptions = {
      title: `n-Queens, ${this.state.numN}`,
      dataSet: '',
      generateDataSet: `(() => {var dataSet = [];var n = ${this.state.numN}; var min = '10'; var maj = '0'; var col = '1'; for (var i = 0; i < n/2; i++){ dataSet.push([n,1,min,maj,col]); min += '0';if (maj === '0'){maj = '1'}else{ maj += '0'};col += '0';} return dataSet;})`,
      mapData: '(dataSet) => {var n = dataSet[0]; var level = dataSet[1]; var minDiagConflict = parseInt(dataSet[2],2); var majDiagConflict = parseInt(dataSet[3],2); var colConflict = parseInt(dataSet[4],2); var solutionCount = 0;var countQueenSolutions = function(currentRow, minDiagConflict, majDiagConflict, colConflict) {if (currentRow === n) { solutionCount++; return; }var conflicts = minDiagConflict | majDiagConflict | colConflict; for (var queenPosition = 1; queenPosition < 1<<n; queenPosition*=2) { if (!(conflicts & queenPosition)) { var nextMinDiagConflict = (minDiagConflict | queenPosition) << 1; var nextMajDiagConflict = (majDiagConflict | queenPosition) >> 1; var nextColConflict = colConflict | queenPosition; result = countQueenSolutions(currentRow+1, nextMinDiagConflict, nextMajDiagConflict, nextColConflict); if (result) return solutionCount = result; } } };countQueenSolutions(level,minDiagConflict, majDiagConflict, colConflict); return solutionCount; }',
      reduceResults: `(results) => { var n = ${this.state.numN}; var total = 0;  if (n % 2 === 0){ for (var i = 0; i < results.length; i++){ total += results[i] * 2 } }else{ for (var i = 0; i < results.length-1; i++){ total += results[i] * 2 } total += results[results.length-1]; } return total; }`
    };

    // Send projectOptions to the server
    this.props.socket.emit('createProject', projectOptions);
    this.context.router.push('/menu');
  }

  render() {
    return (
      <div>
        <form onSubmit={this.generateProjectOptions.bind(this)}>
          <label>Please input n for n-Queens</label>
          <input
            id="numN" type="text" placeholder="n"
            onChange={this.handleInputChange.bind(this)}
          />
          <button
            className="btn btn-success btn-block"
            type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

// Attach router to CreateProjectView's context to route back to menu on submit
CreateNQueensView.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    socket: state.createdSocket
  };
}

export default connect(mapStateToProps)(CreateNQueensView);
