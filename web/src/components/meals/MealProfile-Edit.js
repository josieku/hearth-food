import React, { Component } from "react";

export default class MealEdit extends Component {
  state = {
    title: this.props.meal.title,
    description: this.props.meal.description,
    ingredients: this.props.meal.ingredients,
    price: this.props.meal.price,
    cuisine: this.props.meal.cuisine,
    chef: Object.assign({}, this.props.meal.chef)
  }

  componentDidMount(){
    if (this.props.user._id !== this.state.chef._id){
      this.props.history.push(`/meal/${this.props.meal._id}`)
    }
  }

  save = e => {
    this.props.save(this.state.title, this.state.description, this.state.ingredients, this.state.price, this.state.cuisine)
    this.setState({
      title: '',
      description: '',
      ingredients: '',
      price: '',
      cuisine: ''
    })
    this.props.history.push(`/meal/${this.props.meal._id}`)
  }

  archive = e => {
    this.props.archive();
    this.setState({
      title: '',
      description: '',
      ingredients: '',
      price: '',
      cuisine: ''
    })
    this.props.history.push(`/chef/${this.state.chef._id}`)
  }

  componentWillUnmount(){
    this.setState({
      title: '',
      description: '',
      ingredients: '',
      price: '',
      cuisine: ''
    })
  }

  render(){
    const meal = this.state;
    const chef = Object.assign({}, meal.chef);
    const user = this.props.user;
    return(
      <div>
        <p>Meal Edit</p>
        <form>
          <input placeholder="Title" value={meal.title} onChange={e => this.setState({title: e.target.value})}/>
          <input placeholder="Description" value={meal.description} onChange={e => this.setState({description: e.target.value})}/>
          <input placeholder="Ingredients" value={meal.ingredients} onChange={e => this.setState({ingredients: e.target.value})}/>
          <input placeholder="Price USD" value={meal.price} onChange={e => this.setState({price: e.target.value})}/>
          <input placeholder="Cuisine" value={meal.cuisine} onChange={e => this.setState({cuisine: e.target.value})}/>
        </form>
        <button onClick={this.save}>Save</button>
        <button onClick={this.archive}>Archive Meal</button>
        {/* <Reviews list={this.state.meals.reviews}/> */}
      </div>
    )
  }
};
