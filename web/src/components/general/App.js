import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import localStorage from 'localStorage';

import Landing from './Landing';
import NavBar from './NavBar';
// import User from './User';
import ConsumerProfile from './../consumer/ConsumerLanding';
import MapContainer from '.././maps/MapContainer';
import CustomerSignup from './../auth/CustomerSignup';
// import ChefSignup from './../auth/ChefSignup';
import Login from './../auth/Login';
import MealProfile from './../meals/MealProfile';

import GeneralLanding from './GeneralLanding';
// import ChefLanding from './../chef/ChefLanding';
// import ConsumerLanding from './../consumer/ConsumerLanding';

class App extends Component {
  constructor(props){
    super(props);
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : {} ;
    this.state = {
      user: user,
      landing: true,
      test: 'testing',
    };
  }

  //this is where location settings should go
  login = user => {
    console.log("login", user);
    localStorage.setItem('user', JSON.stringify(user));
    const loggedin = Object.assign(user);
    console.log(loggedin);
    this.setState({
      user: Object.assign(user),
      landing: false,
      testing: 'passed'
    })
    console.log('state user', this.state);
  }

  landing = () => {
    this.setState({landing: true })
  }

  notLand = () => {
    this.setState({landing: false})
  }

  logout = () => {
    localStorage.removeItem('user');
    this.setState({ user: {} });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          {this.state.landing
            ? null
            : <NavBar user={this.state.user} logout={this.logout}/>}

          <Switch>
            <Route exact path="/" render={(props) =>
              <GeneralLanding user={this.state.user} landing={this.landing}/>}/>

            <Route path="/dashboard" render={(props) =>
              <Landing user={this.state.user}
                       landing={this.landing}
                       notLand={this.notLand} {...props}/>}/>

            <Route path="/map" component={MapContainer}/>

            <Route exact path="/auth/signup" render={(props) =>
              <CustomerSignup notLand={this.notLand} {...props}/>}/>

            <Route exact path="/auth/login" render={(props) =>
              <Login login={this.login} notLand={this.notLand} {...props}/>}/>

            <Route path='/user/:id' render={({ match }) =>
              <ConsumerProfile user={this.state.user} notLand={this.notLand} id={match.params.id}/>}/>

            <Route path='/meal/:id' render={(props) =>
              <MealProfile id={props.match.params.id} notLand={this.notLand} user={this.state.user} {...props}/>}/>

            <Route exact path='/auth/logout' render={() =>
              <Redirect to='/' />}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
