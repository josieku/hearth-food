import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

function OneReview(review){
  return (
    <div className="review-single">
      <p>{review.subject}</p>
      <p>{review.anonymous ? "Anonymous says: " : review.author.firstName + " says: "}</p>
      <p>{new Date(review.date).toDateString()}</p>
      <p>{review.body}</p>
    </div>
  )
}

class Reviews extends Component {
  render(){
    return(
      <div className="review-board">
        <br/>
        {this.props.list.length > 0
          ? this.props.list.map(review => OneReview(review))
          : <p> No reviews yet! </p>
        }
      </div>
    )
  }
}

class AddReview extends Component {
  state = {
    content: "",
    anonymous: false,
    rating: 1,
    open: false,
  }

  send = () => {
    this.props.add(this.state.content, this.state.anonymous, this.state.rating);
    this.setState({
      content: "",
      anonymous: false,
      rating: 1,
      open: false,
    })
  }

  renderForm = () => {
    if (this.props.verified) {
      return (
        <form>
          <label>{this.state.anonymous ? "Anon says:": `${this.props.user.firstName} says:`}</label>
          <input placeholder="Great meal! However, I wish ..." onChange={(e)=>{this.setState({ content: e.target.value })}}/>
          <label>Click to be anonymous </label>
          <input type="checkbox" onClick={()=>{this.setState({ anonymous: !this.state.anonymous })}}/>
          <label>Give your meal a rating </label>
          <input type="number" min="1" max="5"
            onChange={(e)=>{this.setState({ rating: e.target.value })}}/>
          <button onClick={this.send}>Send</button>
        </form>
    )} else {
      return <p>You have not purchased this meal yet.  Buy now to leave a review! </p>
    }
  }

  render(){
    return(
      <div>
        <Button onClick={()=>this.setState({ open: !this.state.open })}>Leave a review</Button>
        {this.state.open ? this.renderForm() : null }
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
        <button><Link to={`/meal/${meal._id}/edit`}>Edit meal</Link></button>
        <button><Link to={`/meal/${meal._id}/setavailable`}>Set Availability</Link></button>
      </div>
    )
  }

  for (var ind in user.orders){
    if (user.orders[ind]===meal._id){
      return <button>Cancel request</button>
    }
  }
}

function timeslots(timeObj, mealId) {
  const path=`/meal/${mealId}/request?time=${timeObj.time}`
  return(
    <div key={timeObj._id}>
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
        <Segment>
          <Grid>
            {meal.archived ? <h1>This meal has been archived</h1> : null}
            <Grid.Row>
              <img src={meal.picture}/>
              <Header as='h3'>{meal.title}</Header>
            </Grid.Row>
            <Grid.Row>
              <p>Rating: {meal.overallRating}</p>
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
              <p><strong>Price:</strong>{meal.price}</p>
            </Grid.Row>
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
            <AddReview mealId={meal._id} user={user}
              verified={this.props.verified} add={this.props.add}/>
            <Grid.Row>
              <p><strong>Reviews: </strong></p>
              <Reviews list={this.props.reviews}/>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }
};
