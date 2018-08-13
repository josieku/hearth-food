import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Form, Grid, Item, Menu, Segment, Modal } from 'semantic-ui-react';


function OrderItem(item, index, complete, change) {
  return (
    <Item key={item._id} className="order-list-item">
      <Item.Header>Customer: {item.consumer.firstName}</Item.Header>
      <Item.Extra>Meal: {item.meal.title}</Item.Extra>
      <Item.Extra>Date: {new Date(item.time.date).toString().slice(0,15)}</Item.Extra>
      <Item.Extra>Time: {item.time.start} to {item.time.end}</Item.Extra>
      <Item.Extra>Status: <strong>{item.payment ? <span>Ready to cook!</span> : <span>Awaiting payment...</span>}</strong></Item.Extra>
      <Item.Extra>Additional requests: {item.requests ? item.requests : 'None'}</Item.Extra>
      <Button>Message Customer</Button>
      {item.payment
        ? <button disabled>Make Changes to Request</button>
        : <EditModal request={item}/> }
      {item.payment ? <button onClick={()=>complete(item._id, index)}>Delivered!</button> : null}
      <Divider />
    </Item>
  )
}

class EditModal extends Component {
  state = {
    time: this.props.request.time.time
  }

  chosenTime = () => {
    const chosen = this.props.request.meal.availability.find(item=> item.time === this.state.time);
    if (chosen){
      return <div>
              <span>{new Date(chosen.date).toDateString()} at {chosen.start}</span>
              <button onClick={()=>this.setState({ time: null })}>Change</button>
            </div>
    }
  }

  timeslots = (timeObj) => {
    return(
      <Button key={timeObj._id} onClick={()=>this.setState({ time: timeObj.time })}>
        <p>{new Date(timeObj.date).toDateString()}</p>
        <p>{timeObj.start} to {timeObj.end}</p>
      </Button>
    )
  }

  render(){
    const request = this.props.request;
    console.log(request);
    return (
      <Modal trigger={<Button>Make Changes to Request</Button>}>
        <Modal.Content>
          <Modal.Description>
            Pickup time:
            {this.state.time
              ? this.chosenTime()
              : this.props.request.meal.availability.map(this.timeslots)}
            {this.state.time
              ? <Button onClick={()=>this.setState({ time: null })}>Save</Button>
              : null
            }
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export default class OrderListing extends Component{
  render(){
    return(
      <div>
        <h2 id="chefLandingHeader">Orders</h2>
          {this.props.orders.length > 0
            ? this.props.orders.map((item, ind) =>
              OrderItem(item, ind, this.props.complete, this.props.changes))
            : 'No orders yet'}
      </div>
    )
  }
}
