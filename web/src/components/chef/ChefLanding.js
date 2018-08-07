import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import Main from './ChefLanding-Main';
import Menu from './ChefLanding-Menu';
// import History from './ChefLanding-History';
// import Messages from './ChefLanding-Message';
import Profile from './ChefProfile';

export default class ChefLanding extends Component{
  componentDidMount(){
    this.props.notLand();
  };
  render(){
    const user = this.props.user;
    return(
      <div>
        Chef Landing
        <Switch>
          <Route exact path={`/dashboard/${user._id}`} render={(props) => <Profile user={user} notLand={this.props.notLand} id={user._id} {...props}/>}/>
          <Route exact path="/dashboard/menu" render={(props)=> <Menu user={user} {...props} />}/>
          <Route exact path="/dashboard" render={(props)=> <Main user={user} id={user._id} {...props} />}/>
          {/* <Route path="/history" render={(props)=> <History user={user} {...props} />}/>
          <Route path="/messages" render={(props)=> <Messages user={user} {...props} />}/> */}
        </Switch>
      </div>
    )
  }
};
