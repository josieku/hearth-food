import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Item } from 'semantic-ui-react';
import * as Scroll from 'react-scroll';
import { Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

function HistoryItem(item, bool) {
  return (
    <Element key={item._id}>
      <Item key={item._id} className="request-list-item">
        <Item.Header><strong>Chef: </strong>{item.chef.firstName}</Item.Header>
        <Item.Extra><strong>Meal: </strong>{item.meal.title}</Item.Extra>
        <Item.Extra><strong>Date: </strong>{new Date(item.time.date).toString().slice(0,15)}</Item.Extra>
        <Item.Extra><strong>Time: </strong>{item.time.start} to {item.time.end}</Item.Extra>
        <Item.Extra><strong>Requests: </strong>{item.requests ? item.requests : 'None'}</Item.Extra>
        {bool ? <Divider/> : null}
      </Item>
    </Element>
  )
}

export default class HistoryListing extends Component{
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
          {this.props.pastOrders.length > 0
            ? this.props.pastOrders.map((item, ind) =>
                HistoryItem(item, ind < this.props.pastOrders.length-1))
            : <div>
                <p align="center">No previous orders?  Start ordering now!</p>
                <center><Button href="/dashboard">Go to dashboard</Button></center>
              </div>
          }
        </Element>
      </div>
    )
  }
}
