import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import Main from './Main';
import Menu from './Menu';
import History from './History';
// import Messages from './ChefLanding-Message';
import NavBar from './../general/NavBar';
import Notifications from './../consumer/Notifications';

export default class ChefLanding extends Component{
  state = {
    notifications: []
  }

  updateNotifications = (unseen) => {
    fetch(`/user/${this.props.user._id}/notif/markallread`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ unseen }),
    })
      .then(resp => resp.json())
      .then(notifications => {
        this.setState({ notifications });
      })
  }

  componentDidMount = e => {
    fetch(`/user/${this.props.user._id}/notif`)
    .then(resp => resp.json())
    .then(notifications => this.setState({ notifications }))
  }



  render(){
    const user = this.props.user;
    console.log('notifs', this.state.notifications)
    return(
      <div className='main'>
        <NavBar user={user} logout={this.props.logout}/>
        <Switch>
          <Route path="/dashboard/menu" render={(props)=>
            <Menu user={user} {...props} />}/>

          <Route exact path="/dashboard/history" render={(props)=>
            <History chefId={user._id} {...props} />}/>

          <Route exact path="/dashboard/notifications" render={(props)=>
            <Notifications user={user} update={this.updateNotifications}
              notifications={this.state.notifications} {...props} />}/>

          <Route exact path="/dashboard" render={(props)=>
            <Main user={user} id={user._id} {...props} />}/>


          {/* <Route path="/messages" render={(props)=> <Messages user={user} {...props} />}/> */}
        </Switch>
      </div>
    )
  }
};
