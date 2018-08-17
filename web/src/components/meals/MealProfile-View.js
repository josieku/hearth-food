import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Form, Grid, Header, Image, Input, Item, Rating, Segment, TextArea, Loader, Modal, Checkbox } from 'semantic-ui-react';
import RatingComp from 'react-star-rating-lite';

import AddReview from './MealProfile-Review';
// import { FacebookShareButton, GooglePlusShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton,
//          PinterestShareButton, RedditShareButton, TumblrShareButton, EmailShareButton } from 'react-share';

function OneReview(review){
  return (
    <Item className="review-single" style={{marginBottom: "5px"}} key={review._id}>
      <Item.Content>{review.subject}</Item.Content>
      <Item.Content style={{color: '#B73535', fontWeight: 'bold'}}>{review.anonymous ? <strong>Anonymous says:</strong> : <strong>{review.author.firstName} says: </strong>}</Item.Content>
      <Item.Content>
        <Rating icon='star' defaultRating={review.rating} maxRating={5} size='mini' disabled/>
        <span style={{color: 'gray', fontSize:'10px'}}> {new Date(review.date).toDateString()}</span>
      </Item.Content>
      <Item.Content>{review.body}</Item.Content>
      <Divider fitted style={{marginTop: "5px"}}/>
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

class LeaveReview extends Component {
  state = { open: false }

  close = () => {
    this.setState({ open: false })
  }

  render(){
    console.log('in here')
    return(
      <Grid.Row>
        <Button id="redButton" style={{margin: '0px'}} onClick={()=>this.setState({ open: true })}>
          Leave a review
        </Button>
        <AddReview user={this.props.user} add={this.props.add}
          meal={this.props.meal} open={this.state.open} close={this.close}
          requestId={this.props.requestId} verified={this.props.verified}/>
      </Grid.Row>
    )
  }
}

function timeslots(timeObj, mealId) {
  const path=`/meal/${mealId}/request?time=${timeObj.time}`
  return(
  <div key={timeObj._id} style={{margin: "5px"}}>
    <Button id='redButton' href={path} style={{margin: '0px'}} size='mini'>
      {/* <p>{new Date(timeObj.date).toDateString()}</p> */}
      <p>{timeObj.start} to {timeObj.end}</p>
    </Button>
  </div>
  )
}

function dateslots(timeObj) {
  return (
    <Grid>
      {Object.keys(timeObj).map((date, ind) =>
        <Grid.Row key={ind}>
          <strong>{new Date(date).toDateString()} </strong>
          {timeObj[date].map((item, mealId)=> {
            // console.log('item!!!!!',item);
            return timeslots(item, item.meal)
          })}
        </Grid.Row>
      )}
    </Grid>
  )
}

export default class MealView extends Component {
render(){
const meal = this.props.meal;
const chef = Object.assign({}, meal.chef);
const user = this.props.user;

const subheadings = {
  marginBottom: '5px',
  marginTop: '10px'
}

const descriptions = {
  marginBottom: '3px'
}

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
              <div style={{marginTop:"5px", marginBottom: "5px"}}>
                { meal.reviews.length > 4
                  ? <Rating icon='star' defaultRating={meal.overallRating} maxRating={5} size='huge' disabled/>
                  : <span>Rating is not available ({meal.reviews.length} reviews)</span>
                }
              </div>
              {/* {requestEditButton(user, chef, meal)} */}
              { Object.keys(this.props.times).length > 0
                ?
                <div>
                  <Item.Header as='h3' style={{marginBottom: '0', marginTop: '10px'}}><strong>Available Pickup Times: </strong></Item.Header>
                  <Grid>
                    <Grid.Row style={{marginLeft: "10px"}}>
                      {meal.archived
                        ? null
                        : dateslots(this.props.times, meal._id)
                        // this.props.times.filter(item=>item.time > Date.now()).map(item=>timeslots(item, meal._id))
                      }
                      </Grid.Row>
                    </Grid>
                  </div>
                  : <Item.Content>No available pick up times, check again later</Item.Content>}
                  <Item.Header as='h3' style={subheadings}><strong>Cuisine: </strong></Item.Header>
                  <Item.Content style={descriptions}>{meal.cuisine}</Item.Content>
                  <Item.Header as='h3' style={subheadings}><strong>Description:</strong></Item.Header>
                  <Item.Content style={descriptions}>{meal.description}</Item.Content>
                  <Item.Header as='h3' style={subheadings}><strong>Ingredients:</strong></Item.Header>
                  <Item.Content style={descriptions}>{meal.ingredients}</Item.Content>
                </Item>
              </Grid.Column>
              <Grid.Column width={8}>
                <Image src={meal.picture} rounded fluid/>
              </Grid.Column>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Grid>
                    <Grid.Column width={3}>
                      <Header as='h2' style={{margin: '0'}}><strong>Meal Reviews </strong></Header>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <LeaveReview user={user} add={this.props.add} meal={meal}
                        requestId={this.props.requestId} verified={this.props.verified}/>
                    </Grid.Column>
                    </Grid>
                    <Segment piled style={{marginTop: "10px"}}>
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
