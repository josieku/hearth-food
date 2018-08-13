import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Item, Menu, Segment, TextArea, Modal } from 'semantic-ui-react';

function RequestItem(item, index, accept, decline) {
  return (
    <Item key={item._id} className="request-list-item">
      <Item.Header>Customer: {item.consumer.firstName}</Item.Header>
      <Item.Extra>Meal: {item.meal.title}</Item.Extra>
      <Item.Extra>Date: {new Date(item.time.date).toString().slice(0,15)}</Item.Extra>
      <Item.Extra>Time: {item.time.start} to {item.time.end}</Item.Extra>
      <Item.Extra>Requests: {item.requests ? item.requests : 'None'}</Item.Extra>
      <Button onClick={() => accept(item._id, index)}>Accept</Button>
      <Button onClick={() => decline(item, index)}>Decline</Button>
        <Divider />
    </Item>
  )
}

export default class RequestListing extends Component{
  state = {
    open: false,
    comment: "",
    item: null,
    index: null,
  }

  open = (item, index) => {
    this.setState({
      open: true,
      item, index
    })
  }

  reject = () => {
    this.props.decline(this.state.item._id, this.state.comment, this.state.index)
    this.setState({
      open: false,
      itemId: null,
      index: null
    })
  }

  cancel = () => {
    this.setState({
      open: false,
      itemId: null,
      index: null
    })
  }

  render(){
    return(
      <div>
        <Grid.Column>
        <h2 id="chefLandingHeader">Requests</h2>
          {this.props.requests.length > 0
            ? this.props.requests.map((item, ind) =>
                RequestItem(item, ind, this.props.accept, this.open))
            : 'No requests, start sharing your dishes!'}
          {this.state.item
            ? <Modal open={this.state.open}>
              <Modal.Header>Decline Request</Modal.Header>
              <Modal.Content>
                <p>Let {this.state.item.consumer.firstName} know why you're declining their request.</p>
                <TextArea placeholder='Say something' onChange={(e)=>this.setState({comment:e.target.value})}/>
              </Modal.Content>
              <Modal.Actions>
                <Button negative onClick={this.cancel}>No</Button>
                <Button positive icon='checkmark' labelPosition='right' content="Yes" onClick={this.reject}/>
              </Modal.Actions>
            </Modal>
            : null}
      </Grid.Column>
      </div>
    )
  }
}
