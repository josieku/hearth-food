import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';
import { Button, Divider, Grid, Menu, Segment } from 'semantic-ui-react';

import PendingListing from './Orders-Pending';
import ScheduledListing from './Orders-Scheduled';
import HistoryListing from './Orders-History';


export default class Main extends Component{
  state = {
    profile: this.props.user,
    mounted: false,
    pending: [],
    scheduled: [],
    history: [],
    activeItem: "scheduled"
  }

  componentDidMount = () => {
    this.setState({ mounted: true })
    fetch(`/user/${this.props.user._id}/orders`)
    .then(response => response.json())
    .then(orders => this.setState({
      pending: orders.filter(item => !item.accepted || !item.payment),
      scheduled: orders.filter(item => item.accepted && item.payment && !item.expired),
      history: orders.filter(item => item.expired)
    }))
  }

  cancel = () => {
    // cancel request function
    // updates request to cancel = true
    // append previous version to new updated version
  }

  segmentDisplay = (item) => {
    console.log('switched')
    if(item === "pending") {
      return <PendingListing pending={this.state.pending} cancel={this.cancel}/>
    } else if (item === "scheduled") {
        return <ScheduledListing scheduled={this.state.scheduled} cancel={this.cancel}/>
    } else {
      return <HistoryListing pastOrders={this.state.history}/>
    }
  };

  handleClick = (e, { name }) => {
    console.log("CLICKED")
    this.setState({activeItem: name})
  }

  render(){
    const profile = this.state.profile;
    const { activeItem } = this.state;
    return(
      <div>
            <Menu fluid tabular>
              <Menu.Item name="scheduled Orders" active={activeItem === "scheduled"} onClick={this.handleClick} />
              <Menu.Item name="pending orders" active={activeItem === "pending"} onClick={this.handleClick} />
              <Menu.Item name="past Orders" active={activeItem === "past"} onClick={this.handleClick} />
            </Menu>
            <Segment>
              {this.segmentDisplay(this.state.activeItem)}
            </Segment>
      </div>
    )
  }
};
