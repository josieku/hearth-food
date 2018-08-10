import React, { Component } from "react";
import { Link } from 'react-router-dom';

export default class Notifications extends Component{
  state = {
    unread: false,
    notifications: this.props.notifications
  }

  mark = () => {
    console.log('marking');
    const unseen = this.state.notifications
                      .filter(item => !item.seen)
                      .map(item => item._id);
    this.props.update(unseen);
  }

  notifListing = (item) => {
    return (
      <li key={item._id} className={`notification-${item.seen}`} style={{border:"1px solid black"}}>
        <p>Type: {item.type}</p>
        {item.meal ? <p>Meal: {item.meal.title}</p>: null}
        <p>{item.content}</p>
      </li>
    )
  }

  render(){
    console.log(this.props.notifications);
    return(
      <div>
        <h2>Notifications</h2>
        <button onClick={this.mark}>
          Mark all as read
        </button>
        { this.state.unread
          ? <button onClick={()=>this.setState({ unread: true })}>
            See all notifications
            </button>
          : <button onClick={()=>this.setState({ unread: false })}>
            See unread notifications
          </button>
        }
        <ul style={{listStyleType: "none"}}>
          {this.props.notifications.length > 0
            ? this.props.notifications
                .filter(item => {
                  if (this.state.unread){ return !item.seen }
                  else {return item}
                })
                .map(this.notifListing)
            : 'No notifications'}
        </ul>
      </div>
    )
  }
}
