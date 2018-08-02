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

  componentDidMount = e => {
    console.log('mounting');
    fetch(`/meal/${this.props.id}`)
      .then(resp => resp.json())
      .then(meal => {console.log('meal', meal); this.setState({ meal })})
  }

  request = e => {

  }

  edit = e => {

  }

  render(){
    const chef = Object.assign({}, this.state.meal.chef);
    console.log(chef._id);
    // console.log(temp._id);
    return(
      <div>
        <p>Meal Profile</p>
        <h4>{this.state.meal.title}</h4>
        {this.props.user._id === chef._id? <button onClick={this.edit}>Edit meal</button>: <button onClick={this.request}>Request this meal</button>}
        <img src={this.state.meal.picture}/>
        <p>Cuisine: {this.state.meal.cuisine}</p>
        <p><strong>Description:</strong></p>
        <p>{this.state.meal.description}</p>
        <p><strong>Ingredients:</strong></p>
        <p>{this.state.meal.ingredients}</p>
        <p><strong>Reviews:</strong></p>
        {/* <Reviews list={this.state.meals.reviews}/> */}
      </div>
    )
  }
};
