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
          {this.props.list.map(review => OneReview(review))}
        </ul>
      </div>
    )
  }
}

export default class MealView extends Component {
  request = e => {
    this.props.history.push(`/meal/${this.props.meal._id}/request`)
  }

  edit = e => {
    this.props.history.push(`/meal/${this.props.meal._id}/edit`);
  }

  render(){
    const meal = this.props.meal;
    const chef = Object.assign({}, meal.chef);
    const user = this.props.user;
    return(
      <div>
        <p>Meal Profile</p>
        <h4>{meal.title}</h4>
        {user._id === chef._id? <Link to={`/meal/${this.props.meal._id}/edit`}>Edit meal</Link>: <button onClick={this.request}>Request this meal</button>}
        <img src={meal.picture}/>
        <p>Cuisine: {meal.cuisine}</p>
        <p><strong>Description:</strong></p>
        <p>{meal.description}</p>
        <p><strong>Ingredients:</strong></p>
        <p>{meal.ingredients}</p>
        <p><strong>Reviews:</strong></p>
        {/* <Reviews list={this.state.meals.reviews}/> */}
      </div>
    )
  }
};
