import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Dropdown, Grid, Header, Image, Input, Item, Menu, Rating, Segment, Loader, Divider } from 'semantic-ui-react';
// import Offer from './../meals/MealProfile-SetAvailability';
import Edit from './../meals/MealProfile-Edit';

function MenuListItem(item) {
  return (
    <Grid>
      <Grid.Column width={9}>
        <Item className="menu-list-item" >
          <Grid>
            <Grid.Column width={12} textAlign='left'>
              <Item.Header as='h2' href={`/meal/${item._id}`}>{item.title}</Item.Header>
            </Grid.Column>
            <Grid.Column textAlign='right' width={4}>
              <Item.Header as="h4"><strong>Price: </strong>${item.price}</Item.Header>
            </Grid.Column>
          </Grid>
          <Divider/>
          {item.archived ? <Header as='h1'>Meal Archived </Header> : null}
          <Item.Description><strong>Cuisine: </strong>{item.cuisine.map(c => c)}</Item.Description>
          <Item.Description><strong>Description: </strong>{item.description}</Item.Description>
          <Item.Content><strong>Ingredients: </strong>{item.ingredients}</Item.Content>
          <Item.Content><strong>Number of reviews: </strong>{item.reviews.length}</Item.Content>
          <Item.Content>
            <strong>Rating: </strong>
            {item.reviews.length > 4
              ? <Rating icon='star' defaultRating={item.overallRating} maxRating={5} disabled/>
              : <span>Not available</span>
            }
          </Item.Content>
          <br/>
          <Button href={`/meal/${item._id}/edit`} size='mini' style={{backgroundColor: '#B73535', color: 'white'}}>Edit</Button>
          <Button href={`/meal/${item._id}`} size='mini' style={{backgroundColor: '#B73535', color: 'white'}}>View</Button>
          <Button href={`/meal/${item._id}/setavailable`} size='mini' style={{backgroundColor: '#B73535', color: 'white'}}>Offer Meal</Button>
        </Item>
      </Grid.Column>
      <Grid.Column width={7}>
        <Image src={item.picture} fluid circular/>
      </Grid.Column>
    </Grid>
  )
}



export default class MenuListing extends Component{
  state = {
    activeItem: this.props.menu.length >0 ? this.props.menu[0].title : null,
    shownRecipe: this.props.menu[0]
  }

  handleClick = (item) => {
    this.setState({shownRecipe: item, activeItem: item.title})
  }


  render(){
    const { activeItem } = this.state
    return (
      <div>
        <Menu text id="chefMenu">
          <Menu.Item header style={{color: 'white'}}>Your Menu</Menu.Item>
          <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
            <Input id='searchInHeader' icon='search' placeholder='Search...' onChange={(e)=>this.props.search(e.target.value)}/>
            <Dropdown icon='sort amount down' floating button className="icon" id="redButton">
              <Dropdown.Menu>
                <Dropdown.Header content='Sort by selection' />
                <Dropdown.Divider />
                <Dropdown.Item onClick={()=>{this.props.sort("high")}}>Price: Low to High
                </Dropdown.Item>
                <Dropdown.Item onClick={()=>{this.props.sort("low")}}>Price: High to Low</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button href='/dashboard/menu/add' id='redButton'>Add a Dish</Button>
            <Button href='/dashboard/menu/archived' id='redButton'>See Archived Meals</Button>
          </Menu.Menu>
        </Menu>
        { this.props.loading
          ? <Loader active inline='centered'>Hungry customers await your delicious meals...</Loader>
          : this.props.menu.length > 0
          ? <Segment style={{backgroundColor: '#EAF2EF'}}>
            <Grid columns={2}>
              <Grid.Column width={4} style={{paddingRight: '0px'}}>
                <Menu fluid vertical tabular style={{borderRight: '0px'}}>
                  {this.props.menu.length > 0
                    ? this.props.menu.map(item =>
                      <Menu.Item name={item.title} key={item._id}
                        active={activeItem === item.title} onClick={()=>this.handleClick(item)}/>)
                        : null}
                      </Menu>
                    </Grid.Column>
                    <Grid.Column stretched width={12} style={{paddingLeft: '0px'}}>
                      <Segment basic style={{backgroundColor: 'white', borderRadius: '3px'}}>
                        {this.state.shownRecipe ? MenuListItem(this.state.shownRecipe) : null}
                      </Segment>
                    </Grid.Column>
                  </Grid>
                </Segment>
                : "No meals, add now!"
              }
            </div>
            )
          }
        }
