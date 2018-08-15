import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';
import Fuse from 'fuse.js'

import Add from './Menu-Add';
import MenuListing from './Menu-Listing';
// import Edit from './Menu-Edit';
// import SetAvailability from './Menu-SetAvailability';

export default class Menu extends Component{
  state = {
    profile: this.props.user,
    menu: [],
    menuOriginal: [],
    open: false,
    loading: true,
    saving: false,
  }

  componentDidMount = () => {
    fetch(`/chef/${this.props.user._id}`)
      .then(response => response.json())
      .then(profile => this.setState({
        profile,
        menu: profile.menu,
        menuOriginal: profile.menu,
        loading: false
      }))
  }

  saveDish = (title, description, ingredients, price, cuisine, recipe, picture) => {
    const chef = this.state.profile._id;
    this.setState({ saving: true })
    fetch(`/chef/${chef}/menu/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ title, description, ingredients, price, cuisine,
        chef, recipe, picture }),
    })
    .then(resp => resp.json())
    .then(saved => {
      const menu = this.state.menu.slice();
      menu.push(saved);
      this.setState({ menu, saving: false })
      this.props.history.push(`/dashboard/menu`)
    })
  }

  searchMenu = (input) => {
    console.log(this.state.menuOriginal)
    if (input.length > 0){
      var options = {
        keys: ['title',
               'description',
               'ingredients'],
        threshold: 0.4
      };
      var fuse = new Fuse(this.state.menuOriginal, options);
      const menu = fuse.search(input);
      this.setState({ menu });
    } else {
      this.setState({ menu: this.state.menuOriginal })
    }
  }

  sortMenu = (indicator) => {
    if (indicator === "high"){
      const menu = this.state.menu.slice().sort((a,b)=>a["price"]-b["price"])
      this.setState({ menu })
    } else if (indicator === "low"){
      const menu = this.state.menu.slice().sort((a,b)=>b["price"]-a["price"])
      this.setState({ menu })
    }
  }

  render(){
    const profile = this.state.profile;
    const menu = this.state.menu.filter(item=>!item.archived);
    return(
      <div>
        <Switch>
          <Route exact path='/dashboard/menu/add' render={(props) =>
            <Add save={this.saveDish} loading={this.state.saving}
              {...props}/>}/>

          <Route path="/dashboard/menu" render={(props) =>
            <MenuListing id={profile._id} search={this.searchMenu}
                         loading={this.state.loading}
                         first={menu.length > 0 ? menu[0] : null}
                         sort={this.sortMenu} menu={menu} {...props}/>}/>

        </Switch>
      </div>
    )
  }
};
