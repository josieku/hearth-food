import React, { Component } from "react";
import { Link } from 'react-router-dom';

function RequestItem(item, index, accept) {
  return (
    <li key={item._id} className="request-list-item" style={{border:"1px solid black"}}>
      <p>Customer: {item.consumer.firstName}</p>
      <p>Meal: {item.meal.title}</p>
      <p>Time: {item.time}</p>
      <p>Requests: {item.requests ? item.requests : 'None'}</p>
      {item.accepted
        ? <button disabled>Accept</button>
        : <button onClick={() => accept(item._id, index)}>Accept</button> }
    </li>
  )
}

export default class RequestListing extends Component{
  render(){
    return(
      <div>
        <h2>Requests</h2>
        <ul style={{listStyleType: "none"}}>
          {this.props.requests.length > 0
            ? this.props.requests.map((item, ind) => RequestItem(item, ind, this.props.accept))
            : 'No requests, start sharing your dishes!'}
        </ul>
      </div>
    )
  }
}
