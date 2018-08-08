import React, { Component } from "react";
import { Link } from 'react-router-dom';

function PendingItem(item, index, cancel) {
  return (
    <li key={item._id} className="request-list-item" style={{border:"1px solid black"}}>
      <p>Chef: {item.chef.firstName}</p>
      <p>Meal: {item.meal.title}</p>
      <p>Time: {item.time}</p>
      <p>Requests: {item.requests ? item.requests : 'None'}</p>
      <p>Status: PENDING</p>
      {item.accepted
        ? <button disabled>Cancel</button>
        : <button onClick={() => cancel(item._id, index)}>Cancel</button> }
    </li>
  )
}

export default class PendingListing extends Component{
  render(){
    return(
      <div>
        <h2>Pending</h2>
        <ul style={{listStyleType: "none"}}>
          {this.props.pending.length > 0
            ? this.props.pending.map((item, ind) => PendingItem(item, ind, this.props.cancel))
            : 'No pending requests, order more!!'}
        </ul>
      </div>
    )
  }
}
