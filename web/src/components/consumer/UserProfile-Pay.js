import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Grid, Header, Image, Segment} from 'semantic-ui-react';
import Fuse from 'fuse.js';

function ChargeListing(item){
  return (
    <div style={{border: "1px solid black"}}>
      <p>Meal: {item.meal.title}</p>
      <p>Price: {item.meal.price}</p>
      <p>Chef: {item.chef.firstName}</p>
      <p>Date: {new Date(item.time.time).toString().slice(0,15)}</p>
      <p>Time: {item.time.start} to {item.time.end}</p>
    </div>
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
        <h1>Pay (customer)</h1>
        <button>Change your billing information</button>
        <input onChange={(e)=>this.search(e.target.value)} placeholder="search..."/>
        <p>Recent Charges</p>
        <div style={{border: "1px solid black"}}>
          {this.state.charges.sort((a,b)=>a.time.time - b.time.time).map(ChargeListing)}
        </div>
      </div>
      )
    }
  };
