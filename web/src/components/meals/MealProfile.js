import React, { Component } from "react";
import { Route, Switch, Link } from 'react-router-dom';

// import MealView from './MealProfile-View';
// import MealEdit from './MealProfile-Edit';
// import MealRequest from './MealProfile-Request';


class MealRequest extends Component {
  state = {
    time: "",
    requests: "",
    chef: Object.assign({}, this.props.meal.chef),
  }

  componentDidMount(){
    if (Object.keys(this.props.user).length===0){
      this.props.history.push('/auth/login')
    }
  }

  request = e => {
    console.log("fetching to request")
    fetch(`/meal/${this.props.meal._id}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({
        chef: this.state.chef._id,
        consumer: this.props.user._id,
        meal: this.props.meal._id,
        requests: this.state.requests,
        time: new Date(),
      }),
    })
    .then(e => {
      this.setState({
        time: "",
        requests: "",
      })
      this.props.history.push(`/meal/${this.props.meal._id}`)
    })
  }

  render(){
    const meal = this.props.meal;
    const user = this.props.user;
    console.log('in here requesting');
    return(
      <div>
        <h3>Request {this.state.chef.firstName} for {meal.title}</h3>
        <p>Request review:</p>
        <ul style={{listStyleType: "none"}}>
          <p>Description: {meal.description}</p>
          <p>Ingredients: {meal.ingredients}</p>
          <h2>Price: {meal.price}</h2>
        </ul>
        <form>
          <input placeholder="Additional Requests"
                 value={this.state.requests}
                 onChange={e => this.setState({requests: e.target.value})}/>
          <input type="date"/>
                 {/* // onChange={e => this.setState({time: new Date(e.target.value)})}/> */}
        </form>
        <button onClick={this.request}>Request</button>
      </div>
    )
  }
};

class MealEdit extends Component {
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

function OneReview(review){
  return (
    <li>
      <div className="review-single">
        <p>{review.subject}</p>
        <p>{review.author}</p>
        <p>{review.date}</p>
        <p>{review.body}</p>
      </div>
    </li>
  )
}

class Reviews extends Component {
  render(){
    return(
      <div className="review-board">
        <ul>
          {this.props.list ? this.props.list.map(review => OneReview(review)) : <p>No reviews yet!</p>}
        </ul>
      </div>
    )
  }
}

function requestEditButton(user, chef, meal) {
  if (meal.archived){
    return null
  }

  if (user._id === chef._id){
    return <button><Link to={`/meal/${meal._id}/edit`}>Edit meal</Link></button>
  }

  for (var ind in user.orders){
    if (user.orders[ind]===meal._id){
      return <button>Cancel request</button>
    }
  }

  return <button><Link to={`/meal/${meal._id}/request`}>Request this meal</Link></button>
}

class MealView extends Component {
  render(){
    console.log(this.props);
    const meal = this.props.meal;
    const chef = Object.assign({}, meal.chef);
    const user = this.props.user;
    return(
      <div>
        <p>Meal Profile</p>
        {meal.archived ? <h1>This meal has been archived</h1> : null}
        <h4>{meal.title}</h4>
        {requestEditButton(user, chef, meal)}
        <p>Price: <strong>{meal.price}</strong></p>
        <img src={meal.picture}/>
        <p>Cuisine: {meal.cuisine}</p>
        <p><strong>Description:</strong></p>
        <p>{meal.description}</p>
        <p><strong>Ingredients:</strong></p>
        <p>{meal.ingredients}</p>
        <p><strong>Reviews:</strong></p>
        <Reviews list={meal.reviews}/>
      </div>
    )
  }
};

class Hi extends Component {
  render(){
    return(
      <h1>hi</h1>
    )
  }
}

export default class MealProfile extends Component {
  state = {
    meal: {},
  }

  componentDidMount = e => {
    console.log('mounting');
    fetch(`/meal/${this.props.id}`)
      .then(resp => resp.json())
      .then(meal => {
        this.setState({ meal });
        console.log(this.props);
      })
  }

  save = (title, description, ingredients, price, cuisine) => {
    fetch(`/meal/${this.props.id}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({
        title, description, ingredients, price, cuisine
      }),
    })
    .then(resp => resp.json())
    .then(meal => {
      this.setState({ meal })
    })
  }

  archive = () => {
    fetch(`/meal/${this.props.id}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
    })
    .then(resp => resp.json())
    .then(meal => this.setState({ meal }))
  }

  render(){
    const id = this.props.id
    return(
      <div>
        <Link to={`/meal/${id}/edit`}>Edit</Link>
        <Switch>
          <Route exact path={`/meal/${id}`} component={Hi}/>

          <Route exact path={`/meal/${id}/edit`} render={(props) =>
            <MealEdit meal={this.state.meal} user={this.props.user}
              save={this.save} archive={this.archive} {...props}/>}/>

          {/* <Route path={`/meal/${id}`} render={(props)=>
            <MealView meal={this.state.meal}
              user={this.props.user} {...props}/> }/> */}
          {/* <Route exact path='/meal/:id/edit' render={(props) =>
            <MealEdit meal={this.state.meal} user={this.props.user}
              save={this.save} archive={this.archive} {...props}/>}/>

          {/* <Route exact path='/meal/:id/request' render={() =>
            <h1>REQUEST THIS MEAL</h1>}/>

          <Route exact path='/meal/:id/edit' render={() =>
            <h1>EDIT THIS MEAL</h1>}/> */}
        </Switch>
      </div>
    )
  }
};
