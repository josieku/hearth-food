import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import Main from './Main';
import Menu from './Menu';
import History from './History';
// import Messages from './ChefLanding-Message';
import NavBar from './../general/NavBar';
import Notifications from './../general/Notifications';

export default class ChefLanding extends Component{
  state = {
    notifications: [],
    loadingNotifs: true,
    intervalId: "",
  }

  componentDidMount = e => {
    fetch(`/user/${this.props.user._id}/notif`)
    .then(resp => resp.json())
    .then(notifications => {
      this.setState({ notifications, loadingNotifs: false })
    })

    let intervalId = this.getNotifs();
    this.setState({ intervalId })
  }

  fetchNotifs = () => {
    fetch(`/user/${this.props.user._id}/notif`)
    .then(resp => resp.json())
    .then(notifications => {
      this.setState({ notifications })
    })
  }

  getNotifs = () => {
    return setInterval(this.fetchNotifs, 5000);
  }

  deleteNotif = (notifId, index) => {
    fetch(`/user/${this.props.user._id}/notif/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({ notifId }),
    })
      .then(e => {
        const notifications = this.state.notifications.slice();
        notifications.splice(index, 1);
        this.setState({ notifications });
      })
  }

  updateNotifications = (unseen) => {
    fetch(`/user/${this.props.user._id}/notif/markallread`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ unseen }),
    })
      .then(resp => resp.json())
      .then(notifications => {
        this.setState({ notifications });
      })
  }

  render(){
    const user = this.props.user;
    return(
      <div className='main'>
        <NavBar user={user} notifications={this.state.notifications} logout={this.props.logout}/>
        <Switch>
          <Route path="/dashboard/menu" render={(props)=>
            <Menu user={user} {...props} />}/>

          <Route exact path="/dashboard/history" render={(props)=>
            <History chefId={user._id} {...props} />}/>

          <Route exact path="/dashboard/notifications" render={(props)=>
            <Notifications user={user} update={this.updateNotifications}
              notifications={this.state.notifications} delete={this.deleteNotif}
              loading={this.state.loadingNotifs} {...props} />}/>

          <Route exact path="/dashboard" render={(props)=>
            <Main user={user} id={user._id} updateNotifs={this.updateNotifications}
              notifications={this.state.notifications} {...props}/>}/>

          {/* <Route path="/messages" render={(props)=> <Messages user={user} {...props} />}/> */}
        </Switch>
      </div>
    )
  }
};
