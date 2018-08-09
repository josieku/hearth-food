import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import Main from './Main';
import Menu from './Menu';
import History from './History';
// import Messages from './ChefLanding-Message';
import NavBar from './../general/NavBar'

export default class ChefLanding extends Component{
  componentDidMount(){
    this.props.notLand();
  };
  render(){
    const user = this.props.user;
    return(
      <div>
        <NavBar user={user} logout={this.props.logout}/>
        <Switch>
          <Route path="/dashboard/menu" render={(props)=> <Menu user={user} {...props} />}/>
          <Route exact path="/dashboard/history" render={(props)=> <History chefId={user._id} {...props} />}/>
          <Route exact path="/dashboard" render={(props)=> <Main user={user} id={user._id} {...props} />}/>
          {/* <Route path="/messages" render={(props)=> <Messages user={user} {...props} />}/> */}
        </Switch>
      </div>
    )
  }
};
