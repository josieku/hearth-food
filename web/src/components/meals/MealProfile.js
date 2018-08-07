import React, { Component } from "react";
import { Route, Switch, Link } from 'react-router-dom';

import MealView from './MealProfile-View';
import MealEdit from './MealProfile-Edit';
import MealRequest from './MealProfile-Request';
import NavBar from './../general/NavBar';
import MealAvailability from './MealProfile-SetAvailability';

export default class MealProfile extends Component {
  state = {
    meal: {},
  }

  componentDidMount = e => {
    console.log('mounting');
    fetch(`/meal/${this.props.id}`)
      .then(resp => resp.json())
      .then(meal => {
        this.setState({ meal });
        console.log(this.props);
      })
  }

  save = (title, description, ingredients, price, cuisine) => {
    fetch(`/meal/${this.props.id}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({
        title, description, ingredients, price, cuisine
      }),
    })
    .then(resp => resp.json())
    .then(meal => {
      this.setState({ meal })
    })
  }

  archive = () => {
    fetch(`/meal/${this.props.id}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
    })
    .then(resp => resp.json())
    .then(meal => this.setState({ meal }))
  }

  setAvailability = availability => {
    fetch(`/meal/${this.props.id}/setavailable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ availability }),
    })
    .then(resp => resp.json())
    .then(meal => this.setState({ meal }))
  }

  render(){
    const id = this.props.id
    return(
      <div>
        <NavBar user={this.props.user}/>
        <Switch>
          <Route exact path={`/meal/${id}/edit`} render={(props) =>
            <MealEdit meal={this.state.meal} user={this.props.user}
              save={this.save} archive={this.archive} {...props}/>}/>

          <Route exact path={`/meal/${id}/request`} render={(props) =>
            <MealRequest meal={this.state.meal}
              user={this.props.user} {...props}/>}/>

          <Route exact path={`/meal/${id}/setavailable`} render={(props) =>
            <MealAvailability meal={this.state.meal}
              set={this.setAvailability}
              user={this.props.user} {...props}/>}/>

          <Route path={`/meal/${id}`} render={(props)=>
            <MealView meal={this.state.meal}
              user={this.props.user} {...props}/> }/>
        </Switch>
      </div>
    )
  }
};
