import React, { Component } from "react";
import { Link } from 'react-router-dom';

import NavBar from './../general/NavBar'

export default class ProfileEdit extends Component{
  render(){
    const profile = this.props.profile;
    const self = this.props.user;
    const preferences = profile.preferences ? profile.preferences : []
    return(
      <div>
        <form>
        </form>
      </div>
    )
  }
};
