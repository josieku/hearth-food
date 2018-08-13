import React, { Component } from "react";
import { Link } from 'react-router-dom';

function HistoryItem(item) {
  return (
    <li key={item._id} className="history-list-item" style={{border:"1px solid black"}}>
      <p>Customer: {item.consumer.firstName}</p>
      <p>Meal: {item.meal.title}</p>
      <p>Time: {item.time.date}</p>
      <p>Status:
        {item.completed
          ? <span style={{fontWeight: "bold"}}>Done!</span>
          : item.declineComment
          ? <span>
              <span style={{fontWeight: "bold"}}> Declined. </span>
              <span style={{fontStyle:"italic"}}>Reasoning: `{item.declineComment}`</span>
            </span>
          : <span>Expired...</span>
        }
      </p>
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
