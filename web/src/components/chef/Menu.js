import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';

import Add from './Menu-Add';
import MenuListing from './Menu-Listing';
// import SetAvailability from './Menu-SetAvailability';

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
      .then(profile => this.setState({ profile, menu: profile.menu }))
  }

  saveDish = (title, description, ingredients, price, cuisine) => {
    const chef = this.state.profile._id;
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
      const menu = this.state.menu.slice();
      menu.push(saved);
      this.setState({ menu })
      this.props.history.push(`/dashboard/menu`)
    })
  }

  render(){
    console.log('in chef landing');
    const profile = this.state.profile;
    return(
      <div>
        <Switch>
          <Route exact path='/dashboard/menu/add' render={(props) =>
            <Add save={this.saveDish} {...props}/>}/>

          <Route exact path="/dashboard/menu" render={(props) =>
            <MenuListing id={profile._id}
                         menu={this.state.menu} {...props}/>}/>

        </Switch>
      </div>
    )
  }
};
