import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createProject } from '../actions/actions';
import { Link } from 'react-router';

class CreateNQueensView extends Component {
  generateProjectOptions(e) {
    e.preventDefault();

    //title, dataSet, generateDataSet, mapData, reduceResults
    const projectOptions = {
      title: 'n-Queens'+ this.refs.n.value,
      dataSet: null,
      generateDataSet: "(() => {var dataSet = [];var n = "+this.refs.n.value+"; var min = '10'; var maj = '0'; var col = '1'; for (var i = 0; i < n/2; i++){ dataSet.push([n,1,min,maj,col]); min += '0';if (maj === '0'){maj = '1'}else{ maj += '0'};col += '0';} return dataSet;})",
      mapData: "(dataSet) => {var n = dataSet[0]; var level = dataSet[1]; var minDiagConflict = parseInt(dataSet[2],2); var majDiagConflict = parseInt(dataSet[3],2); var colConflict = parseInt(dataSet[4],2); var solutionCount = 0;var countQueenSolutions = function(currentRow, minDiagConflict, majDiagConflict, colConflict) {if (currentRow === n) { solutionCount++; return; }var conflicts = minDiagConflict | majDiagConflict | colConflict; for (var queenPosition = 1; queenPosition < 1<<n; queenPosition*=2) { if (!(conflicts & queenPosition)) { var nextMinDiagConflict = (minDiagConflict | queenPosition) << 1; var nextMajDiagConflict = (majDiagConflict | queenPosition) >> 1; var nextColConflict = colConflict | queenPosition; result = countQueenSolutions(currentRow+1, nextMinDiagConflict, nextMajDiagConflict, nextColConflict); if (result) return solutionCount = result; } } };countQueenSolutions(level,minDiagConflict, majDiagConflict, colConflict); return solutionCount; }",
      reduceResults: "(results) => { var n = "+this.refs.n.value+"; var total = 0;  if (n % 2 === 0){ for (var i = 0; i < results.length; i++){ total += results[i] * 2 } }else{ for (var i = 0; i < results.length-1; i++){ total += results[i] * 2 } total += results[results.length-1]; } return total; }"
    };
    console.log(this.refs.n.value);
    //console.log(projectOptions);
    // Send projectOptions to the server
    this.props.createProject(projectOptions);
  }

  render() {
    return (
      <div>
        This is the create n-Queens view.
      
        <form method="post">
          n for n-Queens <br></br>
          <input type="text" ref="n" /> <br></br>
        </form>
        <button onClick={this.generateProjectOptions.bind(this)}><Link to='menu'>Submit</Link></button>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createProject 
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(CreateNQueensView);




(dataSet) => {

    var n = dataSet[0];
    var level = dataSet[1]; 
    var minDiagConflict = parseInt(dataSet[2],2); 
    var majDiagConflict = parseInt(dataSet[3],2); 
    var colConflict = parseInt(dataSet[4],2);   
      
    var solutionCount = 0;

    var countQueenSolutions = function(currentRow, minDiagConflict, majDiagConflict, colConflict) {

      if (currentRow === n) {
        solutionCount++;
        return;
      }

    var conflicts = minDiagConflict | majDiagConflict | colConflict;
      for (var queenPosition = 1; queenPosition < 1<<n; queenPosition*=2) {
        if (!(conflicts & queenPosition)) {
          var nextMinDiagConflict = (minDiagConflict | queenPosition) << 1;
          var nextMajDiagConflict = (majDiagConflict | queenPosition) >> 1;
          var nextColConflict = colConflict | queenPosition;
          result = countQueenSolutions(currentRow+1, nextMinDiagConflict, nextMajDiagConflict, nextColConflict);
          if (result) return solutionCount = result;
        }
      }
    };

    countQueenSolutions(level,minDiagConflict, majDiagConflict, colConflict);
    
    return solutionCount;
  }



