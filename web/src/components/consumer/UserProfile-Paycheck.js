import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Grid, Header, Image, Segment} from 'semantic-ui-react';
import Fuse from 'fuse.js';

function ChargeListing(item){
  return (
    <div style={{border: "1px solid black"}}>
      <p>Meal: {item.meal.title}</p>
      <p>Price: {item.meal.price}</p>
      <p>Customer: {item.consumer.firstName}</p>
      <p>Date: {new Date(item.time.time).toString().slice(0,15)}</p>
      <p>Time: {item.time.start} to {item.time.end}</p>
    </div>
  )
}

export default class ProfilePaycheck extends Component{
  state = {
    chargesOriginal: [],
    charges: []
  }

  componentDidMount = () => {
    if(this.props.profile._id !== this.props.user._id && this.props.user.role !== "chef"){
      this.props.history.push(`/user/${this.props.profile._id}`);
    } else {
      fetch(`/user/${this.props.id}/paycheck`)
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

  renderTotal = (charges) => {
    let total = 0;
    for (let ind in charges){
      total += charges[ind].meal.price;
    }
    return total;
  }

  render(){
    const profile = this.props.profile;
    const self = this.props.user;

    return(
      <div>
        <h1>Paycheck (chef)</h1>
        <button>Change your bank information</button>
        <input onChange={(e)=>this.search(e.target.value)} placeholder="search..."/>
        <p>Payslip, Total: <strong>{this.renderTotal(this.state.charges)}</strong></p>
        <div style={{border: "1px solid black"}}>
          {this.state.charges.sort((a,b)=>a.time.time - b.time.time).map(ChargeListing)}
        </div>
      </div>
      )
    }
  };
