import React, { Component } from "react";
import { Link } from 'react-router-dom';

function ScheduledItem(item, index, cancel) {
  return (
    <li key={item._id} className="request-list-item" style={{border:"1px solid black"}}>
      <p>Chef: {item.chef.firstName}</p>
      <p>Meal: {item.meal.title}</p>
      <p>Pickup Time: {item.time}</p>
      <p>Requests: {item.requests ? item.requests : 'None'}</p>
      {item.accepted
        ? <button disabled>Cancel</button>
        : <button onClick={() => cancel(item._id, index)}>Cancel</button> }
    </li>
  )
}

export default class ScheduledListing extends Component{
  render(){
    return(
      <div>
        <ul style={{listStyleType: "none"}}>
          {this.props.scheduled.length > 0
            ? this.props.scheduled.map((item, ind) => ScheduledItem(item, ind, this.props.cancel))
            : 'No scheduled requests, order more!!'}
        </ul>
      </div>
    )
  }
}
