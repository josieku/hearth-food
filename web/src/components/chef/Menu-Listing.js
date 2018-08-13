import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Grid, Menu, Segment } from 'semantic-ui-react';

import Edit from './../meals/MealProfile-Edit';

function MenuListItem(item) {
  return (
    <div className="menu-list-item">
      <Link to={`/meal/${item._id}`}><p><strong>{item.title}</strong></p></Link>
      {item.archived ? <h1>Meal Archived </h1> : null}
      <p>Description: {item.description}</p>
      <p>Ingredients: {item.ingredients}</p>
      <p>Price: {item.price}</p>
      <p>Number of reviews: {item.reviews.length}</p>
      <p>Reviews</p>
      <p>Status: {item.status}</p>
      <Link to={`/meal/${item._id}/edit`}><Button>Edit</Button></Link>
      <Link to={`/meal/${item._id}/setavailable`}><Button>Set Availability</Button></Link>
    </div>
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
        <h2>Menu
          <Link to='/dashboard/menu/add'><Button>Add a Dish</Button></Link>
          <Link to='/dashboard/menu/archived'><Button>See Archived Meals</Button></Link>
        </h2>
        { this.props.menu.length > 0
          ? <Grid columns={2}>
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
              <Segment>
                {this.state.shownRecipe ? MenuListItem(this.state.shownRecipe) : null}
              </Segment>
            </Grid.Column>
          </Grid>
        : "No meals, add now!" }
      </div>
    )
  }
}
