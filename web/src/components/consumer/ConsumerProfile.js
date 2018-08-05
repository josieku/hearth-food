import React, { Component } from "react";
import { Link } from 'react-router-dom';


export default class ConsumerProfile extends Component{
  state = {
    profile: {},
    self: this.props.user
  }

  componentDidMount = async e => {
    // if (Object.keys(this.props.user).length===0){
    //   this.props.history.push('/login')
    // }
    const response = await fetch(`/user/${this.props.id}`);
    const profile = await response.json();
    this.setState({ profile: profile })
    this.props.notLand();
  }

  render(){
    console.log(this.state.profile);
    return(
      <div>
        <p>Consumer Profile</p>
        <h4>{this.state.profile.firstName}</h4>
        <img src={this.state.profile.picture} height="150px" width="150px"/>
        {this.state.profile.verified ? <p>Verified</p> : null }
        <p>Preferences:
          {/* <ul>{this.state.profile.preferences.map(pref => <li>{pref}</li>)}</ul> */}
        </p>
        {this.state.self._id === this.state.profile._id ? <Link to={`/user/${this.state.self._id}/edit`}>Edit Profile</Link>: null}
      </div>
    )
  }
};
