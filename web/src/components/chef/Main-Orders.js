import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Form, Divider, Dropdown, Grid, Input, Item, Menu, Modal, Loader, TextArea } from 'semantic-ui-react';


function OrderItem(item, index, complete, cancel) {
  return (
    <Item key={item._id} className="order-list-item">
    <Grid>
      <Grid.Column width={6}>
        <Item.Header><strong>Customer: </strong>{item.consumer.firstName}</Item.Header>
        <Item.Extra><strong>Meal: </strong>{item.meal.title}</Item.Extra>
        <Item.Extra><strong>Date: </strong>{new Date(item.time.date).toString().slice(0,15)}</Item.Extra>
        <Item.Extra><strong>Time: </strong>{item.time.start} to {item.time.end}</Item.Extra>
        <Item.Extra><strong>Status: </strong> <span>Ready to cook!</span></Item.Extra>
        <Item.Extra><strong>Additional requests: </strong>{item.requests ? item.requests : 'None'}</Item.Extra>
      </Grid.Column>
      <Grid.Column textAlign='right' width={6}>
        {/* {item.payment
          ? <button disabled>Change pickup time</button>
          : <EditModal request={item} ind={index} change={change}/> } */}
        <Button id="redButton" onClick={()=>complete(item._id, index)}>Delivered!</Button>
        <Button id="redButton" onClick={()=>cancel(item, index)}>Cancel</Button>
      </Grid.Column>
    </Grid>
  <Divider />
</Item>
  )
}

class EditModal extends Component {
  state = {
    time: this.props.request.time,
    modalOpen: false,
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
      this.props.change(this.props.request._id, this.props.index, this.state.time);
    }
    this.setState({ modalOpen: false })
  }

  render(){
    const request = this.props.request;
    return (
      <div>
        <Button id="redButton" size='mini' onClick={()=>this.setState({modalOpen: true})}>Make Changes to Request</Button>
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
  state = {
    comment: "",
    item: null,
    index: null,
    open: false,
  }

  cancelModal = (item, index) => {
    this.setState({
      open: true,
      item,
      index,
    })
  }

  cancel = () => {
    this.props.cancel(this.state.item._id, this.state.comment, this.state.index);
    this.setState({
      comment: "",
      item: null,
      index: null,
      open: false,
    })
  }

  close = () => {
    this.setState({
      comment: "",
      item: null,
      index: null,
      open: false,
    })
  }

  render(){
    return(
      <div>
        <Grid.Row>
          <Menu text id="header">
            <Menu.Item header style={{color: 'white'}}>Orders</Menu.Item>
            <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
              <Input id='searchInHeader' icon='search' placeholder='Search...' onChange={(e)=>this.props.search(e.target.value)}/>
                <Dropdown icon='sort amount down' floating button className='icon' id='sortButton'>
                  <Dropdown.Menu>
                    <Dropdown.Header content='Sort by selection' />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={()=>{this.props.sort("high")}}>
                      Price: Low to High
                    </Dropdown.Item>
                    <Dropdown.Item onClick={()=>{this.props.sort("low")}}>
                      Price: High to Low
                    </Dropdown.Item>
                    <Dropdown.Item onClick={()=>{this.props.sort("earliest")}}>
                      Pickup Time: Earliest to Latest
                    </Dropdown.Item>
                    <Dropdown.Item onClick={()=>{this.props.sort("latest")}}>
                      Pickup Time: Latest to Earliest
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Menu>
          </Menu>
        </Grid.Row>
        {this.props.loading
          ? <Loader active inline='centered'/>
          : this.props.orders.length > 0
          ? this.props.orders.map((item, ind) =>
            OrderItem(item, ind, this.props.complete, this.cancelModal))
          : 'No orders yet'
        }
        {this.state.item
          ? <Modal open={this.state.open}>
            <Modal.Header>Cancel Request</Modal.Header>
            <Modal.Content>
              <p>Let {this.state.item.consumer.firstName} know why you're cancelling their request.</p>
              <p>Please note that this may affect your rating.</p>
              <Form>
                <TextArea placeholder='Say something' onChange={(e)=>this.setState({comment:e.target.value})}/>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick={this.close}>No</Button>
              <Button positive icon='checkmark' labelPosition='right' content="Yes" onClick={this.cancel}/>
            </Modal.Actions>
          </Modal>
          : null}
        {/* {this.props.orders.length > 0
          ? this.props.orders.map((item, ind) =>
            OrderItem(item, ind, this.props.complete, this.props.changes))
          : 'No orders yet'} */}
      </div>
    )
  }
}
