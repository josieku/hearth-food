import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';
import { Button, Divider, Grid, Menu, Segment, Input, Loader } from 'semantic-ui-react';
import Fuse from 'fuse.js';

import PendingListing from './Orders-Pending';
import ScheduledListing from './Orders-Scheduled';
import HistoryListing from './Orders-History';


export default class Main extends Component{
  state = {
    profile: this.props.user,
    mounted: false,
    orders: [],
    pending: [],
    pendingOriginal: [],
    scheduled: [],
    scheduledOriginal: [],
    history: [],
    historyOriginal: [],
    activeItem: "Scheduled Orders",
    loading: true,
  }

  componentDidMount = () => {
    this.setState({ mounted: true })
    fetch(`/user/${this.props.user._id}/orders`)
    .then(response => response.json())
    .then(orders => this.setState({
      orders,
      pending: orders.filter(item => !item.accepted && !item.expired ),
      pendingOriginal: orders.filter(item => !item.accepted && !item.expired ),
      scheduled: orders.filter(item => item.accepted && !item.expired),
      scheduledOriginal: orders.filter(item => item.accepted && !item.expired),
      history: orders.filter(item => item.expired),
      historyOriginal: orders.filter(item => item.expired),
      loading: false
    }))

    if (this.state.loading){
      if (this.props.show === "pending"){
        this.setState({
          activeItem: "Pending Orders"
        })
      } else if (this.props.show === "past"){
        this.setState({
          activeItem: "Past Orders"
        })
      } else {
        this.setState({
          activeItem: "Scheduled Orders"
        })
      }
    }
  }

  cancel = (requestId, index) => {
    fetch(`/user/${this.props.user._id}/request/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ requestId }),
    })
    .then(resp => resp.json())
    .then(saved => {
      const pending = this.state.pending.slice();
      pending.splice(index, 1);
      const history = this.state.history.slice();
      history.push(saved);
      this.setState({
        pending,
        pendingOriginal: pending,
        history,
        historyOriginal: history
      })
    })
  }

  segmentDisplay = (item) => {
    if(item === "Pending Orders") {
      return <PendingListing pending={this.state.pending} cancel={this.cancel}/>
    } else if (item === "Scheduled Orders") {
        return <ScheduledListing scheduled={this.state.scheduled} cancel={this.cancel}/>
    } else {
      return <HistoryListing pastOrders={this.state.history}/>
    }
  };

  handleClick = (e, { name }) => {
    this.setState({activeItem: name})
  }

  search = input => {
    if (input.length > 0){
      var options = {
        keys: ['meal.title',
               'meal.description',
               'meal.ingredients',
               'time.date',
               'time.start',
               'chef.firstName',
               'meal.cuisine'
             ],
        threshold: 0.4
      };
      var fuse = new Fuse(this.state.orders, options);
      const orders = fuse.search(input);
      this.setState({
        pending: orders.filter(item => !item.accepted && !item.expired),
        scheduled: orders.filter(item => item.accepted && !item.expired),
        history: orders.filter(item => item.expired),
      });
    } else {
      this.setState({
        pending: this.state.pendingOriginal,
        scheduled: this.state.scheduledOriginal,
        history: this.state.historyOriginal
      })
    }
  }

  render(){
    const profile = this.state.profile;
    const { activeItem } = this.state;
    return(
      <div>
        <Menu text id="header" attached>
          <Menu.Item header style={{color: 'white'}}>Your Orders</Menu.Item>
          <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
            <Input id='searchInHeader' icon='search' placeholder='Search...' onChange={(e)=>this.search(e.target.value)}/>
          </Menu.Menu>
        </Menu>
        <Segment style={{height: "500px"}}>
            <Menu fluid tabular>
              <Menu.Item name="Scheduled Orders" active={activeItem === "Scheduled Orders"} onClick={this.handleClick} />
              <Menu.Item name="Pending Orders" active={activeItem === "Pending Orders"} onClick={this.handleClick} />
              <Menu.Item name="Past Orders" active={activeItem === "Past Orders"} onClick={this.handleClick} />
            </Menu>
              {this.state.loading
                ? <Loader active inline='centered'>Bringing up your orders...</Loader>
                : this.segmentDisplay(this.state.activeItem)}
          </Segment>
      </div>
    )
  }
};
