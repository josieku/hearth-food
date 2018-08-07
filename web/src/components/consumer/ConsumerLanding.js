import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Item } from "semantic-ui-react";
function Listing(meal){
  return (
    <div className="meal-listings" key={meal._id}>
      <img src=""/>
      <h3><Link to={`/meal/${meal._id}`}>{meal.title}</Link></h3>
      <p>Description: {meal.description}</p>
      <p>Price: <strong>${meal.price}</strong></p>
      <p>Ingredients: {meal.ingredients}</p>
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
  constructor(props){
    super(props);
    this.validateLogin();
    this.state = {
      listings: [],
    }
  }

  validateLogin = async () =>{
    if (Object.keys(this.props.user).length === 0 || this.props.user.role === "chef"){
      await this.props.history.push('/')
    }
  }

  componentDidMount = e => {
    this.props.notLand();
    console.log("in consumer landing")
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
        <div className="filter">
          <Button onClick={()=>{this.sort("high")}}>Price: High to Low</Button>
          <button onClick={()=>{this.sort("low")}}>Price: Low to High</button>
        </div>
        {this.state.listing
          ? <MealListings listings={this.state.listings}/>
          : <p>No meals available in your area :( </p>}
        <Map listings={this.state.listings}/>
        {/* <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
          <Item>
            <Item.Image size='small' src='/images/wireframe/image.png' />
            <Item.Content>
              <Item.Header as='a'>Cute Dog</Item.Header>
              <Item.Description>
                <p>Hello</p>
                <p>Many people also have their own barometers for what makes a cute dog.</p>
              </Item.Description>
            </Item.Content>
          </Item>
        </Grid.Column>
        </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>

        <Item>
          <Item.Image size='small' src='/images/wireframe/image.png' />
          <Item.Content>
            <Item.Header as='a'>Cute Dog</Item.Header>
            <Item.Description content='Hello' />
          </Item.Content>
        </Item>
      </Grid.Column>
      </Grid.Row>
    <Grid.Row>
      <Grid.Column width={8}>
      <Item>
        <Item.Image size='small' src='/images/wireframe/image.png' />
        <Item.Content header='Cute Dog' description='hello' />
      </Item>
    </Grid.Column>
    </Grid.Row>
      </Grid> */}
      </div>
    )
  }
};
