import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Dropdown, Grid, Input, Item, Menu, Modal } from 'semantic-ui-react';


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
        : <EditModal request={item} ind={index} change={change}/> }
      {item.payment ? <button onClick={()=>complete(item._id, index)}>Delivered!</button> : null}
      <Divider />
    </Item>
  )
}

class EditModal extends Component {
  state = {
    // time: this.props.request.time.time,
    time: this.props.request.time,
    modalOpen: false
  }

  chosenTime = () => {
    const chosen = this.props.request.meal.availability.find(item=> item.time === this.state.time.time);
    if (chosen){
      return <div>
              <span>{new Date(chosen.date).toDateString()} at {chosen.start}</span>
              <button onClick={()=>this.setState({ time: null })}>Change</button>
            </div>
    }
  }

  timeslots = (timeObj) => {
    return(
      <Button key={timeObj._id} onClick={()=>this.setState({ time: timeObj })}>
        <p>{new Date(timeObj.date).toDateString()}</p>
        <p>{timeObj.start} to {timeObj.end}</p>
      </Button>
    )
  }

  save = () => {
    if (this.state.time.time !== this.props.request.time.time){
      // console.log('changing');
      // console.log('availability!!!!', this.props.request.meal.availability);
      this.props.change(this.props.request._id, this.props.index, this.state.time);
    }
    this.setState({ modalOpen: false })
  }

  render(){
    const request = this.props.request;
    return (
      <div>
        <Button onClick={()=>this.setState({modalOpen: true})}>Make Changes to Request</Button>
        <Modal open={this.state.modalOpen}>
          <Modal.Content>
            <Modal.Description>
              Pickup time:
              {this.state.time
                ? this.chosenTime()
                : this.props.request.meal.availability.map(this.timeslots)}
              {this.state.time
                ? <Button onClick={this.save}>Save</Button>
                : null
              }
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

export default class OrderListing extends Component{
  render(){
    return(
      <div>
        <Grid.Row>
          <Menu text id="availableMeals">
            <Menu.Item header>Orders</Menu.Item>
            <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
            <Input placeholder='Search...'/>
                <Dropdown icon='filter' floating button className='icon'>
                  <Dropdown.Menu>
                    <Dropdown.Header content='Filter by selection' />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={()=>{this.sort("high")}}>Price: Low to High
                    </Dropdown.Item>
                    <Dropdown.Item onClick={()=>{this.sort("low")}}>Price: High to Low</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Menu>
          </Menu>
        </Grid.Row>
        {/* <h2 id="chefLandingHeader">Orders</h2> */}
          {this.props.orders.length > 0
            ? this.props.orders.map((item, ind) =>
              OrderItem(item, ind, this.props.complete, this.props.changes))
            : 'No orders yet'}
      </div>
    )
  }
}
