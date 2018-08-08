import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Item, Menu, Segment } from 'semantic-ui-react';


function OrderItem(item, index, complete) {
  return (
    <Item key={item._id} className="order-list-item">
      <Item.Header>Customer: {item.consumer.firstName}</Item.Header>
      <Item.Extra>Meal: {item.meal.title}</Item.Extra>
      <Item.Extra>Time: {item.time}</Item.Extra>
      <Item.Extra>Status: <strong>{item.payment ? <span>Ready to cook!</span> : <span>Awaiting payment...</span>}</strong></Item.Extra>
      <Item.Extra>Additional requests: {item.requests ? item.requests : 'None'}</Item.Extra>
      <button>Message Customer</button>
      {item.payment ? <button disabled>Make Changes to Request</button> : <button>Make Changes to Request</button>}
      {item.payment ? <button onClick={()=>complete(item._id, index)}>Delivered!</button> : null}
      <Divider />
    </Item>
  )
}

export default class OrderListing extends Component{
  render(){
    return(
      <div>
        <h2 id="chefLandingHeader">Orders</h2>
          {this.props.orders.length > 0
            ? this.props.orders.map((item, ind) => OrderItem(item, ind, this.props.complete))
            : 'No orders yet'}
      </div>
    )
  }
}
