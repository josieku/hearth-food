import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';
import { Button, Divider, Grid, Menu, Segment, Message } from 'semantic-ui-react';
import Fuse from 'fuse.js';

import RequestListing from './Main-Requests';
import OrderListing from './Main-Orders';

function UnseenNotifications(item){
  return(
    <Message>
      {item.type}: {item.content} <span style={{color:"gray"}}>{new Date(item.time).toString()}</span>
    </Message>
  )
}

export default class Main extends Component{
  state = {
    profile: this.props.user,
    menu: this.props.user.menu,
    open: false,
    mounted: false,
    requestsOriginal: [],
    ordersOriginal: [],
    requests: [],
    orders: [],
    loadingOrders: true,
    loadingReqs: true,
  }

  componentDidMount = () => {
    this.setState({ mounted: true })
    fetch(`/chef/${this.props.id}`)
    .then(response => response.json())
    .then(profile => this.setState({ profile }))

    fetch(`/chef/${this.props.id}/orders`)
    .then(resp => resp.json())
    .then(orders => this.setState({
      orders,
      ordersOriginal: orders,
      loadingOrders: false,
    }))

    fetch(`/chef/${this.props.id}/requests`)
    .then(resp => resp.json())
    .then(requests => this.setState({
      requests,
      requestsOriginal: requests,
      loadingReqs: false,
    }))
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
      this.setState({ requests, orders,
        requestsOriginal: requests, ordersOriginal: orders });
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

  cancelOrder = async (requestId, comment, index) => {
    if (this.state.mounted && Object.keys(this.props.user).length > 0){
      await fetch(`/chef/${this.props.id}/requests/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ requestId, comment }),
      })
    }
    const orders = this.state.orders.slice();
    orders.splice(index, 1);
    this.setState({ orders });
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

  searchOrders = (input) => {
    if (input.length > 0){
      var options = {
        keys: ['meal.title',
               'consumer.firstName',
               'meal.ingredients',
               'meal.description' ],
        threshold: 0.4
      };
      var fuse = new Fuse(this.state.ordersOriginal, options);
      const orders = fuse.search(input);
      this.setState({ orders });
    } else {
      this.setState({ orders: this.state.ordersOriginal })
    }
  }

  searchRequests = (input) => {
    if (input.length > 0){
      var options = {
        keys: ['meal.title',
               'consumer.firstName',
               'meal.ingredients',
               'meal.description' ],
        threshold: 0.4
      };
      var fuse = new Fuse(this.state.requestsOriginal, options);
      const requests = fuse.search(input);
      this.setState({ requests });
    } else {
      this.setState({ requests: this.state.requestsOriginal })
    }
  }

  sortOrders = indicator => {
    if (indicator === "high"){
      const orders = this.state.orders.slice().sort((a,b)=>a.meal["price"]-b.meal["price"])
      this.setState({ orders })
    } else if (indicator === "low"){
      const orders = this.state.orders.slice().sort((a,b)=>b.meal["price"]-a.meal["price"])
      this.setState({ orders })
    } else if (indicator === "earliest"){
      const orders = this.state.orders.slice().sort((a,b)=>a.time.time-b.time.time)
      console.log(orders[0].time.time, orders[2].time.time)
      this.setState({ orders })
    } else if (indicator === "latest") {
      const orders = this.state.orders.slice().sort((a,b)=>b.time.time-a.time.time)
      console.log(orders[0].time.time, orders[2].time.time)
      this.setState({ orders })
    }
  }

  sortRequests = indicator => {
    if (indicator === "high"){
      const requests = this.state.requests.slice().sort((a,b)=>a.meal["price"]-b.meal["price"])
      this.setState({ requests })
    } else if (indicator === "low"){
      const requests = this.state.requests.slice().sort((a,b)=>b.meal["price"]-a.meal["price"])
      this.setState({ requests })
    } else if (indicator === "earliest"){
      const requests = this.state.requests.slice().sort((a,b)=>a.time.time-b.time.time)
      this.setState({ requests })
    } else if (indicator === "latest") {
      const requests = this.state.requests.slice().sort((a,b)=>b.time.time-a.time.time)
      this.setState({ requests })
    }
  }

  mark = () => {
    this.props.updateNotifs(this.props.notifications.filter(item=>!item.seen));
  }

  render(){
    const profile = this.state.profile;
    const notifs = this.props.notifications;
    return(
      <div>
        {notifs.filter(item=>!item.seen).length > 0
          ? <div>
              <span>
                <strong>New notifications </strong>
                <Button id='redButton' onClick={this.mark}>Mark all as read</Button>
              </span>
              {notifs.filter(item=>!item.seen).map(UnseenNotifications)}
            </div>
          : null
        }
        <Grid columns={2} >
          <Grid.Column width={8} style={{paddingTop:'0em'}}>
            <OrderListing
              changes={this.changesOrders}
              chefId={profile._id}
              cancel={this.cancelOrder}
              complete={this.complete}
              setOrders={this.setOrders}
              orders={this.state.orders}
              sort={this.sortOrders}
              search={this.searchOrders}
              loading={this.state.loadingOrders}
            />
            </Grid.Column>
            <Grid.Column width={8} style={{paddingTop:'0em'}}>
              <RequestListing
                chefId={profile._id}
                accept={this.acceptRequest}
                setRequests={this.setRequests}
                search={this.searchRequests}
                decline={this.decline}
                sort={this.sortRequests}
                loading={this.state.loadingReqs}
                requests={this.state.requests}/>
              </Grid.Column>
            </Grid>
          </div>
        )
      }
    };
