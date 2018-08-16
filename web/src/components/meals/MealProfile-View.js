import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Rating, Segment, Loader, Item, Divider } from 'semantic-ui-react';
import { FacebookShareButton, GooglePlusShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton,
         PinterestShareButton, RedditShareButton, TumblrShareButton, EmailShareButton } from 'react-share';

function OneReview(review){
  return (
    <Item className="review-single">
      <Item.Content>{review.subject}</Item.Content>
      <Item.Content style={{color: '#B73535', fontWeight: 'bold'}}>{review.anonymous ? <strong>Anonymous says:</strong> : <strong>{review.author.firstName} says: </strong>}</Item.Content>
      <Rating icon='star' defaultRating={review.rating} maxRating={5} size='mini' disabled/>
      <Item.Content>{new Date(review.date).toDateString()}</Item.Content>
      <Item.Content>{review.body}</Item.Content>
      <Divider fitted/>
    </Item>
  )
}

class Reviews extends Component {
  render(){
    return(
      <div className="review-board">
        {this.props.list.length > 0
          ? this.props.list.map(review => OneReview(review))
          : <p> No reviews yet! </p>
        }
      </div>
    )
  }
}

class AddReview extends Component {
  state = {
    content: "",
    anonymous: false,
    rating: 1,
    open: false,
  }

  send = () => {
    this.props.add(this.state.content, this.state.anonymous, this.state.rating, this.props.requestId);
    this.setState({
      content: "",
      anonymous: false,
      rating: 1,
      open: false,
    })
  }

  renderForm = () => {
    if (this.props.verified) {
      return (
        <form>
          <label>{this.state.anonymous ? "Anon says:": `${this.props.user.firstName} says:`}</label>
          <input placeholder="Great meal! However, I wish ..." onChange={(e)=>{this.setState({ content: e.target.value })}}/>
          <label>Click to be anonymous </label>
          <input type="checkbox" onClick={()=>{this.setState({ anonymous: !this.state.anonymous })}}/>
          <label>Give your meal a rating </label>
          <input type="number" min="1" max="5"
            onChange={(e)=>{this.setState({ rating: e.target.value })}}/>
            <button onClick={this.send}>Send</button>
          </form>
        )} else {
          return <p>You have not purchased this meal yet.  Buy now to leave a review! </p>
        }
      }

      render(){
        return(
          <div>
            <Button id="redButton" style={{margin: '0px'}} size='mini' onClick={()=>this.setState({ open: !this.state.open })}>Leave a review</Button>
            {this.state.open ? this.renderForm() : null }
          </div>
        )
      }
    }

    function requestEditButton(user, chef, meal) {
      if (meal.archived){
        return null
      }

      if (user._id === chef._id){
        return (
          <div>
            <Button><Link to={`/meal/${meal._id}/edit`}>Edit meal</Link></Button>
            <Button><Link to={`/meal/${meal._id}/setavailable`}>Set Availability</Link></Button>
          </div>
        )
      }

      for (var ind in user.orders){
        if (user.orders[ind]===meal._id){
          return <Button>Cancel request</Button>
        }
      }
      return null
      // return <div><Button size="mini" href='`/meal/${meal._id}/request`' float='right'>Request this meal</Button></div>
    }

    function timeslots(timeObj, mealId) {
      const path=`/meal/${mealId}/request?time=${timeObj.time}`
      return(
        <div key={timeObj._id}>
          <Link to={path}>
            <Button id='redButton' style={{margin: '0px'}} size='mini'>
              <p>{new Date(timeObj.date).toDateString()}</p>
              <p>{timeObj.start} to {timeObj.end}</p>
            </Button>
          </Link>
        </div>
      )
    }

    export default class MealView extends Component {
      render(){
        const meal = this.props.meal;
        const chef = Object.assign({}, meal.chef);
        const user = this.props.user;
        console.log('reviews', meal.reviews)
        return(
          <div className="main">
            <Segment>
              {this.props.loading
                ? <Loader active inline='centered'>Patience for a great meal...</Loader>
                : <Grid columns={2}>
                  {meal.archived ? <h1>This meal has been archived</h1> : null}
                  <Grid.Column width={8}>
                    <Item>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={8} textAlign='left'>
                            <Item.Header as='h2' style={{margin: '0', paddingBottom: '3px'}}>{meal.title}</Item.Header>
                          </Grid.Column>
                          <Grid.Column textAlign='right' width={8}>
                            <Item.Header as='h2' style={{margin: '0', paddingBottom: '3px'}}><strong>Price:</strong>${meal.price}</Item.Header>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <Divider fitted/>
                      <Rating icon='star' defaultRating={meal.overallRating} maxRating={5} size='huge' disabled/>
                      {requestEditButton(user, chef, meal)}
                      { this.props.times.length > 0
                        ?
                        <div>
                          <Item.Content><strong>Available Pick Up Times: </strong></Item.Content>
                          {meal.archived
                            ? null
                            : this.props.times.map(item=>timeslots(item, meal._id))}
                          </div>
                          : <Item.Content>No available pick up times, check again later</Item.Content>}
                          <Item.Header as='h3' style={{marginBottom: '0', marginTop: '10px'}}><strong>Cuisine: </strong></Item.Header>
                          <Item.Content style={{marginBottom: '3px'}}>{meal.cuisine}</Item.Content>
                          <Item.Header as='h3' style={{marginBottom: '0', marginTop: '10px'}}><strong>Description:</strong></Item.Header>
                          <Item.Content style={{marginBottom: '3px'}}>{meal.description}</Item.Content>
                          <Item.Header as='h3' style={{marginBottom: '0', marginTop: '10px'}}><strong>Ingredients:</strong></Item.Header>
                          <Item.Content style={{marginBottom: '3px'}}>{meal.ingredients}</Item.Content>
                        </Item>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Image src={meal.picture} rounded fluid/>
                      </Grid.Column>
                      <Grid.Row>
                        <Grid.Column width={16}>
                          <AddReview mealId={meal._id} user={user} add={this.props.add}
                            requestId={this.props.requestId} verified={this.props.verified}/>
                            <Header as='h2' style={{margin: '0'}}><strong>Meal Reviews </strong></Header>
                            <Segment piled style={{margin: 0}}>
                              <Reviews list={this.props.reviews}/>
                            </Segment>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    }
                    </Segment>
                  </div>
                )
              }
            };
