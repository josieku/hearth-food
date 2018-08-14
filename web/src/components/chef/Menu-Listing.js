import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Dropdown, Grid, Header, Input, Item, Menu, Segment } from 'semantic-ui-react';

import Edit from './../meals/MealProfile-Edit';

function MenuListItem(item) {
  return (
    <Item className="menu-list-item">
      <Header href={`/meal/${item._id}`}><p><strong>{item.title}</strong></p></Header>
      {item.archived ? <Header as='h1'>Meal Archived </Header> : null}
      <Item.Description><strong>Description: </strong>{item.description}</Item.Description>
      <Item.Content><strong>Ingredients: </strong>{item.ingredients}</Item.Content>
      <Item.Content><strong>Price: </strong>{item.price}</Item.Content>
      <Item.Content><strong>Number of reviews: </strong>{item.reviews.length}</Item.Content>
      <Item.Content><strong>Status: </strong>{item.status}</Item.Content>
      <Button href={`/meal/${item._id}/edit`} size='mini' style={{backgroundColor: '#B73535', color: 'white'}}>Edit</Button>
      <Button href={`/meal/${item._id}/setavailable`} size='mini' style={{backgroundColor: '#B73535', color: 'white'}}>Set Availability</Button>
    </Item>
  )
}

export default class MenuListing extends Component{
  state = {
    activeItem: this.props.menu.length >0 ? this.props.menu[0].title : null,
    shownRecipe: this.props.menu.length > 0 ? this.props.menu[0] : null
  }
  handleClick = (item) => {
    this.setState({shownRecipe: item, activeItem: item.title})
  }
  render(){
    const { activeItem } = this.state
    console.log("RESD", this.props.menu[0]);
    return (
      <div>
        <Menu text id="chefMenu">
          <Menu.Item header>Your Menu</Menu.Item>
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
            <Button href='/dashboard/menu/add' id='redButton'>Add a Dish</Button>
            <Button href='/dashboard/menu/archived' id='redButton'>See Archived Meals</Button>
          </Menu.Menu>
        </Menu>
        { this.props.menu.length > 0
          ? <Segment basic>
            <Grid columns={2}>
              <Grid.Column width={4}>
                <Menu fluid vertical tabular>
                  {this.props.menu.length > 0
                    ? this.props.menu.map(item =>
                      <Menu.Item color='red' name={item.title} key={item._id}
                        active={activeItem === item.title} onClick={()=>this.handleClick(item)}/>)
                        : null}
                      </Menu>
                    </Grid.Column>
                    <Grid.Column stretched width={12}>
                      <Segment attached>
                        {this.state.shownRecipe ? MenuListItem(this.state.shownRecipe) : null}
                      </Segment>
                    </Grid.Column>
                  </Grid>
                </Segment>
                : "No meals, add now!" }
              </div>
            )
          }
        }
