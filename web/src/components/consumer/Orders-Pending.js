import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Header, Item } from 'semantic-ui-react';
import * as Scroll from 'react-scroll';
import { Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

function PendingItem(item, bool, index, cancel) {
  return (
    <Element key={item._id}>
      <Item key={item._id} className="request-list-item">
        <Item.Header><strong>Chef: </strong>{item.chef.firstName}</Item.Header>
        <Item.Extra><strong>Meal:</strong> {item.meal.title}</Item.Extra>
        <Item.Extra><strong>Date: </strong>{new Date(item.time.date).toString().slice(0,15)}</Item.Extra>
        <Item.Extra><strong>Time: </strong>{item.time.start} to {item.time.end}</Item.Extra>
        <Item.Extra><strong>Requests: </strong>{item.requests ? item.requests : 'None'}</Item.Extra>
        <Item.Extra><strong>Awaiting: </strong>{item.accepted ?  <span>Customer Payment <Button>Pay now</Button></span> : "Chef Approval"}</Item.Extra>
        <Button onClick={() => cancel(item._id, index)}>Cancel</Button>
          {bool ? <Divider/> : null}
      </Item>
    </Element>
  )
}

export default class PendingListing extends Component{
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
          {this.props.pending.length > 0
            ? this.props.pending.map((item, ind) => PendingItem(item, ind < this.props.pending.length-1, ind, this.props.cancel))
            : <div>
                <Header align="center">No pending requests, request now!!</Header>
                <center><Button href="/dashboard" id="redButton">Go to dashboard</Button></center>
              </div>
          }
        </Element>
      </div>
    )
  }
}
