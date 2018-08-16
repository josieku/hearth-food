import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Header, Item, Loader, Menu, Segment } from 'semantic-ui-react';

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
    return(
      <div>
        <Menu text fluid id="header" style={{padding: '3px'}}>
        <Menu.Item header style={{color: 'white'}}>Request History</Menu.Item>
      </Menu>
      {this.state.loadingHistory
      ? <Loader active inline='centered'>Loading your past meals</Loader> :
      <ul style={{listStyleType: "none"}}>
        {this.state.history.length > 0
          ? this.state.history.map(HistoryItem)
          : 'No history yet'}
        </ul>
    }
      </div>
    )
  }
}
