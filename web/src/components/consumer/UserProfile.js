import React, { Component } from "react";
import { Switch, Route, Link } from 'react-router-dom';

import NavBar from './../general/NavBar';
import UserView from './UserProfile-View';
// import UserEdit from './UserProfile-Edit';

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

  render(){
    console.log('user profile')
    return(
      <div>
        <NavBar user={this.props.user}/>
        <Switch>
          <Route exact path='/user/:id' render={(props) =>
            <UserView user={this.props.user} profile={this.state.profile}
              id={props.match.params.id} {...props}/>}/>

          {/* <Route exact path='/user/:id/edit' render={(props) =>
            <UserEdit user={this.props.user}
              id={props.match.params.id} {...props}/>}/> */}
        </Switch>
      </div>
    )
  }
};
