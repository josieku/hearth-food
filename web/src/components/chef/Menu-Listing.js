import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Grid, Header, Item, Menu, Segment } from 'semantic-ui-react';

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
      <Link to={`/meal/${item._id}/setavailable`}><Button>Set Availability</Button></Link>
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
    // console.log(this.props.menu)
    return (
      <div>
        <Header as='h2' id='menuHeader'>Menu <br/>
          <Button href='/dashboard/menu/add' id='redButton'>Add a Dish</Button>
          <Button href='/dashboard/menu/archived' id='redButton'>See Archived Meals</Button>
        </Header>
        { this.props.menu.length > 0
          ? <Segment basic style={{backgroundColor: 'red'}}>
          <Grid columns={2}>
            <Grid.Column width={4}>
              <Menu fluid vertical tabular>
                {this.props.menu.length > 0
                  ? this.props.menu.map(item =>
                    <Menu.Item name={item.title} key={item._id}
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
