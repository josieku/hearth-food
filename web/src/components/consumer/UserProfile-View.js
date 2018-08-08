import React, { Component } from "react";
import { Link } from 'react-router-dom';

import NavBar from './../general/NavBar'

export default class ProfileView extends Component{
  render(){
    const profile = this.props.profile;
    const self = this.props.user;
    const preferences = profile.preferences ? profile.preferences : []
    return(
      <div>
        <div>
          <h4>{profile.firstName}</h4>
          <img src={profile.picture} height="150px" width="150px"/>
          <br/>
          {profile.verified ? <p>Verified</p> : null }
          {self._id === profile._id
            ? <Link to={`/user/${self._id}/edit`}><button>Edit Profile</button></Link>
            : null
          }
          <p>Preferences:
            {preferences.length < 1
              ? " None"
              : <ul>{preferences.map((pref, ind) => <li key={ind}>{pref}</li>)}</ul> }
          </p>
          <p>Current Rating: {profile.rating}</p>
        </div>
      </div>
    )
  }
};
