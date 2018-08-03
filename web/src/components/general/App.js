import React, { Component } from "react";
// import "./../../public/App.css";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './Landing';
import NavBar from './NavBar';
import Meal from './../meals/Meal';
import User from './User';
import MapContainer from '.././maps/MapContainer'

class App extends Component {
  // landing page, not logged in
  state = {
    user: {},
  };

  handleClick = async e => {

  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div>
            <h2>hearth</h2>
          </div>
          <NavBar user={this.state.user}/>
          <Switch>
            <Route exact={true} path="/" render={() => <Landing user={this.state.user}/>}/>
            <Route path="/users" render={() => <User user={this.state.user}/>}/>
            <Route path="/meal" render={() => <Meal user={this.state.user}/>}/>
            <Route path="/map" component={MapContainer}/>
            {/* <Route path="/messages" render={() => <Messages user = {this.state.user}/>}/>
            <Route path="/request" render={() => <Request user = {this.state.user}/>}/> */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}


export default App;
