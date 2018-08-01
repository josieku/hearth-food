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
        <Link to={`/user/${id}`}>Profile</Link>
        <Link to='/'>Consumer Mode</Link>
      </div>
    )
  } else {
    return (
      <div>
        <Link to='/'>About</Link>
        <Link to='/'>Become a Chef</Link>
        <Link to='/'>Sign up</Link>
        <Link to='/'>Log in</Link>
      </div>
    )
  }
}

export default class NavBar extends Component{
  state = { role: this.props.user.role, id: this.props.user._id}

  render(){
    console.log(this.props);
    return (
      <div>{nav(this.state.role, this.state.id)}</div>
    )
    // const user = this.props.location.state.user;
    // if (user.role === "chef") return <ChefLanding/>
    // else if (user.role === "consumer") return <ConsumerLanding/>
    // else return <GeneralLanding/>;
  }
};
