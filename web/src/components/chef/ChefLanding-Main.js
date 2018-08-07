import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';

import RequestListing from './ChefProfile-Requests';
import OrderListing from './ChefProfile-Orders';

export default class Main extends Component{
  state = {
    profile: this.props.user,
    menu: this.props.user.menu,
    open: false,
  }

  componentDidMount = () => {
    // if user does not exist, redirects user back to login page
    // if (Object.keys(this.props.user).length===0){
    //   this.props.history.push('/auth/login');
    // } else if (this.props.user._id !== this.props.id){
    //   this.props.history.goBack();
    // }
    // else fetch the profile of the chef
    fetch(`/chef/${this.props.id}`)
      .then(response => response.json())
      .then(profile => this.setState({ profile }))

  }

  render(){
    const profile = this.state.profile;
    return(
      <div>
        <p>Chef Landing - Main</p>
        <RequestListing chefId={profile._id} />
        <OrderListing chefId={profile._id} />
        {/* <Switch>
          <Route exact path={`/chef/${profile._id}/add`} render={() =>
            <Add save={this.saveDish}/>}/>

          <Route exact path={`/chef/${profile._id}/requests`} render={() =>
            <RequestListing chefId={profile._id} />}/>

          <Route exact path={`/chef/${profile._id}/orders`} render={() =>
            <OrderListing chefId={profile._id} />}/>

          <Route exact path={`/chef/${profile._id}/history`} render={() =>
            <HistoryListing chefId={profile._id} />}/>

          <Route path={`/chef/${profile._id}`} render={() =>
            <MenuListing id={profile._id} menu={this.state.menu}/>}/>

        </Switch> */}
      </div>
    )
  }
};
