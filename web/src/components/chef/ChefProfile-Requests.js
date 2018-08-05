import React, { Component } from "react";
import { Route, Link, Switch } from 'react-router-dom';

export default class Requests extends Component{
  state = {
    profile: this.props.user,
    menu: this.props.user.menu,
    open: false,
  }

  componentDidMount = e => {
    // if user does not exist, redirects user back to login page
    if (Object.keys(this.props.user).length===0){
      this.props.history.push('/auth/login');
    } else if (this.props.user._id !== this.props.id){
      this.props.history.goBack();
    }
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
    const profile = this.state.profile;
    return(
      <div>
        <p>Chef Profile</p>
        <div style={{border:"1px solid black"}}>
          <h4>{profile.firstName}</h4>
          <img src={profile.picture} height="150px" width="150px"/>
          {profile.verified ? <p>Verified</p> : null }
          <p>Current Rating: {profile.rating} </p>
        </div>
        {/* <div style={{border:"1px solid black"}}>
          <button><Link to={`/chef/${this.state.profile._id}/add`}>Add a Dish</Link></button>
          {MenuListing(this.state.menu)}
        </div> */}
        <Link to={`/chef/${profile._id}`}>Menu</Link>
        {/* <Link to={`/chef/${profile._id}/requests`}>Requests</Link> */}
        <Switch>
          <Route path={`/chef/${profile._id}`} render={() => <MenuListing menu={this.state.menu} />}/>
          <Route exact path={`/chef/${profile._id}/add`} render={() => <Add save={this.saveDish}/>}/>
          {/* <Route exact path={`/chef/${profile._id}/requests`} render={() => <Add save={this.saveDish}/>}/> */}
        </Switch>
      </div>
    )
  }
};
