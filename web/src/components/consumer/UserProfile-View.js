import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Grid, Header, Image, Segment} from 'semantic-ui-react';
import NavBar from './../general/NavBar'

export default class ProfileView extends Component{
  render(){
    const profile = this.props.profile;
    const self = this.props.user;
    const preferences = profile.preferences ? profile.preferences : []
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
              <Grid.Row>
                  <Header as='h3' floated='left'>Most Ordered Food:</Header>
                  <p>Implemented later</p>
                  <br/>
              </Grid.Row>
              <Grid.Row>
                  <Header as='h3' floated='left'>Favorite Chef:</Header>
                  <p>Implemented later </p>
              </Grid.Row>
              <Grid.Row style={{border: '2px solid blue'}}>
                <Header as='h3'> Review your recent meals </Header>
              </Grid.Row>
              <Grid.Row style={{border: '2px solid red'}}>
                <Header as='h3'>Share your meals with friends!</Header>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </div>
      )
    }
  };
