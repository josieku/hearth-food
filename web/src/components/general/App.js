import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import localStorage from 'localStorage';

import Landing from './Landing';
import NavBar from './NavBar';
import Meal from './../meals/Meal';
import User from './User';
import MapContainer from '.././maps/MapContainer'
import CustomerSignup from './../auth/CustomerSignup';
import ChefSignup from './../auth/ChefSignup';
import Login from './../auth/Login';
import ConsumerProfile from './../consumer/ConsumerProfile';
import ChefProfile from './../chef/ChefProfile';
import Add from './../chef/addDishModal';
import MealProfile from './../meals/MealProfile';
import MealEdit from './../meals/MealProfile-Edit';

class App extends Component {
  state = {
    user: {},
    landing: true
  };

  componentDidMount = async e => {
    const user = localStorage.getItem('user');
    if (user){ this.setState({ user: JSON.parse(user) }) }
  }

  //this is where location settings should go
  login = user => {
    this.setState({ user, landing: false })
    localStorage.setItem('user', JSON.stringify(user));
  }

  landing = () => { this.setState({landing: true }) }

  notLand = () => { this.setState({landing: false}) }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          {this.state.landing ? null : <NavBar user={this.state.user}/>}
          <Switch>
            <Route exact={true} path="/" render={(props) => <Landing user={this.state.user} landing={this.landing} notLand={this.notLand} {...props}/>}/>
            <Route path="/users" render={(props) => <User user={this.state.user} notLand={this.notLand} {...props}/>}/>
            <Route path="/map" component={MapContainer}/>
            <Route exact path="/auth/signup" render={(props) => <CustomerSignup notLand={this.notLand} {...props}/>}/>
            <Route exact path="/auth/login" render={(props) => <Login login={this.login} notLand={this.notLand} {...props}/>}/>
            <Route path='/user/:id' render={({ match}) => <ConsumerProfile user={this.state.user} notLand={this.notLand} id={match.params.id}/>}/>
            <Route path='/chef/:id' render={(props) => <ChefProfile user={this.state.user} notLand={this.notLand} id={props.match.params.id} {...props}/>}/>
            <Route path='/meal/:id' render={(props) => <MealProfile id={props.match.params.id} notLand={this.notLand} user={this.state.user} {...props}/>}/>
            <Route exact path='/auth/logout' render={() => {localStorage.removeItem('user'); this.setState({ user: {} }); return <Redirect to='/'/>}}/>
            {/* <Route path="/messages" render={() => <Messages user = {this.state.user}/>}/>
            <Route path="/request" render={() => <Request user = {this.state.user}/>}/> */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
