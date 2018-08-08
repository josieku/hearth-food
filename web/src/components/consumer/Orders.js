import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';

import PendingListing from './Orders-Pending';
import ScheduledListing from './Orders-Scheduled';
import HistoryListing from './Orders-History';

export default class Main extends Component{
  state = {
    profile: this.props.user,
    mounted: false,
    pending: [],
    scheduled: [],
    history: []
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

  render(){
    const profile = this.state.profile;
    return(
      <div>
        <PendingListing pending={this.state.pending} cancel={this.cancel}/>
        <ScheduledListing scheduled={this.state.scheduled} cancel={this.cancel}/>
        <HistoryListing history={this.state.history}/>
      </div>
    )
  }
};
