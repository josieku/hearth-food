import React, { Component } from "react";
import { Switch, Route, Link } from 'react-router-dom';

import NavBar from './../general/NavBar';
import UserView from './UserProfile-View';
import UserEdit from './UserProfile-Edit';

export default class ConsumerProfile extends Component{
  state = {
    profile: {},
    self: this.props.user
  }

  componentDidMount = async e => {
    const response = await fetch(`/user/${this.props.id}`);
    const profile = await response.json();
    this.setState({ profile: profile })
    this.props.notLand();
  }

  edit = (firstName, lastName, password, email, phone, picture) => {
    if (this.state.profile._id === this.props.user._id){
      fetch(`/user/${this.props.user._id}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // <- this is mandatory to deal with cookies
        body: JSON.stringify({ firstName, lastName, password, email, phone, picture }),
      })
      .then(resp => resp.json())
      .then(async profile => {
        await this.setState({ profile });
        this.props.history.push(`/user/${this.state.profile._id}`);
      })
    }
  }

  render(){
    return(
      <div className="main">
        <NavBar user={this.props.user}/>
        <Switch>
          <Route exact path='/user/:id' render={(props) =>
            <UserView user={this.props.user} profile={this.state.profile}
              id={props.match.params.id} {...props}/>}/>

          <Route exact path='/user/:id/edit' render={(props) =>
            <UserEdit user={this.props.user} edit={this.edit}
              id={props.match.params.id} profile={this.state.profile} {...props}/>}/>
        </Switch>
      </div>
    )
  }
};
