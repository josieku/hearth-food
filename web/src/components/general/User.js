import React, { Component } from "react";
import { Route } from 'react-router-dom';

import ConsumerProfile from './../consumer/ConsumerProfile';

export default class User extends Component{
  render(){
    return(
      <div>
        <Route
          exact={true}
          path='/user/:id'
          render={({ match }) => (
            // user passed from rending in BrowserRouter
            // profile passed from id in URL
            <ConsumerProfile user={this.props.location.state.user} id={match.params.id}/>
          )}
        />
        {/* <Route
          exact={true}
          path='/user/:id/edit'
          render={({ match }) => (
            // user passed from rending in BrowserRouter
            // profile passed from id in URL
            <ConsumerProfile user={this.props.location.state.user} profile={match.params.id}/>
          )}
        /> */}
      </div>
    )
  }
};
