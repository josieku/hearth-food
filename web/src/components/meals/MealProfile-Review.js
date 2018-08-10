import React, { Component } from "react";
import { Route, Switch, Link } from 'react-router-dom';

export default class Review extends Component {
  state = {
    meal: {},
    chefId: "",
    times: [],
  }

  componentDidMount = () => {
    console.log('mounting');
    fetch(`/meal/${this.props.id}`)
      .then(resp => resp.json())
      .then(async meal => {
        await this.setState({ meal, chefId: meal.chef._id, times: meal.availability });
        console.log(this.state);
      })
  }

  render(){
    const id = this.props.id
    // console.log(this.state.meal)
    return(
      <div>
        <NavBar user={this.props.user}/>
        <Switch>
          <Route exact path={`/meal/${id}/edit`} render={(props) =>
            <MealEdit meal={this.state.meal} user={this.props.user} save={this.save}
              id={id} archive={this.archive} {...props}/>}/>

          <Route exact path={`/meal/${id}/request`} render={(props) =>
            <MealRequest meal={this.state.meal} user={this.props.user}
              times={this.props.times} {...props}/>}/>

          <Route exact path={`/meal/${id}/setavailable`} render={(props) =>
            <MealAvailability meal={this.state.meal} mealId={id}
              set={this.setAvailability} user={this.props.user} {...props}/>}/>

          <Route path={`/meal/${id}`} render={(props)=>
            <MealView meal={this.state.meal}
              times={this.state.times}
              user={this.props.user} {...props}/> }/>
        </Switch>
      </div>
    )
  }
};
