import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Divider, Item } from 'semantic-ui-react';

function ScheduledItem(item, bool, index, cancel) {
  return (
    <Item key={item._id} className="request-list-item" style={{border:"1px solid black"}}>
      <Item.Header>Chef: {item.chef.firstName}</Item.Header>
      <Item.Extra>Meal: {item.meal.title}</Item.Extra>
      <Item.Extra>Pickup Time: {item.time}</Item.Extra>
      <Item.Extra>Requests: {item.requests ? item.requests : 'None'}</Item.Extra>
      {item.accepted
        ? <button disabled>Cancel</button>
        : <button onClick={() => cancel(item._id, index)}>Cancel</button> }
        {bool ? <Divider/> : null}
    </Item>
  )
}

export default class ScheduledListing extends Component{
  render(){
    console.log(this.props.scheduled.length)
    return(
      <div>
        <ul style={{listStyleType: "none"}}>
          {this.props.scheduled.length > 0
            ? this.props.scheduled.map((item, ind) => ScheduledItem(item, ind < this.props.scheduled.length-1, ind, this.props.cancel))
            : 'No scheduled requests, order more!!'}
        </ul>
      </div>
    )
  }
}
