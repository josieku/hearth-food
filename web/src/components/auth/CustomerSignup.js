import React from "react";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

class CustomerSignup extends React.Component {
  state = {
    first: '',
    last: '',
    phone: '',
    password: '',
    email: '',
    repeat: '',
  };

  componentDidMount(){ this.props.notLand() }

  signup = (event) => {
    event.preventDefault()
    fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        firstName: this.state.first,
        lastName: this.state.last,
        password: this.state.password,
        phone: this.state.phone,
        repeat: this.state.repeat,
        email: this.state.email,
      }),
    })
    .then((resp)=>{
      if(resp.status===200){
        console.log("passed!")
      }
      else{
        throw "The sign up did not work, please try again."
      }
    })
    this.setState({
      first: '',
      last: '',
      phone: '',
      password: '',
      email: '',
      repeat: '',
    })
    this.props.history.push('/auth/login')
  }

  render() {
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
              {/* <Image src='/logo.png' /> */}
               Register to get your meals from one of our chefs!
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input fluid type="name" icon='user' iconPosition='left' placeholder='First Name' onChange={(e)=>this.setState({ first: e.target.value })}/>
                <Form.Input fluid type="name" icon='user' iconPosition='left' placeholder='Last Name' onChange={(e)=>this.setState({ last: e.target.value })}/>
                <Form.Input fluid type="number" icon='mobile' iconPosition='left' placeholder='Phone Number' onChange={(e)=>this.setState({ phone: e.target.value })}/>
                <Form.Input fluid type="email" icon='envelope' iconPosition='left' placeholder='E-mail address' onChange={(e)=>this.setState({ email: e.target.value })}/>
                <Form.Input fluid type="password" icon='key' iconPosition='left' placeholder='Password' onChange={(e)=>this.setState({ password: e.target.value })}/>
                <Form.Input fluid type="password" icon='key' iconPosition='left' placeholder='Confirm Password' onChange={(e)=>this.setState({ repeat: e.target.value })} />
                <Form.Input fluid type="file" icon='file' iconPosition='left' placeholder='Driver"s license' />
                <Button id="loginButton" fluid size='large' onClick={this.signup}>
                  Sign Up
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
export default CustomerSignup;
