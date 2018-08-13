import React, { Component } from "react";
import { Link } from 'react-router-dom';

export default class Notifications extends Component{
  state = {
    unread: true,
    notifications: this.props.notifications
  }

  mark = (e) => {
    e.preventDefault()
    console.log('marking');
    const unseen = this.props.notifications.filter(item => !item.seen);
    console.log('unseen', unseen);
    console.log(this.props.update)
    this.props.update(unseen);
  }

  notifListing = (item) => {
    // console.log(item);
    return (
      <li key={item._id} className={`notification-${item.seen}`} style={{border:"1px solid black"}}>
        <p>Type: {item.type}</p>
        <p>Time: {new Date(item.time).toString()}</p>
        {item.meal ? <p>Meal: {item.meal.title}</p>: null}
        <p>{item.content}</p>
      </li>
    )
  }

  renderNotifs = (bool) => {
    if (bool && this.props.notifications.length > 0 ) {
      const listing = this.props.notifications.filter(item => !item.seen).map(this.notifListing);
      return listing.length > 0 ? listing : "No unread notifications";
    } else if (!bool && this.props.notifications.length > 0){
      return this.props.notifications.map(this.notifListing);
    } else{
      return "No notifications"
    }
  }

  render(){
    return(
      <div>
        <h2>Notifications</h2>
        <button onClick={this.mark}>
          Mark all as read
        </button>
        { this.state.unread
          ? <button onClick={()=>this.setState({ unread: false })}>
            See all notifications
            </button>
          : <button onClick={()=>this.setState({ unread: true })}>
            See unread notifications
          </button>
        }
        <ul style={{listStyleType: "none"}}>
          {this.renderNotifs(this.state.unread)}
          {/* {this.props.notifications.length > 0
            ? this.props.notifications
                .filter(item => {
                  if (this.state.unread){ return !item.seen }
                  else {return item}
                })
                .map(this.notifListing)
            : 'No notifications'} */}
        </ul>
      </div>
    )
  }
}
