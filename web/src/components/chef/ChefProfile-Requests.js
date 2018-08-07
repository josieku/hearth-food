import React, { Component } from "react";
import { Link } from 'react-router-dom';

function RequestItem(item, index, accept) {
  return (
    <li key={item._id} className="request-list-item" style={{border:"1px solid black"}}>
      <p>Customer: {item.consumer.firstName}</p>
      <p>Meal: {item.meal.title}</p>
      <p>Time: {item.time}</p>
      <p>Requests: {item.requests ? item.requests : 'None'}</p>
      {item.accepted
        ? <button disabled>Accept</button>
        : <button onClick={() => accept(item._id, index)}>Accept</button> }
    </li>
  )
}

export default class RequestListing extends Component{
  state = {
    requests: [],
    mounted: false,
  }

  componentDidMount = () => {
    this.setState({ mounted: true })
    fetch(`/chef/${this.props.chefId}/requests`)
    .then(resp => resp.json())
    .then(requests => this.setState({ requests }))
  }

  acceptRequest = async (requestId, index) => {
    if (this.mounted && Object.keys(this.props.user).length > 0){
      await fetch(`/chef/${this.props.chefId}/requests/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // <- this is mandatory to deal with cookies
        body: JSON.stringify({ requestId }),
      })
      const requests = this.state.requests.slice();
      requests.splice(index, 1);
      this.setState({ requests });
    }
  }

  componentWillUnmount = () => {
    this.setState({ mounted: false })
  }

  render(){
    return(
      <div>
        <h2>Requests</h2>
        <ul style={{listStyleType: "none"}}>
          {this.state.requests.length > 0
            ? this.state.requests.map((item, ind) => RequestItem(item, ind, this.acceptRequest))
            : 'No requests, start sharing your dishes!'}
        </ul>
      </div>
    )
  }
}
