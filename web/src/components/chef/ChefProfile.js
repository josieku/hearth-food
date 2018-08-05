import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';

import Add from './addDishModal';

class MenuListing extends Component{
  render(){
    return (
      <div>
        <h2>Menu</h2>
        <button><Link to={`/chef/${this.props.id}/add`}>Add a Dish</Link></button>
        <ul style={{listStyleType: "none"}}>
          {this.props.menu ? this.props.menu.map(MenuListItem): 'Empty menu :(  Add dishes now!'}
        </ul>
      </div>
    )
  }
}

function MenuListItem(item) {
  return (
    <li key={item._id} className="menu-list-item" style={{border:"1px solid black"}}>
      <Link to={`/meal/${item._id}`}><p><strong>{item.title}</strong></p></Link>
      {item.archived ? <h1>Meal Archived </h1> : null}
      <p>Description: {item.description}</p>
      <p>Ingredients: {item.ingredients}</p>
      <p>Price: {item.price}</p>
      <p>Number of reviews: {item.reviews.length}</p>
      <p>Status: {item.status}</p>
      <Link to={`/meal/${item._id}/edit`}>Edit</Link>
      {/* <Link to={`/meal/${item.}`}>View orders</Link> */}
      {/* <Link to={`/meal/${item._id}/archive`}>Archive</Link> */}
    </li>
  )
}

class RequestListing extends Component{
  state = {
    requests: []
  }

  componentDidMount = () => {
    fetch(`/chef/${this.props.chefId}/requests`)
    .then(resp => resp.json())
    .then(requests => this.setState({ requests }))
  }

  acceptRequest = requestId => {
    fetch(`/chef/${this.props.chefId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ requestId }),
    })
    .then(resp => resp.json())
    .then(requests => {
      this.setState({ requests })
    })
  }

  render(){
    return(
      <div>
        <h2>Requests</h2>
        <ul style={{listStyleType: "none"}}>
          {this.state.requests
            ? this.state.requests.map(item => {console.log(item); return RequestItem(item, this.acceptRequest)})
            : 'No requests, start sharing your dishes!'}
        </ul>
      </div>
    )
  }
}

function RequestItem(item, accept) {
  console.log(item);
  return (
    <li key={item._id} className="request-list-item" style={{border:"1px solid black"}}>
      <p>Customer: {item.consumer.firstName}</p>
      <p>Meal: {item.meal.title}</p>
      <p>Time: {item.time}</p>
      <p>Requests: {item.requests ? item.requests : 'None'}</p>
      {item.accepted
        ? <button disabled>Accept</button>
        : <button onClick={() => accept(item._id)}>Accept</button> }
      {/* <Link to={`/meal/${item.}`}>View orders</Link> */}
      {/* <Link to={`/meal/${item._id}/archive`}>Archive</Link> */}
    </li>
  )
}

export default class ChefProfile extends Component{
  state = {
    profile: this.props.user,
    menu: this.props.user.menu,
    requests: this.props.user.requests,
    open: false,
  }

  componentDidMount = () => {
    // if user does not exist, redirects user back to login page
    if (Object.keys(this.props.user).length===0){
      this.props.history.push('/auth/login');
    } else if (this.props.user._id !== this.props.id){
      this.props.history.goBack();
    }
    // else fetch the profile of the chef
    const response = await fetch(`/chef/${this.props.id}`);
    const profile = await response.json();
    this.setState({ profile: profile });
    this.props.notLand();
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
      this.props.history.push(`/chef/${this.props.user._id}`)
    })
  }

  render(){
    const profile = this.state.profile;
    console.log(profile);
    return(
      <div>
        <p>Chef Profile</p>
        <div style={{border:"1px solid black"}}>
          <h4>{profile.firstName}</h4>
          <img src={profile.picture} height="150px" width="150px"/>
          {profile.verified ? <p>Verified</p> : null }
          <p>Current Rating: {profile.rating} </p>
        </div>
        <Link to={`/chef/${profile._id}`}>Menu</Link>
        <Link to={`/chef/${profile._id}/requests`}>Requests</Link>
        <Switch>
          <Route exact path={`/chef/${profile._id}/add`} render={() =>
            <Add save={this.saveDish}/>}/>

          <Route exact path={`/chef/${profile._id}/requests`} render={() =>
            <RequestListing chefId={profile._id}/>}/>

          <Route path={`/chef/${profile._id}`} render={() =>
            <MenuListing id={profile._id} menu={this.state.menu}/>}/>
        </Switch>
      </div>
    )
  }
};
