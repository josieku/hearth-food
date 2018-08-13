import React, { Component } from "react";
import { Button } from "semantic-ui-react"

export default class MealRequest extends Component {
  state = {
    time: this.props.result ? this.props.result : "",
    requests: "",
    chef: Object.assign({}, this.props.meal.chef),
  }

  componentDidMount(){
    if (Object.keys(this.props.user).length===0){
      this.props.history.push('/auth/login')
    }
  }

  chosenTime = () => {
    const chosen = this.props.times.find(item=> item.time === this.state.time);
    if (chosen){
      return <div>
              <span>{new Date(chosen.date).toDateString()} at {chosen.start}</span>
              <button onClick={()=>this.setState({ time: "" })}>Change</button>
            </div>
    }
  }

  timeslots = (timeObj) => {
    return(
      <Button onClick={()=>this.setState({ time: timeObj.time })}>
        <p>{new Date(timeObj.date).toDateString()}</p>
        <p>{timeObj.start} to {timeObj.end}</p>
      </Button>
    )
  }

  request = e => {
    fetch(`/meal/${this.props.meal._id}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        chef: this.state.chef._id,
        consumer: this.props.user._id,
        meal: this.props.meal._id,
        requests: this.state.requests,
        time: this.props.times.find(item => item.time === this.state.time ),
      }),
    })
    .then(async e => {
      await this.setState({
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
        <div>
          <p>Chosen time: </p>
          {this.state.time
            ? this.chosenTime()
            : this.props.times.map(this.timeslots)
          }
        </div>

        <input placeholder="Additional Requests"
               value={this.state.requests}
               onChange={e => this.setState({requests: e.target.value})}/>
        <button onClick={this.request}>Request</button>
      </div>
    )
  }
};
