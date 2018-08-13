import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Button, Divider, Dropdown, Grid, Item, Search } from "semantic-ui-react";

import NavBar from './../general/NavBar';
import Listings from './Main';
import Orders from './Orders';
import Profile from './UserProfile';
import Notifications from './Notifications';

export default class ConsumerLanding extends Component{
  state = {
    notifications: [],
  }

  componentDidMount = e => {
    if (Object.keys(this.props.user).length === 0 || this.props.user.role === "chef"){
      this.props.history.push('/')
    } else {
      fetch(`/user/${this.props.user._id}/notif`)
      .then(resp => resp.json())
      .then(notifications => this.setState({ notifications }))
    }
  }

  validateLogin = async () =>{
    if (Object.keys(this.props.user).length === 0 || this.props.user.role === "chef"){
      await this.props.history.push('/')
    }
  }

  updateNotifications = (unseen) => {
    fetch(`/user/${this.props.user._id}/notif/markallread`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ unseen }),
    })
      .then(resp => resp.json())
      .then(notifications => {
        this.setState({ notifications });
      })
  }

  render(){
    const user = this.props.user
    return(
      <div className="main">
        <NavBar notifications={this.state.notifications} user={user} logout={this.props.logout}/>
        <Switch>
          <Route exact path="/dashboard/orders"
            render={(props)=> <Orders user={user} {...props} />}/>

          <Route exact path="/dashboard/notifications" render={(props)=>
            <Notifications user={user} update={this.updateNotifications}
              notifications={this.state.notifications} {...props} />}/>

          <Route exact path="/dashboard" render={(props)=>
            <Listings user={user} recents={this.state.recents} {...props} />}/>
          {/* <Route exact path='/user/:id' render={({ match }) =>
            <Profile user={this.state.user} notLand={this.notLand} id={match.params.id}/>}/> */}
        </Switch>
      </div>
      )
    }
};
