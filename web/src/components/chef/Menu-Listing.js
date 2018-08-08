import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Grid, Menu, Segment } from 'semantic-ui-react';

function MenuListItem(item) {
  return (
    <div className="menu-list-item">
      {/* <Link to={`/meal/${item._id}`}><p><strong>{item.title}</strong></p></Link> */}
      <p><strong>{item.title}</strong></p>
      {item.archived ? <h1>Meal Archived </h1> : null}
      <p>Description: {item.description}</p>
      <p>Ingredients: {item.ingredients}</p>
      <p>Price: {item.price}</p>
      <p>Number of reviews: {item.reviews.length}</p>
      <p>Reviews</p>
      <p>Status: {item.status}</p>
      <Link to={`/meal/${item._id}/edit`}>Edit</Link>
      {/* <Link to={`/meal/${item.}`}>View orders</Link> */}
      {/* <Link to={`/meal/${item._id}/archive`}>Archive</Link> */}
    </div>
  )
}

export default class MenuListing extends Component{
  state = {
    activeItem: this.props.menu[0].title,
    shownRecipe: this.props.menu[0]
  }
  handleClick = (item) => {
    this.setState({shownRecipe: item, activeItem: item.title})
  }
  render(){
    const { activeItem } = this.state
    console.log(this.props.menu)
    return (
      <div>
        <h2>Menu
          <Button><Link to='/dashboard/menu/add'>Add a Dish</Link></Button>
        </h2>
        <Grid columns={2}>
          <Grid.Column width={4}>
            <Menu fluid vertical tabular>
              {this.props.menu.map(item =>
                <Menu.Item name={item.title} key={item._id}
                  active={activeItem === item.title} onClick={()=>this.handleClick(item)}/>
              )}
            </Menu>
          </Grid.Column>
          <Grid.Column stretched width={12}>
            <Segment>
          {/* <ul style={{listStyleType: "none"}}>
            {this.props.menu.length > 0 ? this.props.menu.map(MenuListItem): 'Empty menu :(  Add dishes now!'}
          </ul> */}
          {this.state.shownRecipe ? MenuListItem(this.state.shownRecipe) : null}
        </Segment>
        </Grid.Column>
        </Grid>
      </div>
    )
  }
}
