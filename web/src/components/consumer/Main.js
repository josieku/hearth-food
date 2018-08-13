import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Dropdown, Grid, Header, Item, Input, Menu, Search } from "semantic-ui-react";

import NavBar from './../general/NavBar'
import MapContainer from '.././maps/MapContainer'

function Listing(meal){
  return (
    <div id="listItem" key={meal._id}>
      <Item>
        <Grid columns={3}>
          <Grid.Column width={3}>
            <Item.Image rounded size="small" src={meal.picture ? meal.picture : "data:image/jpeg;base64,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"}/>
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
          </Item.Content>
        </Grid.Column>
      </Grid>
    </Item>
    <Divider />
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

// class Map extends Component {
//   constructor(props)
//   render(){
//     return (
//       <div style = {{border:"1px solid black"}}>
//         <MapContainer />
//       </div>
//     )
//   }
// };

function recentCondense(item){
  return (
    // <div key={item._id} style={{border: "1px solid black"}}>
    //   <p><strong>Title: </strong>{item.meal.title}</p>
    //   <p><strong>Description: </strong>{item.meal.description}</p>
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
            <Button size='mini'>Request Again</Button>
          </Grid.Column>
        </Grid>
      </Item>
      <Divider />
    </div>
    // </div>
  )
}

export default class Listings extends Component{
  state = {
    listings: [],
    recents: []
  }

  componentDidMount = e => {
    console.log(this.props)
    fetch('/meal/listings')
    .then(resp => resp.json())
    .then(listings => {
      console.log(listings)
      this.setState({ listings })
    });

    fetch(`/user/${this.props.user._id}/recent`)
    .then(resp => resp.json())
    .then(recents => this.setState({ recents }))
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
              <Menu text id="availableMeals">
                <Menu.Item header>Available Meals</Menu.Item>
                <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
                <Input placeholder='Search...'/>
                    <Dropdown icon='filter' floating button className='icon'>
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
            <div id="mealList">
              <MealListings listings={this.state.listings}/>
            </div>
          </Grid.Column>
            <Grid.Column>
              <Grid.Row>
                <div id="mapDiv">
                  {/* <Map listings={this.state.listings}/> */}
                  <MapContainer location={this.props.user.location} places={this.state.listings}/>
                </div>
              </Grid.Row>
              {/* <div id="recentMealHeader">
                Recent Meals
              </div> */}
              {/* <div id="listOfRecents">
                {this.state.recents.map(recentCondense)}
              </div> */}
            </Grid.Column>
          </Grid>
        </div>
      )
    }
};
