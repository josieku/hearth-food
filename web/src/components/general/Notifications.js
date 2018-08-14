import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Header, Item, Menu, Segment } from 'semantic-ui-react';

export default class Notifications extends Component{
  state = {
    unread: true,
    notifications: this.props.notifications
  }

  mark = (e) => {
    e.preventDefault()
    // console.log('marking');
    const unseen = this.props.notifications.filter(item => !item.seen);
    // console.log('unseen', unseen);
    // console.log(this.props.update)
    this.props.update(unseen);
  }

  notifListing = (item) => {
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={13}>
            <Item key={item._id} id={`notification-${item.seen}`}>
              <Item.Content><strong>Type: </strong>{item.type}</Item.Content>
              <Item.Content><strong>Time: </strong>{new Date(item.time).toString()}</Item.Content>
              {item.meal ? <Item.Content><strong>Meal: </strong>{item.meal.title}</Item.Content>: null}
              <Item.Content>{item.content}</Item.Content>
            </Item>
          </Grid.Column>
          <Grid.Column width={3} verticalAlign='middle'>
            <Button size='mini' id='redButton' icon='trash alternate'></Button>
          </Grid.Column>
        </Grid.Row>
          <Divider />
      </Grid>
    )
  }

  renderNotifs = (bool) => {
    if (bool && this.props.notifications.length > 0 ) {
      const listing = this.props.notifications.filter(item => !item.seen).map(this.notifListing);
      return listing.length > 0 ? listing : "No unread notifications";
    } else if (!bool && this.props.notifications.length > 0){
      return this.props.notifications.map(this.notifListing);
    } else{
      return "No notifications"
    }
  }

  render(){
    return(
      <div>
        <Menu text fluid id="notificationHead">
          <Menu.Item header>Notifications</Menu.Item>
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
          {this.renderNotifs(this.state.unread)}
        </ul>
      </div>
    )
  }
}