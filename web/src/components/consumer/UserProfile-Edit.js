import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

import NavBar from './../general/NavBar'

export default class ProfileEdit extends Component{
  state = {
    first: this.props.profile.firstName,
    last: this.props.profile.lastName,
    phone: this.props.profile.phone,
    password: this.props.profile.password,
    email: this.props.profile.email,
    file: this.props.profile.picture
  }

  componentDidMount = () => {
    if (Object.keys(this.props.profile).length === 0 ) {
      fetch(`/user/${this.props.id}`)
      .then(resp => resp.json())
      .then(profile => this.setState({
        first: profile.firstName,
        last: profile.lastName,
        phone: profile.phone,
        password: profile.password,
        email: profile.email,
        file: profile.picture
      }))
    }
  }

  handleFile = (e) => {
    var _this = this
    console.log(e.target.value)
    var fReader = new FileReader();
    fReader.readAsDataURL(e.target.files[0]);
    fReader.onloadend = function(event){
        console.log(event.target.result);
        _this.setState({
          file: event.target.result
        })
    }
  }

  edit = () => {
    this.props.edit(this.state.first, this.state.last, this.state.password,
                    this.state.email, this.state.phone, this.state.file)
  };

  cancel = () => {
    this.props.history.push(`/user/${this.props.profile._id}`);
  }

  render(){
    const profile = this.props.profile;
    const preferences = profile.preferences ? profile.preferences : [];
    return(
      <div className='login-form'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' textAlign='center'>
               Edit your information
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input fluid type="name" icon='user'
                  iconPosition='left' placeholder='First Name'
                  value={this.state.first}
                  onChange={(e)=>this.setState({ first: e.target.value })}/>

                <Form.Input fluid type="name" icon='user'
                  iconPosition='left' placeholder='Last Name'
                  value={this.state.last}
                  onChange={(e)=>this.setState({ last: e.target.value })}/>

                <Form.Input fluid type="number" icon='mobile'
                  iconPosition='left' placeholder='Phone Number'
                  value={this.state.phone}
                  onChange={(e)=>this.setState({ phone: e.target.value })}/>

                <Form.Input fluid type="email" icon='envelope'
                  iconPosition='left' placeholder='E-mail address'
                  value={this.state.email}
                  onChange={(e)=>this.setState({ email: e.target.value })}/>

                <Form.Input fluid type="password" icon='key'
                  iconPosition='left' placeholder='Password'
                  value={this.state.password}
                  onChange={(e)=>this.setState({ password: e.target.value })}/>

                <Form.Field>
                  <label>Profile Picture</label>
                  <Image src={this.state.file} />
                </Form.Field>

                <Form.Input fluid type="file" icon='camera retro'
                  iconPosition='left' onChange={(e)=>{this.handleFile(e)}}/>

                <Button id="loginButton" fluid size='large' onClick={this.edit}>
                  Save edits
                </Button>
                <Button onClick={this.cancel}>Cancel</Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
};
