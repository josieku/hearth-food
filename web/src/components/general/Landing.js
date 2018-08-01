import React, { Component } from "react";
import ChefLanding from "./../chef/ChefLanding";
import ConsumerLanding from "./../consumer/ConsumerLanding";
import GeneralLanding from "./GeneralLanding";

export default class Landing extends Component{
  render(){
    const user = this.props.user;
    if (user.role === "chef" && user) return <ChefLanding/>
    else if (user.role === "consumer" && user) return <ConsumerLanding/>
    else return <GeneralLanding/>;
  }
};
