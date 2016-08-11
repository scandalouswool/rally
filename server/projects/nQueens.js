// Example of a distributed computing problem that uses the Rally API
// mapData and reduceResults functions may use lodash methods
const _ = require('lodash');

const nQueenOptions = {
  title: 'nQueens',

  dataSet: null,

  generateDataSet: () => {
    var dataSet = [];

    // change the n here! 
    // the n in n-Queens
    // need to change in reduced results 
    var n = 14; 

    var min = '10'; // initial state of the minDiagonal conflict after branch in level 1
    var maj = '0'; // initial state of the majorDiagonal conflict after branch in level 1
    var col = '1';  // initial state of the columns after branch in level 1

    for (var i = 0; i < n/2; i++){
      dataSet.push([n,1,min,maj,col])
      min += '0';    
      if (maj === '0'){maj = '1'}else{ maj += '0'}; 
      col += '0'; 
    }
    
    return dataSet; 
  },  

  mapData: (dataSet) => {

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
  },

  reduceResults: (results) => {
    
    // change the n here! 
    var n = 14; 
    var total = 0; 

    if (n % 2 === 0){
      for (var i = 0; i < results.length; i++){
        total += results[i] * 2 
      }
    }else{
      for (var i = 0; i < results.length-1; i++){
        total += results[i] * 2 
      }
      total += results[results.length-1]; 
    }

    return total; 
  }
}

module.exports = nQueenOptions;