import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';

import Add from './addDishModal';
import MenuListing from './ChefProfile-Menu';

export default class Menu extends Component{
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

  saveDish = (title, description, ingredients, price, cuisine) => {
    const chef = this.state.profile._id;
    console.log('saving', title, description, ingredients, price)
    fetch(`/chef/${this.props.user._id}/menu/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ title, description, ingredients, price, cuisine, chef }),
    })
    .then(resp => resp.json())
    .then(saved => {
      // console.log(saved);
      const menu = this.state.menu.slice();
      menu.push(saved);
      // console.log('menu', menu);
      this.setState({ menu })
      this.props.history.push(`/chef/${this.props.user._id}`)
    })
  }

  render(){
    console.log('in chef landing');
    const profile = this.state.profile;
    return(
      <div>
        <h2>Menu</h2>
        <Switch>
          <Route exact path='/menu/add' render={() =>
            <Add save={this.saveDish}/>}/>

          <Route path="/menu" render={() =>
            <MenuListing id={profile._id} menu={this.state.menu}/>}/>

        </Switch>
      </div>
    )
  }
};