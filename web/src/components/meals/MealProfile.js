import React, { Component } from "react";
import { Route, Link } from 'react-router-dom';

import MealView from './MealProfile-View';
import MealEdit from './MealProfile-Edit';

export default class MealProfile extends Component {
  state = {
    meal: {},
  }

  componentDidMount = e => {
    console.log('mounting');
    fetch(`/meal/${this.props.id}`)
      .then(resp => resp.json())
      .then(meal => {
        // console.log('meal', meal);
        this.setState({ meal });
        console.log(this.props);
        // this.props.history.push(`/meal/${this.props.id}/show`);
      })
  }

  save = (title, description, ingredients, price, cuisine) => {
    fetch(`/meal/${this.props.user._id}/save`, {
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

  render(){
    const path = `/meal/${this.props.user._id}`;
    return(
      <div>
        <Route exact path='/meal/:id/edit' render={(props) => <MealEdit meal={this.state.meal} user={this.props.user} save={this.save} {...props}/>}/>
        <Route path='/meal/:id' render={(props)=> <MealView meal={this.state.meal} user={this.props.user} {...props}/> }/>
      </div>
    )
  }
};
