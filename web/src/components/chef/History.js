import React, { Component } from "react";
import { Link } from 'react-router-dom';

function HistoryItem(item) {
  return (
    <li key={item._id} className="history-list-item" style={{border:"1px solid black"}}>
      <p>Customer: {item.consumer.firstName}</p>
      <p>Meal: {item.meal.title}</p>
      <p>Time: {item.time.date}</p>
      <p>Status: <strong>{item.completed ? <span>Done!</span>:<span>Expired...</span>}</strong></p>
      <p>Additional requests: {item.requests ? item.requests : 'None'}</p>
    </li>
  )
}

export default class HistoryListing extends Component{
  state = {
    history: []
  }

  componentDidMount = () => {
    fetch(`/chef/${this.props.chefId}/history`)
    .then(resp => resp.json())
    .then(history => this.setState({ history }))
  }

  render(){
    return(
      <div>
        <h2>Request History</h2>
        <ul style={{listStyleType: "none"}}>
          {this.state.history.length > 0
            ? this.state.history.map(HistoryItem)
            : 'No history yet'}
        </ul>
      </div>
    )
  }
}
