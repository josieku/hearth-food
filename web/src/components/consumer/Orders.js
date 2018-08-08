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

  // acceptRequest = async (requestId, index) => {
  //   // console.log('accepting');
  //   // console.log(this.state.mounted, Object.keys(this.props.user).length)
  //   if (this.state.mounted && Object.keys(this.props.user).length > 0){
  //     await fetch(`/chef/${this.props.chefId}/requests/accept`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       credentials: 'same-origin', // <- this is mandatory to deal with cookies
  //       body: JSON.stringify({ requestId }),
  //     })
  //     const requests = this.state.requests.slice();
  //     const accepted = requests.splice(index, 1)[0];
  //     const orders = this.state.orders.slice();
  //     orders.push(Object.create(accepted));
  //     this.setState({ requests, orders });
  //   }
  // }
  // complete = async (requestId, index) => {
  //   if (this.state.mounted && Object.keys(this.props.user).length > 0){
  //     await fetch(`/chef/${this.props.id}/complete`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'same-origin', // <- this is mandatory to deal with cookies
  //       body: JSON.stringify({ requestId }),
  //     })
  //   }
  //   const orders = this.state.orders.slice();
  //   orders.splice(index, 1);
  //   this.setState({ orders });
  // }

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
        {/* <RequestListing chefId={profile._id}
                        accept={this.acceptRequest}
                        setRequests={this.setRequests}
                        requests={this.state.requests}/>
        <OrderListing chefId={profile._id}
                      complete={this.complete}
                      setOrders={this.setOrders}
                      orders={this.state.orders} /> */}
      </div>
    )
  }
};
