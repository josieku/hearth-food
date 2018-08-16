import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Divider, Item } from 'semantic-ui-react';

function ScheduledItem(item, bool, index, cancel) {
  return (
    <Item key={item._id} className="request-list-item">
      <Item.Header><strong>Chef: </strong>{item.chef.firstName}</Item.Header>
      <Item.Extra><strong>Meal: </strong> {item.meal.title}</Item.Extra>
      <Item.Extra><strong>Pickup Time:</strong> {item.time.date}</Item.Extra>
      <Item.Extra><strong>Requests: </strong>{item.requests ? item.requests : 'None'}</Item.Extra>
      {item.accepted
        ? <button disabled>Cancel</button>
        : <button onClick={() => cancel(item._id, index)}>Cancel</button> }
        {bool ? <Divider/> : null}
    </Item>
  )
}

export default class ScheduledListing extends Component{
  render(){
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
