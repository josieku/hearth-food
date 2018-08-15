import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Dropdown, Grid, Input,Item, Loader, Menu, Rating } from "semantic-ui-react";

import MapContainer from '.././maps/MapContainer'

function measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}


function Listing(meal, user){
  console.log(meal)
  console.log(user)
  var distance = measure(meal.chef.location.lat, meal.chef.location.lng, user.location.lat, user.location.lng)
  console.log(distance)
  return (
    <div id="listItem" key={meal._id}>
      <Item>
        <Grid columns={3}>
          <Grid.Column width={3}>
            <Item.Image circular size="small" style={{padding: '3px'}} src={meal.picture} />
            <Rating icon='star' size='mini' defaultRating={meal.overallRating} maxRating={5} disabled/>
          </Grid.Column>
          <Grid.Column width={8}>
            <Item.Content>
              <Link to={`/meal/${meal._id}`} style={{textDecoration: 'none', color: 'black'}}>
              <Item.Header><h2>{meal.title}</h2></Item.Header>
            </Link>
            <Item.Meta><h4>Description</h4></Item.Meta>
            <Item.Description>{meal.description}</Item.Description>
            <Item.Extra><h4>Ingredients</h4></Item.Extra>
            <Item.Extra>{meal.ingredients}</Item.Extra>
          </Item.Content>
        </Grid.Column>
        <Grid.Column width={4}>
          <Item.Content>
            <Item.Extra><h4>Price per plate</h4></Item.Extra>
            <Item.Extra>${meal.price}</Item.Extra>
            <Item.Extra><h4>Cuisine</h4></Item.Extra>
            <Item.Extra>{meal.cuisine}</Item.Extra>
            <Item.Extra><h4>Distance from you</h4></Item.Extra>
            <Item.Extra>{distance}</Item.Extra>
            <Button id="redButton" href={`/meal/${meal._id}`} size='mini' >Request</Button>
          </Item.Content>
        </Grid.Column>
      </Grid>
      <Divider />
    </Item>
  </div>
)
}

class MealListings extends Component {
  render(){
    var filter = this.props.listings.filter(meal => {
      var distance = measure(meal.chef.location.lat, meal.chef.location.lng, this.props.user.location.lat, this.props.user.location.lng)
      console.log(distance)
      return (distance < this.props.radius)
    })
    console.log(filter)
    return (
      <div>
        {filter.map(meal => {
          return Listing(meal, this.props.user)
        })}
      </div>
    )
  }
};

function recentCondense(item){
  return (
    <div id="listItem" key={item.meal._id}>
      <Item>
        <Grid columns={2}>
          <Grid.Column width={12}>
            <Item.Content>
              <Link to={`/meal/${item.meal._id}`} style={{textDecoration: 'none', color: 'black'}}>
              <Item.Header><h2>{item.meal.title}</h2></Item.Header>
            </Link>
            <Item.Meta><h4>Description</h4></Item.Meta>
            <Item.Description>{item.meal.description}</Item.Description>
            <Item.Extra><h4>Ingredients</h4></Item.Extra>
            <Item.Extra>{item.meal.ingredients}</Item.Extra>
          </Item.Content>
        </Grid.Column>
        <Grid.Column width={4}>
          <Item.Content>
            <Item.Extra><h4>Price per plate</h4></Item.Extra>
            <Item.Extra>${item.meal.price}</Item.Extra>
          </Item.Content>
          <Button size='mini' id="redButton">Request Again</Button>
        </Grid.Column>
      </Grid>
    </Item>
    <Divider />
  </div>
)
}

export default class Listings extends Component{
  state = {
    listings: [],
    recents: [],
    loading: true,
    radius: 500
  }
  componentDidMount = e => {
    console.log(this.props)
    fetch('/meal/listings')
    .then(resp => resp.json())
    .then(listings => this.setState({ listings, loading: false }));

    fetch(`/user/${this.props.user._id}/recent`)
    .then(resp => resp.json())
    .then(recents => this.setState({ recents }))
  }

  sendRadius = radius => {
    this.setState({
      radius: radius
    })
    console.log(radius)
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
      <div className="main">
        <Grid columns={2} padded="vertically">
          <Grid.Column>
            <Grid.Row>
              <Menu text id="header">
                <Menu.Item header>Available Meals</Menu.Item>
                <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
                  <Input id='searchInHeader' icon='search' placeholder='Search...'/>
                  <Dropdown icon='filter' floating button className="icon" id="redButton">
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
            {this.state.loading
              ? <Loader active inline='centered'>Finding the best meals for you...</Loader>
              : <MealListings listings={this.state.listings} user={this.props.user} radius={this.state.radius}/>}
          </Grid.Column>
          <Grid.Column>
            <Grid.Row>
              <Menu text id="header">
                <Menu.Item header>Location of Meal</Menu.Item>
              </Menu>
                {/* <Map listings={this.state.listings}/> */}
                <MapContainer location={this.props.user.location} places={this.state.listings} sendRadius={this.sendRadius} />
            </Grid.Row>
            <Grid.Row>
                <Menu text id="header">
                  <Menu.Item header>Recent Meals</Menu.Item>
                </Menu>
            <div id="listOfRecents">
              {this.state.recents.length > 0
                ? this.state.recents.map(recentCondense)
                : "No recent meals.  Start ordering now!"
              }
            </div>
            </Grid.Row>
          </Grid.Column>
    </Grid>
  </div>
)
}
};
