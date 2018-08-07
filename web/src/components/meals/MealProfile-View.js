import React, { Component } from "react";
import { Link } from 'react-router-dom';

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

  return <button><Link to={`/meal/${meal._id}/request`}>Request this meal</Link></button>
}

export default class MealView extends Component {

  render(){
    const meal = this.props.meal;
    const chef = Object.assign({}, meal.chef);
    const user = this.props.user;
    return(
      <div>
        <p>Meal Profile</p>
        {meal.archived ? <h1>This meal has been archived</h1> : null}
        <h4>{meal.title}</h4>
        {requestEditButton(user, chef, meal)}
        <p>Price: <strong>{meal.price}</strong></p>
        <img src={meal.picture}/>
        <p>Cuisine: {meal.cuisine}</p>
        <p><strong>Description:</strong></p>
        <p>{meal.description}</p>
        <p><strong>Ingredients:</strong></p>
        <p>{meal.ingredients}</p>
        <p><strong>Reviews:</strong></p>
        <Reviews list={meal.reviews}/>
      </div>
    )
  }
};
