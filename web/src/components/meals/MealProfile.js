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
    chefId: "",
    times: [],
  }

  componentDidMount = async () => {
    await fetch(`/meal/${this.props.id}`)
      .then(resp => resp.json())
      .then(async meal => {
        await this.setState({ meal, chefId: meal.chef._id, times: meal.availability });
        console.log(this.state);
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

  setAvailability = count => {
    const times = [];
    count.forEach(item => {
      fetch(`/meal/${this.props.id}/setavailable`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'same-origin',
              body: JSON.stringify({
                mealId: this.props.id,
                chefId: this.state.chefId,
                date: item.date,
                start: item.start,
                end: item.end,
              }),
            })
      .then(resp => resp.json())
      .then(available => times.push(available))
    })
    this.setState({ times })
  }

  addTime = () => {
    const times = this.state.times.slice();
    times.push({});
    this.setState({ times })
  }

  save = (ind, timeObj) => {
    const times = this.state.times.slice();
    times.splice(ind, 1, timeObj);
    this.setState({ times })
  }

  render(){
    const id = this.props.id
    console.log('times', this.state.times)
    return(
      <div>
        <NavBar user={this.props.user}/>
        <Switch>
          <Route exact path={`/meal/${id}/edit`} render={(props) =>
            <MealEdit meal={this.state.meal} user={this.props.user}
              save={this.save} archive={this.archive} {...props}/>}/>

          <Route exact path={`/meal/${id}/request`} render={(props) =>
            <MealRequest meal={this.state.meal} user={this.props.user}
              times={this.props.times} {...props}/>}/>

          <Route exact path={`/meal/${id}/setavailable`} render={(props) =>
            <MealAvailability meal={this.state.meal} mealId={id}
              set={this.setAvailability}
              times={this.state.times}
              addTime={this.addTime}
              save={this.save}
              user={this.props.user} {...props}/>}/>

          <Route path={`/meal/${id}`} render={(props)=>
            <MealView meal={this.state.meal}
              times={this.state.times}
              user={this.props.user} {...props}/> }/>
        </Switch>
      </div>
    )
  }
};
