import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Button, Divider, Dropdown, Grid, Item, Search } from "semantic-ui-react";

import NavBar from './../general/NavBar';
import Listings from './Main';
import Orders from './Orders';
import Profile from './UserProfile';

export default class ConsumerLanding extends Component{
  validateLogin = async () =>{
    if (Object.keys(this.props.user).length === 0 || this.props.user.role === "chef"){
      await this.props.history.push('/')
    }
  }

  componentDidMount = e => {
    this.props.notLand();
    if (Object.keys(this.props.user).length === 0 || this.props.user.role === "chef"){
      this.props.history.push('/')
    }
  }

  render(){
    const user = this.props.user
    return(
      <div className="main">
        <NavBar user={user} logout={this.props.logout}/>
        <Switch>
          <Route exact path="/dashboard/orders" render={(props)=> <Orders user={user} {...props} />}/>
          <Route exact path="/dashboard" render={(props)=> <Listings user={user} {...props} />}/>
          {/* <Route exact path='/user/:id' render={({ match }) =>
            <Profile user={this.state.user} notLand={this.notLand} id={match.params.id}/>}/> */}
        </Switch>
      </div>
      )
    }
};
