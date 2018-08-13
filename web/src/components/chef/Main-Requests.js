import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Dropdown, Grid, Input, Item, Menu } from 'semantic-ui-react';

function RequestItem(item, index, accept) {
  return (
    <Item key={item._id} className="request-list-item">
      <Item.Header>Customer: {item.consumer.firstName}</Item.Header>
      <Item.Extra>Meal: {item.meal.title}</Item.Extra>
      <Item.Extra>Date: {new Date(item.time.date).toString().slice(0,15)}</Item.Extra>
      <Item.Extra>Time: {item.time.start} to {item.time.end}</Item.Extra>
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
          <Grid.Row>
            <Menu text id="availableMeals">
              <Menu.Item header>Requests</Menu.Item>
              <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
              <Input placeholder='Search...'/>
                  <Dropdown icon='filter' floating button className='icon'>
                    <Dropdown.Menu>
                      <Dropdown.Header content='Filter by selection' />
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={()=>{this.sort("high")}}>Price: Low to High
                      </Dropdown.Item>
                      <Dropdown.Item onClick={()=>{this.sort("low")}}>Price: High to Low</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Menu>
            </Menu>
          </Grid.Row>
          {this.props.requests.length > 0
            ? this.props.requests.map((item, ind) => RequestItem(item, ind, this.props.accept))
            : 'No requests, start sharing your dishes!'}
      </Grid.Column>
      </div>
    )
  }
}
