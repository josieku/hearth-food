import React, { Component } from "react";
import { Button, Form, Grid, Header, Image, Message, Segment, Modal } from 'semantic-ui-react';

export default class MealEdit extends Component {
  state = {
    title: this.props.meal.title,
    description: this.props.meal.description,
    ingredients: this.props.meal.ingredients,
    price: this.props.meal.price,
    cuisine: this.props.meal.cuisine,
    chef: Object.assign({}, this.props.meal.chef),
    modalOpen: true,
  }

  componentDidMount(){
    if (Object.keys(this.props.meal).length === 0){
      fetch(`/meal/${this.props.id}`)
      .then(resp => resp.json())
      .then(async meal => {
        console.log('meal', meal)
        if (this.props.user._id !== meal.chef._id){
          this.props.history.push(`/meal/${meal._id}`)
        }
        await this.setState({
          title: meal.title,
          description: meal.description,
          ingredients: meal.ingredients,
          price: meal.price,
          cuisine: meal.cuisine,
          chef: meal.chef
        })
      })
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
    this.props.history.push(`/dashboard/menu`)
  }

  cancel = e => {
    this.setState({
      title: '',
      description: '',
      ingredients: '',
      price: '',
      cuisine: ''
    })
    this.props.history.push(`/dashboard/menu`)
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
    this.props.history.push(`/dashboard/menu`)
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
      <div className='login-form'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
          `}</style>
          <Grid style={{height: '100%', justifyContent: 'center'}} verticalAlign='middle'>
            <Grid.Column style={{maxWidth: 450}}>
              <Header as="h2" textAlign="center">Edit Meal</Header>
              <Form size='large'>
                <Segment raised>
                  <Form.Input label="Dish Title" fluid placeholder="Title" value={meal.title} onChange={e => this.setState({title: e.target.value})} required/>
                  <Form.TextArea  label="Description" fluid placeholder="Description" value={meal.description} onChange={e => this.setState({description: e.target.value})} required/>
                  <Form.TextArea label="Ingredients" fluid placeholder="Ingredients" value={meal.ingredients} onChange={e => this.setState({ingredients: e.target.value})} required/>
                  <Form.Input  label="Price per dish" fluid placeholder="Price USD" value={meal.price} onChange={e => this.setState({price: e.target.value})} required/>
                  <Form.Input label="Cuisine" fluid placeholder="Cuisine" value={meal.cuisine} onChange={e => this.setState({cuisine: e.target.value})} required/>
                  <div id="addDishButtons">
                    <Button id="loginButton" size="large" onClick={this.save}>Save</Button>
                    <Button id="loginButton" size="large"  style={{backgroundColor: '#d6d4d4'}} onClick={this.cancel}>Cancel</Button>
                  </div>
                  <div style={{marginLeft: '30%', marginRight: '30%'}}>
                    <Button id="loginButton" size="large" style={{backgroundColor: '#d6d4d4'}} onClick={this.archive}>Archive Meal</Button>
                  </div>
                </Segment>
              </Form>
              {/* <Reviews list={this.state.meals.reviews} required/> */}
            </Grid.Column>
          </Grid>
        </div>
      )
    }
  };
