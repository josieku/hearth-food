import React, { Component } from "react";
import { Link } from 'react-router-dom';

function MenuListItem(item) {
  return (
    <li key={item._id} className="menu-list-item" style={{border:"1px solid black"}}>
      <Link to={`/meal/${item._id}`}><p><strong>{item.title}</strong></p></Link>
      {item.archived ? <h1>Meal Archived </h1> : null}
      <p>Description: {item.description}</p>
      <p>Ingredients: {item.ingredients}</p>
      <p>Price: {item.price}</p>
      <p>Number of reviews: {item.reviews.length}</p>
      <p>Status: {item.status}</p>
      <Link to={`/meal/${item._id}/edit`}>Edit</Link>
      {/* <Link to={`/meal/${item.}`}>View orders</Link> */}
      {/* <Link to={`/meal/${item._id}/archive`}>Archive</Link> */}
    </li>
  )
}

export default class MenuListing extends Component{
  render(){
    return (
      <div>
        <h2>Menu</h2>
        <button><Link to='/dashboard/menu/add'>Add a Dish</Link></button>
        <ul style={{listStyleType: "none"}}>
          {this.props.menu.length > 0 ? this.props.menu.map(MenuListItem): 'Empty menu :(  Add dishes now!'}
        </ul>
      </div>
    )
  }
}
