import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import ChefLanding from "./../chef/ChefLanding";
import ConsumerLanding from "./../consumer/ConsumerLanding";
// import GeneralLanding from "./GeneralLanding";

export default class Landing extends Component{
  constructor(props){
    super(props);
    const user = this.props.location.state ? this.props.location.state.user : this.props.user
    this.state = { user  }
  }

  // static getDerivedStateFromProps(nextProps, prevState){
  //   if(nextProps.user !==prevState.user) return { user: nextProps }
  //   else return null;
  // }

  noUser = () => {
    this.props.history.push('/')
  }

  render(){
    const user = Object.assign(this.state.user);
    console.log('user in landing', user);
    // if (user.role === "chef" && user) return <ChefLanding notLand={this.props.notLand} user={user}/>
    // else if (user.role ==="consumer" && user) return <ConsumerLanding notLand={this.props.notLand} user={user}/>
    // else {return <Redirect to={{pathName: "", state:{user:this.state.user}}}/>}
    return (
      <div>
        {user.role === "chef" && user
        ? <ChefLanding notLand={this.props.notLand} user={user}/>
        : user.role === "consumer" && user
        ? <ConsumerLanding notLand={this.props.notLand} user={user}/>
        : <Redirect to="/"/>}
      </div>
    )
  }
};
