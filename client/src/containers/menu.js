import React, { Component } from 'react';
import { connect } from 'react-redux'
import { selectAlgorithm } from '../actions/index';
import { bindActionCreators } from 'redux';
import SelectedAlgorithm from './selectedAlgorithm';
import {Link} from 'react-router';
import Algorithm from '../components/algorithm';

class MenuView extends Component {

  renderList() {
    return this.props.algorithms.map( (algorithm) => {
      return (
        <button key={algorithm.title}>
          <Link to='/algorithm' onClick={() =>  this.props.selectAlgorithm(algorithm) }>
              {algorithm.title}
          </Link>
        </button>
      );
    });
  }

  render() {
    console.log(this.props.createdSocket);
    return (
      <div>
        <div>
          <SelectedAlgorithm />
        </div>
        <ul className="list-group col-sm-4">
          {this.renderList()}
        </ul>
      </div>
    )
  }
}
function mapStateToProps(state) {
  //Whatever is returned from here will show up 
  //as props inside of MenuView
  return {
    algorithms: state.algorithms,
    algorithm: state.selectedAlgorithm
  }
}

//anything returned from this function will end up as props
// on the MenuView container
function mapDispatchToProps(dispatch) {
//   //whenever selectAlgorithm is called, the result should be passed
//   //to all of our reducers
  return bindActionCreators({ selectAlgorithm: selectAlgorithm }, dispatch)
}

//promote booklist from a component to a container - it needs to know
//about this new dispatch method, selectAlgorithm. Make it available
//as a prop
export default connect(mapStateToProps, mapDispatchToProps)(MenuView);