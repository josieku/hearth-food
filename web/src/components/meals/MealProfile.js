import React, { Component } from "react";
import { Route, Switch, Link } from 'react-router-dom';
import qs from 'query-string';

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
    verified: false,
    reviews: [],
    requestId: "",
    loading: true,
  }

  componentDidMount = () => {
    fetch(`/meal/${this.props.id}`)
      .then(resp => resp.json())
      .then(async meal => {
        const times = {}
        const availabilities = meal.availability.filter(item=>!item.passed);
        console.log('availabilities', availabilities)
        for (let ind in availabilities) {
          const date = availabilities[ind]["date"];
          if (times[date]){
            const temp = times[date].slice();
            temp.push(availabilities[ind]);
            times[date] = temp;
          } else {
            times[date] = [availabilities[ind]];
          }
        }
        console.log('times!!!', times)

        await this.setState({
          meal,
          chefId: meal.chef._id,
          availabilities,
          times,
          reviews: meal.reviews ? meal.reviews : [],
          loading: false
         });
      })

    fetch(`/meal/${this.props.id}/review?user=${this.props.user._id}`)
      .then(resp => resp.json())
      .then(request => {
        // console.log('request', request)
        if (Object.keys(request).length > 0){
          this.setState({ verified: true, requestId: request._id })
        }
      })
  }

  addReview = (content, anon, rating, requestId) => {
    const userId = this.props.user._id;
    const date = Date.now();
    fetch(`/meal/${this.props.id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        userId, content, anon, rating, date, requestId
      }),
    })
    .then(resp => resp.json())
    .then(review => {
      const reviews = this.state.reviews.slice();
      reviews.push(review);
      this.setState({ reviews })
    })

  }

  save = (title, description, ingredients, price, cuisine, picture) => {
    fetch(`/meal/${this.props.id}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({
        title, description, ingredients, price, cuisine, picture
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

  setAvailability = async (times) => {
    const chefId = this.state.chefId;
    await fetch(`/meal/${this.props.id}/setavailable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ times, chefId }),
    })
    .then(resp => resp.json())
    .then(times => { console.log(times); this.setState({ times }) })
  }

  render(){
    const id = this.props.id
    console.log('state availabilities', this.state.availabilities)
    // console.log(this.state.meal)
    return(
      <div className="main">
        <NavBar user={this.props.user}/>
        <Switch>
          <Route exact path={`/meal/${id}/edit`} render={(props) =>
            <MealEdit meal={this.state.meal} user={this.props.user} save={this.save}
              id={id} archive={this.archive} {...props}/>}/>

          <Route exact path={`/meal/${id}/request`} render={(props) =>
            <MealRequest meal={this.state.meal} user={this.props.user}
              times={this.state.availabilities}
               result={parseInt(qs.parse(props.location.search).time)}
               {...props}/>}/>

          <Route exact path={`/meal/${id}/setavailable`} render={(props) =>
            <MealAvailability meal={this.state.meal} mealId={id} loading={this.state.loading}
              set={this.setAvailability} user={this.props.user} {...props}/>}/>

          <Route path={`/meal/${id}`} render={(props)=>
            <MealView meal={this.state.meal} reviews={this.state.reviews}
              times={this.state.times} verified={this.state.verified}
              requestId={this.state.requestId} user={this.props.user}
              add={this.addReview} {...props} loading={this.state.loading}/> }/>
        </Switch>
      </div>
    )
  }
};
