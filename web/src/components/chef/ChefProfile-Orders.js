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
  state = {
    orders: []
  }

  componentDidMount = () => {
    fetch(`/chef/${this.props.chefId}/orders`)
    .then(resp => resp.json())
    .then(orders => {console.log('orders', orders); this.setState({ orders })})
  }

  complete = async (requestId, index) => {
    await fetch(`/chef/${this.props.chefId}/completed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ requestId }),
    })
    const orders = this.state.orders.slice();
    orders.splice(index, 1);
    this.setState({ orders });
  }

  render(){
    return(
      <div>
        <h2>Orders</h2>
        <ul style={{listStyleType: "none"}}>
          {this.state.orders.length > 0
            ? this.state.orders.map((item, ind) => OrderItem(item, ind, this.complete))
            : 'No orders yet'}
        </ul>
      </div>
    )
  }
}
