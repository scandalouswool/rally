import React, { Component } from 'react';
import { Link } from 'react-router';

class HomeView extends Component {
  render() {
    return (
      <div>
        <div className="jumbotron text-center">
          <h1 className="card">We like fast</h1>
          <p>Race to the finish line.<br></br>Process the toughest, largest projects in less time than you ever imagined.</p>
          <p><button className="btn-success btn-lg"><Link to="menu" className="white">Click here to discover projects</Link></button></p>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <h3 className="text-center customGreen"><span className="glyphicon glyphicon-fast-forward" aria-hidden="true"></span><br></br>All we know is fast</h3>
              <div>Help other users speed up even the most difficult processes. Every time someone joins an existing project, watch as the project's completion time dwindles in front of your eyes.
              </div>
            </div>
            <div className="col-sm-4">
              <h3 className="text-center customGreen"><span className="glyphicon glyphicon-cloud-upload" aria-hidden="true"></span><br></br>Distribute your project</h3>
              <div>Have an idea? Upload your project based on Rally's template and share your idea. As users log in, it will distribute jobs out for them to complete. Cut the amount of time it would usually take to run your project into incredibly short times.
              </div>
            </div>
            <div className="col-sm-4">
              <h3 className="text-center customGreen"><span className="glyphicon glyphicon-queen" aria-hidden="true"></span><br></br>See it for yourself</h3>
              <div>Don't have a project but want to see our app in action? Create a project and see a demo of how distributed computing can make even the most demanding algorithms complete in faster times than any normal computer could handle.
              </div>
            </div>
          </div>
        </div>
        
        <br></br>

        <h2 className="text-center customGreen">Wait, but how does it work?</h2>
        <br></br>
          <img className="center-block" src="../../assets/diagram.png"></img>

      </div>


    );
  }
}

export default HomeView;
