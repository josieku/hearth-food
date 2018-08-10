import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';
import { Button, Divider, Grid, Menu, Segment } from 'semantic-ui-react';

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
        <Grid columns={2} >
          <Grid.Column width={8} >
            <OrderListing
              chefId={profile._id}
              complete={this.complete}
              setOrders={this.setOrders}
              orders={this.state.orders} />
            </Grid.Column>
            <Grid.Column width={8}>
              <RequestListing
                chefId={profile._id}
                accept={this.acceptRequest}
                setRequests={this.setRequests}
                requests={this.state.requests}/>
              </Grid.Column>
            </Grid>
          </div>
        )
      }
    };
