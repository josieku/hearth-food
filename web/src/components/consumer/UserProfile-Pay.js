import React, { Component } from "react";
import { Button, Divider, Header, Input, Item, Menu, Segment} from 'semantic-ui-react';
import Fuse from 'fuse.js';

function ChargeListing(item){
  return (
    <Item style={{marginTop: '5px'}}>
      <Item.Content><strong>Meal: </strong>{item.meal.title}</Item.Content>
      <Item.Content><strong>Price: </strong>{item.meal.price}</Item.Content>
      <Item.Content><strong>Chef: </strong>{item.chef.firstName}</Item.Content>
      <Item.Content><strong>Date: </strong>{new Date(item.time.time).toString().slice(0,15)}</Item.Content>
      <Item.Content><strong>Time: </strong>{item.time.start} to {item.time.end}</Item.Content>
      <Divider fitted/>
    </Item>
  )
}

export default class ProfilePay extends Component{
  state = {
    chargesOriginal: [],
    charges: []
  }

  componentDidMount = () => {
    if(this.props.profile._id !== this.props.user._id && this.props.user.role !== "consumer"){
      this.props.history.push(`/user/${this.props.profile._id}`);
    } else {
      fetch(`/user/${this.props.id}/charges`)
        .then(resp => resp.json())
        .then(charges => this.setState({ charges, chargesOriginal: charges }) )
    }
  }

  search = (input) => {
    if (input.length > 0){
      var options = {
        keys: ['meal.title',
               'meal.price',
               'meal.ingredients',
               'meal.description',
               'chef.firstName'
              ],
        threshold: 0.4
      };
      var fuse = new Fuse(this.state.chargesOriginal, options);
      const charges = fuse.search(input);
      this.setState({ charges });
    } else {
      this.setState({ charges: this.state.chargesOriginal })
    }
  }

  render(){
    const profile = this.props.profile;
    const self = this.props.user;

    return(
      <div>
        <Menu text id="header" attached>
          <Menu.Item header style={{color: 'white'}}>Recent Charges</Menu.Item>
          <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
            <Input id="searchInHeader" icon='search' onChange={(e)=>this.search(e.target.value)} placeholder="Search..."/>
            <Button id='redButton'>Change your billing information</Button>
          </Menu.Menu>
        </Menu>
        <Segment attached="top">
          {this.state.charges.sort((a,b)=>a.time.time - b.time.time).map(ChargeListing)}
        </Segment>
      </div>
      )
    }
  };
