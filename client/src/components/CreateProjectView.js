import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createProject } from '../actions/actions';
import { Link } from 'react-router';

class CreateProjectView extends Component {
  generateProjectOptions(e) {
    e.preventDefault();

    // title, dataSet, generateDataSet, mapData, reduceResults
    const projectOptions = {
      title: this.refs.title.value,
      dataSet: this.refs.dataSet.value,
      generateDataSet: this.refs.generateDataSet.value,
      mapData: this.refs.mapData.value,
      reduceResults: this.refs.reduceResults.value
    };
  
    console.log(projectOptions);
    // Send projectOptions to the server
    this.props.createProject(projectOptions);
  }

  render() {
    return (
      <div className="padded">
        This is the create project view.
      
        <form method="post">
          Title of Your Project: <br></br>
          <input type="text" ref="title" /> <br></br>
          Initial DataSet: <br></br>
          <input type="text" ref="dataSet" /> <br></br>
          Function to Generate DataSet (optional) <br></br>
          <input type="text" ref="generateDataSet" /> <br></br>
          MapData Function <br></br>
          <input type="text" ref="mapData" /> <br></br>
          ReduceResults Function <br></br>
          <input type="text" ref="reduceResults" /> <br></br>
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

export default connect(null, mapDispatchToProps)(CreateProjectView);
