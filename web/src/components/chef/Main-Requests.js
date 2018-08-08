import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Item, Menu, Segment } from 'semantic-ui-react';

function RequestItem(item, index, accept) {
  return (
    <Item key={item._id} className="request-list-item">
      <Item.Header>Customer: {item.consumer.firstName}</Item.Header>
      <Item.Extra>Meal: {item.meal.title}</Item.Extra>
      <Item.Extra>Time: {item.time}</Item.Extra>
      <Item.Extra>Requests: {item.requests ? item.requests : 'None'}</Item.Extra>
      {item.accepted
        ? <button disabled>Accept</button>
        : <button onClick={() => accept(item._id, index)}>Accept</button> }
        <Divider />
    </Item>
  )
}

export default class RequestListing extends Component{
  render(){
    return(
      <div>
        <Grid.Column>
        <h2 id="chefLandingHeader">Requests</h2>
          {this.props.requests.length > 0
            ? this.props.requests.map((item, ind) => RequestItem(item, ind, this.props.accept))
            : 'No requests, start sharing your dishes!'}
      </Grid.Column>
      </div>
    )
  }
}
