import React, { Component } from "react";
import { Link } from 'react-router-dom';
import ConsumerLanding from './../consumer/ConsumerLanding';
import ChefLanding from './../chef/ChefLanding';
import GeneralLanding from './GeneralLanding';

function nav(role, id){
  if (role === "consumer") {
    return (
      <div>
        <Link to="/request" >Request</Link>
        <Link to="/messages">Messages</Link>
        <Link to={`/user/${id}`}>Profile</Link>
      </div>
    )
  } else if (role === "chef") {
    return (
      <div>
        <Link to="/messages">Messages</Link>
        <Link to={`/chef/${id}`}>Profile</Link>
        <Link to='/'>Consumer Mode</Link>
      </div>
    )
  } else {
    return (
      <div>
        <Link to='/'>About</Link>
        <Link to='/'>Become a Chef</Link>
        <Link to='/auth/signup'>Sign up</Link>
        <Link to='/auth/login'>Log in</Link>
      </div>
    )
  }
}

export default class NavBar extends Component{
  render(){
    return (
      <div>{nav(this.props.user.role, this.props.user._id)}</div>
    )
  }
};
