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
  // state = {
  //   listings: [],
  // }
  //
  // componentDidMount = async e => {
  //   const response = await fetch('/listings');
  //   const listArr = await response.json();
  //   this.setState({ listings: listArr})
  // }
  //
  // sort = indicator => {
  //   if (indicator === "high"){
  //     const tempArr = this.state.listings.slice().sort((a,b)=>a["price"]-b["price"])
  //     this.setState({listings: tempArr})
  //   } else if (indicator === "low"){
  //     const tempArr = this.state.listings.slice().sort((a,b)=>b["price"]-a["price"])
  //     this.setState({listings: tempArr})
  //   }
  // }

  render(){
    return(
      <div>
        <p>Consumer Landing</p>
        {/* <div className="filter">
          <button onClick={()=>{sort("high")}}>Price: High to Low</button>
          <button onClick={()=>{sort("low")}}>Price: Low to High</button>
        </div>
        <MealListings listings={this.state.listings}/>
        <Map listings={this.state.listings}/> */}
      </div>
    )
  }
};
