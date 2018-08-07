import React, { Component } from "react";
import { Route } from 'react-router-dom';

import MealProfile from './MealProfile';

export default class Meal extends Component{
  render(){
    return(
      <div>
        <Route
          exact path='/meal/:id'
          render={({ match }) => (
            // user passed from rending in BrowserRouter
            // profile passed from id in URL
            <MealProfile id={match.params.id} user={this.props.user}/>
          )}
        />

        <Route exact path="/meal/:id/setavailable" render={(props) =>
          <SetAvailability {...props}/> }/>
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
