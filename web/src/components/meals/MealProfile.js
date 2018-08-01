import React, { Component } from "react";

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

export default class MealProfile extends Component {
  state = {
    meal: {},
    self: this.props.user
  }

  // componentDidMount = e => {
  //   const response = await fetch(`/meal/${this.props.id}`);
  //   const meal = await response.json();
  //   this.setState({ meal })
  // }

  render(){
    return(
      <div>
        <p>Meal Profile</p>
        {/* <h4>{this.state.meal.title}</h4>
        <button onClick={this.request}>Request this meal</button>
        <img src={this.state.meal.picture}/>
        <p>Cuisine: {this.state.meal.cuisine}</p>
        <p><strong>Description:</strong></p>
        <p>{this.state.meal.description}</p>
        <p><strong>Ingredients:</strong></p>
        <p>{this.state.meal.description}</p>
        <p><strong>Reviews:</strong></p>
        <Reviews list={this.state.meals.reviews}/> */}
      </div>
    )
  }
};
