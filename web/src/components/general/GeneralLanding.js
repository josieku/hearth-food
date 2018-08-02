import React, { Component } from "react";
import { Image, Grid } from 'semantic-ui-react';

export default class GeneralLanding extends Component{
  render(){
    return(
      <div >
        <h2>Welcome to Hearth!</h2>
          <Grid className="ui two column stackable grid container">
            <Grid.Column className="column ui segment">
                Image will go here at some point
            </Grid.Column>
            <Grid.Column className="column">
              <p>Details about the service next to a random stock photo</p>
            </Grid.Column>
            <Grid.Column>
              <p>Details about the vetting process for chefs to go through</p>
            </Grid.Column>
            <Grid.Column className="column ui segment">
              <Image src='./../../../public/images/Hearth_pan.svg' size='large' />
            </Grid.Column>
            <Grid.Column className="column ui segment">
              <p>Image again</p>
            </Grid.Column>
            <Grid.Column className="column">
              <p>Benefits the service will give to the user and chef</p>
          </Grid.Column>

      </Grid>
    </div>
    )
  }
};
