import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Button, Divider, Dropdown, Grid, Item, Search, Modal } from "semantic-ui-react";
import qs from 'query-string';

import NavBar from './../general/NavBar';
import Listings from './Main';
import Orders from './Orders';
import Profile from './UserProfile';
import Notifications from './../general/Notifications';
import AddReview from './../meals/MealProfile-Review';

export default class ConsumerLanding extends Component{
  state = {
    notifications: [],
    needReview: false,
    review: [],
    loadingNotifs: true,
    openReviewModal: true,
  }

  componentDidMount = e => {
    if (Object.keys(this.props.user).length === 0 || this.props.user.role === "chef"){
      this.props.history.push('/')
    } else {
      fetch(`/user/${this.props.user._id}/notif`)
      .then(resp => resp.json())
      .then(notifications => {
        const review = notifications
                        .filter(item=> item.type === "Delivered Request" && item.request.completed && !item.request.review)
                        .map(item => item.request)
        this.setState({
          notifications,
          loadingNotifs: false,
          review,
          needReview: review.length > 0
         })
      })
    }

    let intervalId = this.getNotifs();
    this.setState({ intervalId });
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

  validateLogin = async () =>{
    if (Object.keys(this.props.user).length === 0 || this.props.user.role === "chef"){
      await this.props.history.push('/')
    }
  }

  rateMeal = (content, anon, rating, requestId, mealId, ind) => {
    const userId = this.props.user._id;
    const date = Date.now();
    fetch(`/meal/${mealId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        userId, content, anon, rating, date, requestId
      }),
    })
    .then(resp => resp.json())
    .then(rev => {
      const review = this.state.review.slice();
      review.splice(ind, 1);
      this.setState({ review })
    })
  }

  closeReviewModal = () => {
    this.setState({ review: [] })
  }

  render(){
    const user = this.props.user
    return(
      <div className="main">
        <NavBar notifications={this.state.notifications} user={user} logout={this.props.logout}/>
        <Switch>
          <Route exact path="/dashboard/orders" render={(props)=>
            <Orders user={user} show={qs.parse(props.location.search).show}
              {...props} />}/>

          <Route exact path="/dashboard/notifications" render={(props)=>
            <Notifications user={user} update={this.updateNotifications}
              notifications={this.state.notifications} delete={this.deleteNotif}
              loading={this.state.loadingNotifs} {...props} />}/>

          <Route exact path="/dashboard" render={(props)=>
            <Listings user={user} recents={this.state.recents}
              review={this.state.review} rateMeal={this.rateMeal} close={this.closeReviewModal}
              notifications={this.state.notifications} updateNotifs={this.updateNotifications}
              {...props} />}/>
        </Switch>
      </div>
      )
    }
};
