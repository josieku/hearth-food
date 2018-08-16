import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Divider, Item, Button } from 'semantic-ui-react'

function PendingItem(item, bool, index, cancel) {
  return (
    <Item key={item._id} className="request-list-item">
      <Item.Header><strong>Chef: </strong>{item.chef.firstName}</Item.Header>
      <Item.Extra><strong>Meal: {item.meal.title}</strong></Item.Extra>
      <Item.Extra><strong>Date: </strong>{new Date(item.time.date).toString().slice(0,15)}</Item.Extra>
      <Item.Extra><strong>Time: </strong>{item.time.start} to {item.time.end}</Item.Extra>
      <Item.Extra><strong>Requests: </strong>{item.requests ? item.requests : 'None'}</Item.Extra>
      <Item.Extra><strong>Awaiting: </strong>{item.accepted ?  <span>Customer Payment <Button>Pay now</Button></span> : "Chef Approval"}</Item.Extra>
      <Button onClick={() => cancel(item._id, index)}>Cancel</Button>
        {bool ? <Divider/> : null}
    </Item>
  )
}

export default class PendingListing extends Component{
  render(){
    return(
      <div>
        <ul style={{listStyleType: "none"}}>
          {this.props.pending.length > 0
            ? this.props.pending.map((item, ind) => PendingItem(item, ind < this.props.pending.length-1, ind, this.props.cancel))
            : 'No pending requests, order more!!'}
        </ul>
      </div>
    )
  }
}
