import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Item, Divider } from "semantic-ui-react";

function Listing(meal){
  return (
    <div id="listItem" key={meal._id}>
      <Item>
        <Grid columns={3} padded='vertically'>
          <Grid.Column>
            <Item.Image size="tiny" src="data:image/jpeg;base64,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" />
          </Grid.Column>
          <Grid.Column>
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
        <Grid.Column>
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
      <div style={{padding: '2%'}}>
        <Grid columns={2} padded="vertically">
          <Grid.Column>
            <div id="availableMeals">
              Available Meals
              <Button onClick={()=>{this.sort("high")}}>Price: High to Low</Button>
              <Button onClick={()=>{this.sort("low")}}>Price: Low to High</Button>
            </div>
            <div id="mealList">
              <MealListings listings={this.state.listings}/>
            </div>
          </Grid.Column>
          {/* {this.state.listing
            ? <MealListings listings={this.state.listings}/>
            : <p>No meals available in your area :( </p>} */}
            <Grid.Column>
              <div id="mapDiv">
                <Map listings={this.state.listings}/>
              </div>
              <div id="recentMealHeader">
                Recent Meals
              </div>
              <div id="listOfRecents">
                List of Recent Meals
              </div>
            </Grid.Column>
          </Grid>
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
