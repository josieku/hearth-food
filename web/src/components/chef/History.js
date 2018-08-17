import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Header, Item, Loader, Menu, Segment } from 'semantic-ui-react';
import * as Scroll from 'react-scroll';
import { Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

function HistoryItem(item) {
  return (
    <Item key={item._id} className="history-list-item">
      <Item.Content><strong> Customer: </strong>{item.consumer.firstName}</Item.Content>
      <Item.Content><strong>Meal: </strong>{item.meal.title}</Item.Content>
      <Item.Content><strong>Time: </strong>{item.time.date}</Item.Content>
      <Item.Content><strong>Status: </strong>
        {item.completed
          ? <span style={{fontWeight: "bold"}}>Done!</span>
          : item.declineComment
          ? <span>
              <span style={{fontWeight: "bold"}}> Declined. </span>
              <span style={{fontStyle:"italic"}}>Reasoning: `{item.declineComment}`</span>
            </span>
          : <span>Expired...</span>
        }
      </Item.Content>
      <Item.Content><strong>Additional requests: </strong>{item.requests ? item.requests : 'None'}</Item.Content>
      <Divider/>
    </Item>
  )
}

export default class HistoryListing extends Component{
  state = {
    history: [],
    loadingHistory: true
  }

  componentDidMount = () => {
    fetch(`/chef/${this.props.chefId}/history`)
    .then(resp => resp.json())
    .then(history => this.setState({ history, loadingHistory: false }))
  }

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
        <Menu text fluid id="header" style={{padding: '3px'}}>
        <Menu.Item header style={{color: 'white'}}>Request History</Menu.Item>
      </Menu>
      <Segment piled style={{marginTop: 0, height: "500px"}}>
        {this.state.loadingHistory
          ? <Loader active inline='centered'>Loading your past meals</Loader>
          : <Element id="history-listings" style={style}>
              {this.state.history.length > 0
                ? this.state.history.map(HistoryItem)
                : 'No past orders... Share your meals now!!'}
            </Element>
        }
      </Segment>
      </div>
    )
  }
}
