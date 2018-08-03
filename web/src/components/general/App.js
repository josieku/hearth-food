import React, { Component } from "react";
// import "./../../../public/App.css";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './Landing';
import NavBar from './NavBar';
import Meal from './../meals/Meal';
import User from './User';

import CustomerSignup from './../auth/CustomerSignup';
import Login from './../auth/Login';
import ConsumerProfile from './../consumer/ConsumerProfile';
import ChefProfile from './../chef/ChefProfile';
import Add from './../chef/addDishModal';
import MealProfile from './../meals/MealProfile';

class App extends Component {
  // landing page, not logged in
  state = {
    user: {},
    landing: true
  };

  componentDidMount = async e => {
    const response = await fetch('/auth/ping');
    console.log(response);
    if (response.status === 200){
      const user = await response.json();
      this.setState({ user })
    }
  }
  login = user => {
    this.setState({ user, landing: false })
  }
  landing = e => {
    this.setState({landing: true })
  }
  notLand = e => {
    this.setState({landing: false})
  }

  render() {
    console.log(this.state);
    return (
      <BrowserRouter>
        <div className="App">
          {this.state.landing ? null : <NavBar user={this.state.user}/>}
          <Switch>
            <Route exact={true} path="/" render={(props) => <Landing user={this.state.user} landing={this.landing} {...props}/>}/>
            <Route path="/users" render={(props) => <User user={this.state.user} notLand={this.notLand} {...props}/>}/>
            <Route path="/meal" render={(props) => <Meal user={this.state.user} notLand={this.notLand} {...props}/>}/>
            <Route path="/auth/signup" component={CustomerSignup} notLand={this.notLand}/>
            <Route path="/auth/login" render={(props) => <Login login={this.login} notLand={this.notLand} {...props}/>}/>
            <Route path='/user/:id' render={({ match}) => <ConsumerProfile user={this.state.user} notLand={this.notLand} id={match.params.id}/>}/>
            <Route path='/chef/:id' render={(props) => <ChefProfile user={this.state.user} notLand={this.notLand} id={props.match.params.id} {...props}/>}/>
            <Route path='/meal/:id' render={(props) => <MealProfile id={props.match.params.id} notLand={this.notLand} user={this.state.user} {...props}/>}/>
            {/* <Route path={`/chef/:id/add`} component={Add}/> */}
            {/* <Route path="/messages" render={() => <Messages user = {this.state.user}/>}/>
            <Route path="/request" render={() => <Request user = {this.state.user}/>}/> */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
