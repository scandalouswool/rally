import React, { Component } from 'react';

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
        <button onClick={this.generateProjectOptions.bind(this)}>Submit</button>
      </div>
    )
  }
}

export default CreateProjectView;