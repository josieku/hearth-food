import React, { Component } from "react";

export default class MealRequest extends Component {
  state = {
    time: "",
    requests: "",
    chef: Object.assign({}, this.props.meal.chef),
  }

  componentDidMount(){
    if (Object.keys(this.props.user).length===0){
      this.props.history.push('/auth/login')
    }
  }

  request = e => {
    console.log("fetching to request")
    fetch(`/meal/${this.props.meal._id}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({
        chef: this.state.chef._id,
        consumer: this.props.user._id,
        meal: this.props.meal._id,
        requests: this.state.requests,
        time: new Date(),
      }),
    })
    .then(e => {
      this.setState({
        time: "",
        requests: "",
      })
      this.props.history.push(`/meal/${this.props.meal._id}`)
    })
  }

  render(){
    const meal = this.props.meal;
    const user = this.props.user;
    return(
      <div>
        <h3>Request {this.state.chef.firstName} for {meal.title}</h3>
        <p>Request review:</p>
        <ul style={{listStyleType: "none"}}>
          <p>Description: {meal.description}</p>
          <p>Ingredients: {meal.ingredients}</p>
          <h2>Price: {meal.price}</h2>
        </ul>
        <form>
          <input placeholder="Additional Requests"
                 value={this.state.requests}
                 onChange={e => this.setState({requests: e.target.value})}/>
          <input type="date"/>
                 {/* // onChange={e => this.setState({time: new Date(e.target.value)})}/> */}
        </form>
        <button onClick={this.request}>Request</button>
      </div>
    )
  }
};
