import React, { Component } from "react";
import { Button, Divider, Form, Grid, Header, Image, Input, Item, Rating, Segment, TextArea, Loader, Modal, Checkbox } from 'semantic-ui-react';
import RatingComp from 'react-star-rating-lite';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  EmailShareButton,
} from 'react-share';

export default class AddReview extends Component {
  state = {
    content: "",
    anonymous: false,
    rating: 1,
  }

  send = () => {
    this.props.add(this.state.content,
                   this.state.anonymous,
                   this.state.rating,
                   this.props.requestId,
                   this.props.meal._id,
                   this.props.ind);
    this.setState({
      content: "",
      anonymous: false,
      rating: 1,
    })
    this.props.close();
  }

  renderForm = () => {
    if (this.props.verified) {
      return (
        <Modal open={this.props.open} style={{padding: "15px"}}>
          {this.props.auto
            ? <Modal.Header>Hope you enjoyed {this.props.meal.title}.  Leave a Review!</Modal.Header>
            : <Modal.Header>Leave a review for {this.props.meal.title}</Modal.Header>
          }
          <Modal.Content>
            <Form size='large'>
              <Form.Field>
                <label>{this.state.anonymous ? "Anonymous says:": `${this.props.user.firstName} says:`}</label>
                <Form.TextArea style={{height: '50px'}}
                  placeholder="Let the chef know what you did and didn't like..."
                  onChange={(e)=>{this.setState({ content: e.target.value })}}/>
              </Form.Field>

              <Form.Field>
                <Checkbox label="Click to be anonymous" onClick={()=>{this.setState({ anonymous: !this.state.anonymous })}}/>
              </Form.Field>

              <Form.Field style={{marginTop:"5px"}}>
                <label>Give your meal a rating</label>
                <RatingComp onClick={rating => this.setState({ rating })}/>
              </Form.Field>
              <Button id='redButton' size='mini' onClick={this.send}>Submit</Button>
              <Button id='redButton' size='mini' onClick={this.props.close}>Cancel</Button>
            </Form>
          </Modal.Content>
        </Modal>
        )} else {
          return <p style={{marginTop:"7px", marginLeft:"5px"}}>You have not purchased this meal yet.  Buy now to leave a review! </p>
        }
      }

    render(){
      return(
        <div>
          {this.props.open ? this.renderForm() : null }
        </div>
      )
    }
  }
