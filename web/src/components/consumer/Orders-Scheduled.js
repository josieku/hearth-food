import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Header, Item } from 'semantic-ui-react';
import * as Scroll from 'react-scroll';
import { Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

function ScheduledItem(item, bool, index, cancel) {
  return (
    <Element key={item._id}>
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
    </Element>
  )
}

export default class ScheduledListing extends Component{
  render(){
    const style ={
      position: 'relative',
      height: '400px',
      overflowY: 'scroll',
      overflowX: 'hidden',
      marginBottom: '100px',
    }
    return(
      <div>
        <Element id="history-listings" style={style}>
          {this.props.scheduled.length > 0
            ? this.props.scheduled.map((item, ind) => ScheduledItem(item, ind < this.props.scheduled.length-1, ind, this.props.cancel))
            : <div>
              <Header align="center">No scheduled requests, order more!!</Header>
              <center><Button href="/dashboard" id="redButton">Go to dashboard</Button></center>
            </div>}
        </Element>
      </div>
    )
  }
}
