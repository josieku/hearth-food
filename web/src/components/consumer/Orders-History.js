import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Divider, Item } from 'semantic-ui-react';
function HistoryItem(item, bool) {
  return (
    <Item key={item._id} className="request-list-item">
      <Item.Header>Chef: {item.chef.firstName}</Item.Header>
      <Item.Extra>Meal: {item.meal.title}</Item.Extra>
      <Item.Extra>Date: {new Date(item.time.date).toString().slice(0,15)}</Item.Extra>
      <Item.Extra>Time: {item.time.start} to {item.time.end}</Item.Extra>
      <Item.Extra>Requests: {item.requests ? item.requests : 'None'}</Item.Extra>
      {bool ? <Divider/> : null}
    </Item>
  )
}

export default class HistoryListing extends Component{
  render(){
    return(
      <div>
        <ul style={{listStyleType: "none"}}>
          {this.props.pastOrders.length > 0
            ? this.props.pastOrders.map((item, ind) =>
                HistoryItem(item, ind < this.props.pastOrders.length-1))
            : 'No previous orders... Order more!'}
        </ul>
      </div>
    )
  }
}
