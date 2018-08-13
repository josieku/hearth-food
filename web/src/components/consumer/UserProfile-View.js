import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Grid, Header, Image, Segment} from 'semantic-ui-react';
import NavBar from './../general/NavBar'

function ToReviewListing(item){
  return(
    <div>

    </div>
  )
}

export default class ProfileView extends Component{
  state = {
    toReview: [],
    mostOrdered: {},
  }

  componentDidMount = () => {
    fetch(`/user/${this.props.user._id}/toreview`)
      .then(resp => resp.json())
      .then(toReview => this.setState({ toReview }))

    fetch(`/user/${this.props.user._id}/mostordered`)
      .then(resp => resp.json())
      .then(mostOrdered => this.setState({ mostOrdered }))
  }


  render(){
    const profile = this.props.profile;
    const self = this.props.user;
    const preferences = profile.preferences ? profile.preferences : [];
    return(
      <div>
        <Grid columns={2}>
          <Grid.Column width={4}>
            <div id='profileDetails'>
            <Image src={profile.picture} height="150px" width="150px" circular centered/>
            <p>Current Rating: {profile.rating}</p>
            {profile.verified ? <p>Verified</p> : null }
            <h2>{profile.firstName}</h2>
            <p>Preferences:
              {preferences.length < 1
                ? " None"
                : <ul>{preferences.map((pref, ind) => <li key={ind}>{pref}</li>)}</ul> }
              </p>
              {self._id === profile._id
                ? <Link to={`/user/${self._id}/edit`}><button>Edit Profile</button></Link>
                : null
              }
            </div>
            </Grid.Column>
            <Grid.Column width={12}>
              {Object.keys(this.state.mostOrdered).length > 0
                ? <Grid.Row>
                    <Header as='h3' floated='left'>Most Ordered Food:</Header>
                    <br/>
                  </Grid.Row>
                : null
              }
              <Grid.Row>
                  <Header as='h3' floated='left'>Favorite Chef:</Header>
                  <p>Implemented later </p>
              </Grid.Row>
              {this.state.toReview.length > 0
                ? <Grid.Row style={{border: '2px solid blue'}}>
                    <Header as='h3'> Review your recent meals </Header>
                    {this.state.toReview.map(ToReviewListing)}
                  </Grid.Row>
                : null
              }
              <Grid.Row style={{border: '2px solid red'}}>
                <Header as='h3'>Share your meals with friends!</Header>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </div>
      )
    }
  };
