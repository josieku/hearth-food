import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Header, Item, Menu, Segment, Loader } from 'semantic-ui-react';

export default class Notifications extends Component{
  state = {
    unread: true,
    notifications: this.props.notifications
  }

  mark = (e) => {
    e.preventDefault()
    const unseen = this.props.notifications.filter(item => !item.seen);
    this.props.update(unseen);
  }

  notifListing = (item, ind) => {
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={15}>
            <Item key={item._id} id={`notification-${item.seen}`}>
              <Item.Content><strong>Type: </strong>{item.type}</Item.Content>
              <Item.Content><strong>Time: </strong>{new Date(item.time).toString()}</Item.Content>
              {item.meal ? <Item.Content><strong>Meal: </strong>{item.meal.title}</Item.Content>: null}
              <Item.Content>{item.content}</Item.Content>
            </Item>
          </Grid.Column>
          <Grid.Column width={1} verticalAlign='middle'>
            <Button size='mini'
                    id='redButton'
                    icon='trash alternate'
                    onClick={()=>{this.props.delete(item._id,ind)}}
                  />
          </Grid.Column>
        </Grid.Row>
          <Divider />
      </Grid>
    )
  }

  renderNotifs = (bool) => {
    if (bool && this.props.notifications.length > 0 ) {
      const listing = this.props.notifications
                                .filter(item => !item.seen)
                                .map((item, ind)=>this.notifListing(item, ind));
      return listing.length > 0 ? listing : "No unread notifications";
    } else if (!bool && this.props.notifications.length > 0){
      return this.props.notifications.map((item, ind)=>this.notifListing(item, ind));
    } else{
      return "No notifications"
    }
  }

  render(){
    return(
      <div>
        <Menu text fluid id="header">
          <Menu.Item header style={{color: 'white'}}>Notifications</Menu.Item>
          <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
            <Button onClick={this.mark} id="redButton">
              Mark all as read
            </Button>
            { this.state.unread
              ? <Button onClick={()=>this.setState({ unread: false })} size="mini" id="redButton">
                See all notifications
              </Button>
              : <Button onClick={()=>this.setState({ unread: true })} size="mini" id="redButton">
                See unread notifications
              </Button>
            }
          </Menu.Menu>
        </Menu>
        <ul style={{listStyleType: "none"}}>
          {this.props.loading
            ? <Loader active inline='centered'>
                Optimizing your dining experience...
              </Loader>
            : this.renderNotifs(this.state.unread)}
        </ul>
      </div>
    )
  }
}
