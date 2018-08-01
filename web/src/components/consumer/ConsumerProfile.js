import React, { Component } from "react";

export default class ConsumerProfile extends Component{
  state = {
    profile: {},
    self: this.props.user
  }

  // componentDidMount(){
  //   const response = await fetch(`/user/${this.props.id}`);
  //   const profile = await response.json();
  //   this.setState({ user: profile})
  // }

  render(){
    return(
      <div>
        <p>Consumer Profile</p>
        {/* <h4>{this.state.profile.firstName}</h4>
        <img src={this.state.profile.picture}/>
        {this.state.profile.verified ? <p>Verified</p> : null }
        <p>Preferences:
          <ul>{this.state.profile.preferrences.map(pref => <li>{pref}</li>)}</ul>
        </p>
        {this.state.self._id === this.state.profile._id ? <Link to={`/user/${this.state.self._id}/edit`}>Edit Profile</Link>: null} */}
      </div>
    )
  }
};
