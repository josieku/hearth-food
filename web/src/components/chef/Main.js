import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';

import RequestListing from './Main-Requests';
import OrderListing from './Main-Orders';

export default class Main extends Component{
  state = {
    profile: this.props.user,
    menu: this.props.user.menu,
    open: false,
    mounted: false,
    requests: [],
    orders: [],
  }

  componentDidMount = () => {
    // if user does not exist, redirects user back to login page
    // if (Object.keys(this.props.user).length===0){
    //   this.props.history.push('/auth/login');
    // } else if (this.props.user._id !== this.props.id){
    //   this.props.history.goBack();
    // }
    // else fetch the profile of the chef
    this.setState({ mounted: true })
    fetch(`/chef/${this.props.id}`)
      .then(response => response.json())
      .then(profile => this.setState({ profile }))

    fetch(`/chef/${this.props.id}/orders`)
      .then(resp => resp.json())
      .then(orders => this.setState({ orders }))

    fetch(`/chef/${this.props.id}/requests`)
      .then(resp => resp.json())
      .then(requests => this.setState({ requests }))
  }

  acceptRequest = async (requestId, index) => {
    // console.log('accepting');
    // console.log(this.state.mounted, Object.keys(this.props.user).length)
    if (this.state.mounted && Object.keys(this.props.user).length > 0){
      await fetch(`/chef/${this.props.chefId}/requests/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // <- this is mandatory to deal with cookies
        body: JSON.stringify({ requestId }),
      })
      const requests = this.state.requests.slice();
      const accepted = requests.splice(index, 1)[0];
      const orders = this.state.orders.slice();
      orders.push(Object.create(accepted));
      this.setState({ requests, orders });
    }
  }
  complete = async (requestId, index) => {
    if (this.state.mounted && Object.keys(this.props.user).length > 0){
      await fetch(`/chef/${this.props.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // <- this is mandatory to deal with cookies
        body: JSON.stringify({ requestId }),
      })
    }
    const orders = this.state.orders.slice();
    orders.splice(index, 1);
    this.setState({ orders });
  }


  render(){
    const profile = this.state.profile;
    return(
      <div>
        <p>Chef Landing - Main</p>
        <RequestListing chefId={profile._id}
                        accept={this.acceptRequest}
                        setRequests={this.setRequests}
                        requests={this.state.requests}/>
        <OrderListing chefId={profile._id}
                      complete={this.complete}
                      setOrders={this.setOrders}
                      orders={this.state.orders} />
      </div>
    )
  }
};
