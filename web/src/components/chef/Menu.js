import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';

import Add from './Menu-Add';
import MenuListing from './Menu-Listing';
// import Edit from './Menu-Edit';
// import SetAvailability from './Menu-SetAvailability';

export default class Menu extends Component{
  state = {
    profile: this.props.user,
    menu: [],
    open: false,
  }

  componentDidMount = () => {
    fetch(`/chef/${this.props.user._id}`)
      .then(response => response.json())
      .then(profile => this.setState({ profile, menu: profile.menu }))
  }

  saveDish = (title, description, ingredients, price, cuisine) => {
    const chef = this.state.profile._id;
    fetch(`/chef/${chef}/menu/add`, {
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
      console.log('menu', this.state.menu)
      this.props.history.push(`/dashboard/menu`)
    })
  }

  render(){
    const profile = this.state.profile;
    return(
      <div>
        <Switch>
          <Route exact path='/dashboard/menu/add' render={(props) =>
            <Add save={this.saveDish} {...props}/>}/>

          <Route path="/dashboard/menu" render={(props) =>
            <MenuListing id={profile._id}
                         menu={this.state.menu.filter(item=>!item.archived)} {...props}/>}/>

        </Switch>
      </div>
    )
  }
};
