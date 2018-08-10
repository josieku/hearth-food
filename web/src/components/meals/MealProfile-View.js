import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

function OneReview(review){
  return (
    <li>
      <div className="review-single">
        <p>{review.subject}</p>
        <p>{review.author}</p>
        <p>{review.date}</p>
        <p>{review.body}</p>
      </div>
    </li>
  )
}

class Reviews extends Component {
  render(){
    return(
      <div className="review-board">
        <ul>
          {this.props.list ? this.props.list.map(review => OneReview(review)) : <p>No reviews yet!</p>}
        </ul>
      </div>
    )
  }
}

function requestEditButton(user, chef, meal) {
  if (meal.archived){
    return null
  }

  if (user._id === chef._id){
    return (
      <div>
        <Button><Link to={`/meal/${meal._id}/edit`}>Edit meal</Link></Button>
        <Button><Link to={`/meal/${meal._id}/setavailable`}>Set Availability</Link></Button>
      </div>
    )
  }

  for (var ind in user.orders){
    if (user.orders[ind]===meal._id){
      return <Button>Cancel request</Button>
    }
  }

  return <div><Button size="mini" href='`/meal/${meal._id}/request`' float='right'>Request this meal</Button></div>
}

function timeslots(timeObj, mealId) {
  const path=`/meal/${mealId}/request?time=${timeObj.time}`
  return(
    <div>
      <Link to={path}>
        <Button>
          <p>{new Date(timeObj.date).toDateString()}</p>
          <p>{timeObj.start} to {timeObj.end}</p>
        </Button>
      </Link>
    </div>
  )
}

export default class MealView extends Component {
  render(){
    const meal = this.props.meal;
    const chef = Object.assign({}, meal.chef);
    const user = this.props.user;
    // console.log(meal)
    return(
      <div className="main">
        <Header as='h2'>Meal Profile</Header>
        <Segment>
          <Grid columns={2}>
            {meal.archived ? <h1>This meal has been archived</h1> : null}
            <Grid.Column width={8}>
            <Grid.Row>
              <Header as='h3' floated='left'>{meal.title}</Header>
                <Header as='h4' floated='right'><strong>Price:</strong>${meal.price}</Header>
            <br/>
            </Grid.Row>
            <Grid.Row>
                {requestEditButton(user, chef, meal)}
            </Grid.Row>
            { this.props.times.length > 0
              ?
              <div>
                <Grid.Row>
                  <p><strong>Available Pick Up Times: </strong></p>
                </Grid.Row>
                <Grid.Row>
                  {meal.archived
                    ? null
                    : this.props.times.map(item=>timeslots(item, meal._id))}
                </Grid.Row>
              </div>
              : <p>No available pick up times, check again later</p>
            }
            <Grid.Row>
              <p><strong>Cuisine: </strong></p>
              <p>{meal.cuisine}</p>
            </Grid.Row>
            <Grid.Row>
              <p><strong>Description:</strong></p>
              <p>{meal.description}</p>
            </Grid.Row>
            <Grid.Row>
              <p><strong>Ingredients:</strong></p>
              <p>{meal.ingredients}</p>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={8}>
            <Grid.Row>
              <img src={meal.picture}/>
              <p><strong>Reviews:</strong></p>
              <Reviews list={meal.reviews}/>
            </Grid.Row>
          </Grid.Column>
          </Grid>
        </Segment>
      </div>
    )
  }
};
