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
    activeItem: "Scheduled Orders"
  }

  componentDidMount = () => {
    this.setState({ mounted: true })
    fetch(`/user/${this.props.user._id}/orders`)
    .then(response => response.json())
    .then(orders => this.setState({
      pending: orders.filter(item => !item.accepted && !item.expired ),
      scheduled: orders.filter(item => item.accepted && !item.expired),
      history: orders.filter(item => item.expired)
    }))
  }

  cancel = (requestId, index) => {
    // cancel request function
    // updates request to cancel = true
    // append previous version to new updated version
    fetch(`/user/${this.props.user._id}/request/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ requestId }),
    })
    .then(resp => resp.json())
    .then(saved => {
      const pending = this.state.pending.slice();
      pending.splice(index, 1);
      const history = this.state.history.slice();
      history.push(saved);
      this.setState({ pending, history })
    })
  }

  segmentDisplay = (item) => {
    if(item === "Pending Orders") {
      return <PendingListing pending={this.state.pending} cancel={this.cancel}/>
    } else if (item === "Scheduled Orders") {
        return <ScheduledListing scheduled={this.state.scheduled} cancel={this.cancel}
                    />
    } else {
      return <HistoryListing pastOrders={this.state.history}/>
    }
  };

  handleClick = (e, { name }) => {
    this.setState({activeItem: name})
  }

  render(){
    const profile = this.state.profile;
    const { activeItem } = this.state;
    return(
      <div>
        <Menu text id="header" attached>
          <Menu.Item header style={{color: 'white'}}>Your Orders</Menu.Item>
        </Menu>
        <Segment>
            <Menu fluid tabular>
              <Menu.Item name="Scheduled Orders" active={activeItem === "Scheduled Orders"} onClick={this.handleClick} />
              <Menu.Item name="Pending Orders" active={activeItem === "Pending Orders"} onClick={this.handleClick} />
              <Menu.Item name="Past Orders" active={activeItem === "Past Orders"} onClick={this.handleClick} />
            </Menu>
              {this.segmentDisplay(this.state.activeItem)}
          </Segment>
      </div>
    )
  }
};
