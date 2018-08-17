import React, { Component } from "react";
import { Button, Form, Grid, Header, Image, Input, Item, Segment, TextArea, Dimmer, Loader } from 'semantic-ui-react';

export default class MealRequest extends Component {
  state = {
    time: this.props.result ? this.props.result : "",
    requests: "",
    chef: Object.assign({}, this.props.meal.chef),
    loadingReq: false,
  }

  componentDidMount(){
    if (Object.keys(this.props.user).length===0){
      this.props.history.push('/auth/login')
    }
  }

  chosenTime = () => {
    const chosen = this.props.times ? this.props.times.find(item=> item.time === this.state.time) : null;
    if (chosen){
      return <Item.Content floated='right'>
              <span>{new Date(chosen.date).toDateString()} at {chosen.start}</span>
              <Button id="redButton" size='mini' onClick={()=>this.setState({ time: "" })}>Change</Button>
            </Item.Content>
    }
  }

  timeslots = (timeObj) => {
    return(
      <Button onClick={()=>this.setState({ time: timeObj.time })}>
        <p>{new Date(timeObj.date).toDateString()}</p>
        <p>{timeObj.start} to {timeObj.end}</p>
      </Button>
    )
  }

  request = e => {
    this.setState({ loadingReq: true })
    fetch(`/meal/${this.props.meal._id}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        chef: this.props.meal.chef,
        consumer: this.props.user._id,
        meal: this.props.meal._id,
        requests: this.state.requests,
        time: this.props.times.find(item => item.time === this.state.time ),
      }),
    })
    .then(async e => {
      await this.setState({
        time: "",
        requests: "",
        loadingReq: false,
      })
      this.props.history.push(`/meal/${this.props.meal._id}`)
    })
  }

  render(){
    const meal = this.props.meal;
    const user = this.props.user;
    return(
      <div>
        <Item>
          <Header as="h3">Request for {meal.title}</Header>
          <Segment>
            {Object.keys(meal).length === 0
              ? <Loader active inline='centered'>Prepping the kitchen...</Loader>
              : <Grid columns={2}>
                <Grid.Column width={8}>
                  <Item.Content><strong>Description: </strong>{meal.description}</Item.Content>
                  <Item.Content><strong>Ingredients: </strong>{meal.ingredients}</Item.Content>
                  <Item.Header as="h3">Price: ${meal.price}</Item.Header>
                  <div>
                    <Item><strong>Pickup time: </strong></Item>
                    {this.state.time
                      ? this.chosenTime()
                      : this.props.times.map(this.timeslots)
                    }
                  </div>
                  <Item.Content><strong>Additional Requests: </strong></Item.Content>
                  <Form>
                    <TextArea placeholder="Input additional requests for the chef"
                      value={this.state.requests}
                      onChange={e => this.setState({requests: e.target.value})}/>
                    </Form>
                    <Button id="redButton" onClick={this.request} attached='bottom' size='mini' style={{width: '100px', borderRadius: '.28571429rem'}}>Request</Button>
                  </Grid.Column>
                  <Grid.Column>
                    <Image src={meal.picture} size='large'/>
                  </Grid.Column>
                </Grid>
            }
            </Segment>
            {this.state.loadingReq
              ? <Dimmer active>
                <Loader active inline='centered'>Sending your request...</Loader>
              </Dimmer>
              : null
            }
          </Item>
    </div>
    )
  }
};
