import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import ChefLanding from "./../chef/ChefLanding";
import ConsumerLanding from "./../consumer/ConsumerLanding";

export default class Landing extends Component{
  constructor(props){
    super(props);
    const user = this.props.user
    this.state = { user  }
  }

  noUser = () => {
    this.props.history.push('/')
  }

  render(){
    const user = Object.assign(this.state.user);
    return (
      <div>
        {user.role === "chef" && user
        ? <ChefLanding logout={this.props.logout} user={user}/>
        : user.role === "consumer" && user
        ? <ConsumerLanding logout={this.props.logout} user={user}/>
        : <Redirect to="/"/>}
      </div>
    )
  }
};
