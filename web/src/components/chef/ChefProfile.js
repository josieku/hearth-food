import React, { Component } from "react";
import { Route, Link } from 'react-router-dom';

import Add from './addDishModal';

function MenuListing(menu) {
  return (
    <ul style={{listStyleType: "none"}}>
      {menu ? menu.map(MenuListItem): 'Empty menu :(  Add dishes now!'}
    </ul>
  )
}

function MenuListItem(item) {
  return (
    <li key={item._id} className="menu-list-item" style={{border:"1px solid black"}}>
      <Link to={`/meal/${item._id}`}><p><strong>{item.title}</strong></p></Link>
      <p>Description: {item.description}</p>
      <p>Ingredients: {item.ingredients}</p>
      <p>Price: {item.price}</p>
      <p>Number of reviews: {item.reviews.length}</p>
      <p>Status: {item.status}</p>
    </li>
  )
}

export default class ChefProfile extends Component{
  state = {
    profile: this.props.user,
    menu: this.props.user.menu,
    open: false,
  }

  componentDidMount = async e => {
    // if user does not exist, redirects user back to login page
    if (Object.keys(this.props.user).length===0){
      this.props.history.push('/auth/login')
    }
    // else fetch the profile of the chef
    const response = await fetch(`/chef/${this.props.id}`);
    const profile = await response.json();
    this.setState({ profile: profile })
  }

  saveDish = (title, description, ingredients, price, cuisine) => {
    const chef = this.state.profile._id;
    console.log('saving', title, description, ingredients, price)
    fetch(`/chef/${this.props.user._id}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ title, description, ingredients, price, cuisine, chef }),
    })
    .then(resp => resp.json())
    .then(saved => {
      console.log(saved);
      const menu = this.state.menu.slice();
      menu.push(saved);
      console.log('menu', menu);
      this.setState({ menu })
    })
  }

  render(){
    console.log(this.props);
    return(
      <div>
        <p>Consumer Profile</p>
        <div style={{border:"1px solid black"}}>
          <h4>{this.state.profile.firstName}</h4>
          <img src={this.state.profile.picture} height="150px" width="150px"/>
          {this.state.profile.verified ? <p>Verified</p> : null }
          <p>Current Rating: {this.state.profile.rating} </p>
        </div>
        <div style={{border:"1px solid black"}}>
          <button><Link to={`/chef/${this.state.profile._id}/add`}>Add a Dish</Link></button>
          {MenuListing(this.state.menu)}
        </div>
        <Route path={`/chef/${this.state.profile._id}/add`} render={() => <Add save={this.saveDish}/>}/>
      </div>
    )
  }
};
