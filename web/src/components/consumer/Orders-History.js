import React, { Component } from "react";
import { Link } from 'react-router-dom';

function HistoryItem(item, index) {
  return (
    <li key={item._id} className="request-list-item" style={{border:"1px solid black"}}>
      <p>Chef: {item.chef.firstName}</p>
      <p>Meal: {item.meal.title}</p>
      <p>Pickup Time: {item.time}</p>
      <p>Requests: {item.requests ? item.requests : 'None'}</p>
    </li>
  )
}

export default class HistoryListing extends Component{
  render(){
    return(
      <div>
        <h2>Previous Orders</h2>
        <ul style={{listStyleType: "none"}}>
          {this.props.history.length > 0
            ? this.props.history.map((item, ind) => HistoryItem(item, ind))
            : 'No previous orders... Order more!'}
        </ul>
      </div>
    )
  }
}
