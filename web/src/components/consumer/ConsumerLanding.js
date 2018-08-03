import React, { Component } from "react";
import { Link } from "react-router-dom";

function Listing(meal){
  return (
    <div className="meal-listings">
      <img src=""/>
      <h3><Link to={`/meal/${meal._id}`}>{meal.title}</Link></h3>
      <p>{meal.description}</p>
      <p><strong>{meal.price}</strong></p>
      <p>{meal.ingredients}</p>
    </div>
  )
}

class MealListings extends Component {
  render(){
    return (
      <div>
        {this.props.listings.map(Listing)}
      </div>
    )
  }
};

class Map extends Component {
  render(){
    return (
      <div style = {{border:"1px solid black"}}>
        <p>this is where the map goes</p>
      </div>
    )
  }
};

export default class ConsumerLanding extends Component{
  state = {
    listings: [],
  }

  componentDidMount = e => {
    console.log('in here')
    fetch('/meal/listings')
      .then(resp => resp.json())
      .then(listings => this.setState({ listings }));
  }

  sort = indicator => {
    if (indicator === "high"){
      const tempArr = this.state.listings.slice().sort((a,b)=>a["price"]-b["price"])
      this.setState({listings: tempArr})
    } else if (indicator === "low"){
      const tempArr = this.state.listings.slice().sort((a,b)=>b["price"]-a["price"])
      this.setState({listings: tempArr})
    }
  }

  render(){
    return(
      <div>
        <p>Consumer Landing</p>
        <div className="filter">
          <button onClick={()=>{this.sort("high")}}>Price: High to Low</button>
          <button onClick={()=>{this.sort("low")}}>Price: Low to High</button>
        </div>
        {this.state.listing
          ? <MealListings listings={this.state.listings}/>
          : <p>No meals available in your area :( </p>}
        <Map listings={this.state.listings}/>
      </div>
    )
  }
};
