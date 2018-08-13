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

  changesOrders = async (requestId, index, time) => {
    //make changes to ORDERS
    console.log('BEFORE!!!!',this.state.orders);
    if (this.state.mounted && Object.keys(this.props.user).length > 0){
      await fetch(`/chef/${this.props.id}/requests/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ requestId, time }),
      })
      .then(resp => resp.json())
      .then(request => {
        const orders = this.state.orders.slice();
        orders.splice(index, 1, request);
        console.log('after!!!!!', orders);
        this.setState({ orders })
      })
    }
  }

  complete = async (requestId, index) => {
    if (this.state.mounted && Object.keys(this.props.user).length > 0){
      await fetch(`/chef/${this.props.id}/requests/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ requestId }),
      })
    }
    const orders = this.state.orders.slice();
    orders.splice(index, 1);
    this.setState({ orders });
  }

  decline = (requestId, comment, index) => {
    console.log('declining')
    if (this.state.mounted && Object.keys(this.props.user).length > 0){
      fetch(`/chef/${this.props.id}/requests/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ requestId, comment }),
      })
    }
    const requests = this.state.requests.slice();
    requests.splice(index, 1);
    this.setState({ requests });
  }

  render(){
    const profile = this.state.profile;
    return(
      <div>
        <Grid columns={2} >
          <Grid.Column width={8} >
            <OrderListing
              changes={this.changesOrders}
              chefId={profile._id}
              complete={this.complete}
              setOrders={this.setOrders}
              orders={this.state.orders}
            />
            </Grid.Column>
            <Grid.Column width={8}>
              <RequestListing
                chefId={profile._id}
                accept={this.acceptRequest}
                setRequests={this.setRequests}
                decline={this.decline}
                requests={this.state.requests}/>
              </Grid.Column>
            </Grid>
          </div>
        )
      }
    };
