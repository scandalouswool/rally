import React, { Component } from 'react';
//connect is a function
import { connect } from 'react-redux'
import { selectAlgorithm } from '../actions/index';
//makes sure actions flow through all our reducers
import { bindActionCreators } from 'redux';

class MenuView extends Component {

  renderList() {
    return this.props.algorithms.map( (algorithm) => {
      // console.log("This is this.props.algo, ", this.props.selectAlgorithm);
      return (
        <li 
          key={algorithm.title} 
          onClick={() =>  this.props.selectAlgorithm(algorithm) } >
          {algorithm.title}
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="list-group col-sm-4">
        {this.renderList()}
      </ul>
    )
  }
}
function mapStateToProps(state) {
  //Whatever is returned from here will show up 
  //as props inside of MenuView
  return {
    algorithms: state.algorithms
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


// ==============
// OLD REACT CODE
// ==============
// class MenuView extends Component {
//   constructor(props) {
//     super(props);
//   }
  
//   render() {
//     return (
//       <div>This is the menu view</div>
//     )
//   }
// }

// export default MenuView;
