import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Dropdown, Grid, Input,Item, Loader, Menu, Rating, Message } from "semantic-ui-react";
import Fuse from 'fuse.js';
import * as Scroll from 'react-scroll';
import { Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import MapContainer from '.././maps/MapContainer'

function UnseenNotifications(item){
  return(
    <Message>
      {item.type}: {item.content} <span style={{color:"gray"}}>{new Date(item.time).toString()}</span>
    </Message>
  )
}

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
  var rounded = distance.toString().split('.')[0]
  console.log(rounded)
  return (
    <Element width="500px">
      <div id="listItem" key={meal._id}>
        <Item>
          <Grid columns={3}>
            <Grid.Column width={3}>
              <Item.Image circular size="small" style={{padding: '3px'}} src={meal.picture} />
              {meal.reviews.length > 4
                ? <Rating icon='star' size='mini' defaultRating={meal.overallRating} maxRating={5} disabled/>
                : <p>No rating</p>
              }
              <span>{meal.reviews.length} reviews</span>
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
                <Item.Extra>{rounded} meters away!</Item.Extra>
                <Button id="redButton" href={`/meal/${meal._id}`} size='mini' >Request</Button>
              </Item.Content>
            </Grid.Column>
          </Grid>
          <Divider />
        </Item>
      </div>
    </Element>
)
}

class MealListings extends Component {
  render(){
    const style ={
      position: 'relative',
      height: '810px',
      width: '560px',
      overflowY: 'scroll',
      overflowX: 'hidden',
      marginBottom: '100px',
    }

    return (
      <div>
        <Element id="listings-scroll-container" style={style}>
          {this.props.listings.map(meal => Listing(meal, this.props.user))}
        </Element>
      </div>
    )
  }
};

function recentCondense(item, ind){
  return (
    <div id="listItem" key={ind}>
      <Item>
        <Grid columns={2}>
          <Grid.Column width={12}>
            <Item.Content>
              <Link to={`/meal/${item.meal._id}`} style={{textDecoration: 'none', color: 'black'}}>
              <Item.Header><h2>{item.meal.title}</h2></Item.Header>
            </Link>
            <Item.Content>
              Ordered {new Date(item.time.time).toString().slice(0,15)} at {item.time.start}
            </Item.Content>
          </Item.Content>
        </Grid.Column>
        <Grid.Column width={4}>
          <Item.Content>
            <Item.Extra><h4>${item.meal.price}</h4></Item.Extra>
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
    listingsOriginal: [],
    listings: [],
    recents: [],
    cuisines: [],
    cuisineSearch: [],
    loadingListing: true,
    loadingRecents: true,
    radius: 500
  }
  componentDidMount = e => {
    console.log(this.props)
    fetch('/meal/listings')
    .then(resp => resp.json())
    .then(list => {
      const listings = list.filter(item => item.availability.length > 0);
      const cuisines = {};
      for (let ind in listings){
        const genre = listings[ind]["cuisine"];
        if (cuisines[genre]){
          cuisines[genre] = cuisines[genre] + 1
        } else{
          cuisines[genre] = 1
        }
      }

      this.setState({
        listings: listings,
        listingsOriginal: listings,
        cuisines: Object.keys(cuisines),
        loadingListing: false
      })
    });

    fetch(`/user/${this.props.user._id}/recent`)
    .then(resp => resp.json())
    .then(recents => this.setState({ recents, loadingRecents: false }))
  }

  sendRadius = radius => {
    this.setState({
      radius: radius
    })
  }

  sort = indicator => {
    if (indicator === "low"){
      const listings = this.state.listings.slice().sort((a,b)=>a["price"]-b["price"])
      this.setState({ listings })
    } else if (indicator === "high"){
      const listings = this.state.listings.slice().sort((a,b)=>b["price"]-a["price"])
      this.setState({ listings })
    } else if (indicator === "rating"){
      const yesRatings = this.state.listings.slice()
                                          .filter(item=>item.reviews.length > 4)
                                          .sort((a,b)=>b.overallRating-a.overallRating)
      const noRatings = this.state.listingsOriginal.filter(item=>item.reviews.length < 5);
      console.log('noratings', noRatings);
      const listings = yesRatings.concat(noRatings)
      this.setState({ listings })
    } else if (indicator === "reviews"){
      const listings = this.state.listings.slice().sort((a,b)=>b.reviews.length-a.reviews.length)
      this.setState({ listings })
    }
  }

  filter = (indicator, input) => {
    if (indicator === "cuisine"){
      const listings = this.state.listings.slice()
                                          .filter(item=>{
                                            console.log('item.cuisine', item.cuisine)
                                            for (let ind in input){
                                              if (item.cuisine[0] === input[ind]) return item;}
                                            })
      console.log('filtered', listings)
      this.setState({ listings })
    } else if (indicator === "time"){
      const listings = this.state.listings.slice()
    }
  }

  search = input => {
    if (input.length > 0){
      var options = {
        keys: ['title',
               'chef.firstName',
               'ingredients',
               'description',
               'cuisine' ],
        threshold: 0.4
      };
      var fuse = new Fuse(this.state.listingsOriginal, options);
      const listings = fuse.search(input);
      this.setState({ listings });
    } else {
      this.setState({ listings: this.state.listingsOriginal })
    }
  }

  cuisineFilter = (e, data) => {
    console.log('cuisine', data.value);
    if (data.value.length > 0){
      this.filter('cuisine', data.value)
    } else {
      this.setState({ listings: this.state.listingsOriginal })
    }
    // this.setState({ cuisineSearch: data.value })
  }

  mark = () => {
    this.props.updateNotifs(this.props.notifications.filter(item=>!item.seen))
  }

  render(){
    const cuisines = this.state.cuisines.map(item=>{
      return {key: item, value: item, text: item}
    })

    const notifs = this.props.notifications;

    return(
      <div className="main">
        <div>
          {notifs.filter(item=>!item.seen).length > 0
            ? <div>
                <span>
                  <strong>New notifications </strong>
                  <button onClick={this.mark}>Mark all as read</button>
                </span>
                {notifs.filter(item=>!item.seen).map(UnseenNotifications)}
              </div>
            : null
          }
        </div>
        <Grid columns={2} padded="vertically">
          <Grid.Column>
            <Grid.Row>
              <Menu text id="header">
                <Menu.Item header style={{color: 'white'}}>Available Meals</Menu.Item>
                <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
                  <Input id='searchInHeader' icon='search'
                    placeholder='Search...' onChange={(e)=>this.search(e.target.value)}/>
                  <Dropdown icon='sort amount down' floating button className="icon" id="redButton">
                    <Dropdown.Menu>
                      <Dropdown.Header content='Sort by selection' />
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={()=>{this.sort("high")}}>
                        Price: High to Low
                      </Dropdown.Item>
                      <Dropdown.Item onClick={()=>{this.sort("low")}}>
                        Price: Low to High
                      </Dropdown.Item>
                      <Dropdown.Item onClick={()=>{this.sort("rating")}}>
                        Highest Rated
                      </Dropdown.Item>
                      <Dropdown.Item onClick={()=>{this.sort("reviews")}}>
                        Most Reviewed
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown placeholder='Cuisine' fluid multiple search selection
                    options={cuisines} onChange={this.cuisineFilter}/>
                </Menu.Menu>
              </Menu>
            </Grid.Row>
            {this.state.loadingListing
              ? <Loader active inline='centered'>Finding the best meals for you...</Loader>
              : <MealListings listings={this.state.listings} user={this.props.user} radius={this.state.radius}/>}
          </Grid.Column>
          <Grid.Column>
            <Grid.Row>
              <Menu text id="header">
                <Menu.Item header style={{color: 'white'}}>Location of Meal</Menu.Item>
              </Menu>
                {/* <Map listings={this.state.listings}/> */}
                <MapContainer location={this.props.user.location} places={this.state.listings} sendRadius={this.sendRadius} />
            </Grid.Row>
            <Grid.Row>
                <Menu text id="header">
                  <Menu.Item header style={{color: 'white'}}>Recent Meals</Menu.Item>
                </Menu>
            <div id="listOfRecents">
              {this.state.loadingRecents
                ? <Loader active inline='centered'/>
                : this.state.recents.length > 0
                ? this.state.recents.map((item,ind)=>recentCondense(item,ind))
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
