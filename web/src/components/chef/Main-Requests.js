import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Dropdown, Grid, Input, Item, Menu, TextArea, Modal, Loader } from 'semantic-ui-react';

function RequestItem(item, index, accept, decline) {
  return (
    <Item key={item._id} className="request-list-item">
      <Item.Header><strong>Customer: </strong>{item.consumer.firstName}</Item.Header>
      <Item.Extra><strong>Meal: </strong>{item.meal.title}</Item.Extra>
      <Item.Extra><strong>Date: </strong>{new Date(item.time.date).toString().slice(0,15)}</Item.Extra>
      <Item.Extra><strong>Time: </strong>{item.time.start} to {item.time.end}</Item.Extra>
      <Item.Extra><strong>Requests: </strong>{item.requests ? item.requests : 'None'}</Item.Extra>
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
          <Grid.Row>
            <Menu text id="header">
              <Menu.Item header style={{color: 'white'}}>Requests</Menu.Item>
              <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
                <Input id='searchInHeader' icon='search' placeholder='Search...' onChange={(e)=>this.props.search(e.target.value)}/>
                  <Dropdown icon='sort amount down' floating button className='icon' id='redButton'>
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
            : this.props.requests.length > 0
            ? this.props.requests.map((item, ind) =>
                RequestItem(item, ind, this.props.accept, this.open))
            : 'No requests, start sharing your dishes!'
          }
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
