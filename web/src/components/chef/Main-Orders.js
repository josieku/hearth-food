import React, { Component } from "react";
import { Link } from 'react-router-dom';

function OrderItem(item, index, complete) {
  return (
    <li key={item._id} className="order-list-item" style={{border:"1px solid black"}}>
      <p>Customer: {item.consumer.firstName}</p>
      <p>Meal: {item.meal.title}</p>
      <p>Time: {item.time}</p>
      <p>Status: <strong>{item.payment ? <span>Ready to cook!</span> : <span>Awaiting payment...</span>}</strong></p>
      <p>Additional requests: {item.requests ? item.requests : 'None'}</p>
      <button>Message Customer</button>
      {item.payment ? <button disabled>Make Changes to Request</button> : <button>Make Changes to Request</button>}
      {item.payment ? <button onClick={()=>complete(item._id, index)}>Delivered!</button> : null}
    </li>
  )
}

export default class OrderListing extends Component{
  render(){
    return(
      <div>
        <h2>Orders</h2>
        <ul style={{listStyleType: "none"}}>
          {this.props.orders.length > 0
            ? this.props.orders.map((item, ind) => OrderItem(item, ind, this.props.complete))
            : 'No orders yet'}
        </ul>
      </div>
    )
  }
}
