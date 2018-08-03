import React, { Component } from "react";

export default class ChefLanding extends Component{
  componentDidMount(){
    this.props.notLand();
  };
  render(){
    return(
      <div>
        Chef Landing
      </div>
    )
  }
};
