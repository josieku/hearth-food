import React, { Component } from "react";
import ChefLanding from "./../chef/ChefLanding";
import ConsumerLanding from "./../consumer/ConsumerLanding";
import GeneralLanding from "./GeneralLanding";

export default class Landing extends Component{
  render(){
    const user = this.props.user;
    if (user.role === "chef" && user) return <ChefLanding notLand={this.props.notLand} user={user}/>
    else if (user.role === "consumer" && user) return <ConsumerLanding notLand={this.props.notLand} user={user}/>
    else return <GeneralLanding user={user} landing={this.props.landing}/>;
  }
};
