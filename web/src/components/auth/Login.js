import React from "react";
import { Button, Form, Grid, Header, Image, Message, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { Link } from "react-router-dom"

import NavBar from './../general/NavBar';

export default class Login extends React.Component {
  state = {
    password: '',
    email: '',
    loading: false,
    error: false,
    errorMsg: "",
  };
  componentDidMount(){
    this.props.notLand();
  };
  login = (event) => {
    event.preventDefault()
    this.setState({ loading: true })
    console.log('about to login')
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({
        password: this.state.password,
        username: this.state.email,
      }),
    })
    .then(async (resp)=>{
      if(resp.status===200){
        const user = await Promise.resolve(resp.json());
        console.log("passed!", user);
        this.props.login(user);
        this.props.history.push({pathname: '/dashboard', state: {user: user}});
        this.setState({
          password: '',
          email: '',
          loading: false,
        })
      }
      else{
        this.setState({
          loading: false,
          error: true,
          errorMsg: "Login failed, please try again."
        })
      }
    })
  }


  render() {
    return(
      <div className='main'>
        <NavBar user={null}/>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' id="loginHeader" textAlign='center'>
              Log in to hearth{/* <Image src='/logo.png' /> Log-in to your account */}
            </Header>
            <Form size='large' id="loginForm">
              <Segment raised>
                <Form.Input
                  fluid icon='user'
                  iconPosition='left'
                  placeholder='E-mail address'
                  type='email'
                  onChange={e => this.setState({email: e.target.value})}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onChange={e => this.setState({password: e.target.value})}
                />
                <Button onClick={this.login} id="loginButton" style={{width:'40%'}}>
                  Login
                </Button>
              </Segment>
            </Form>
            {this.state.error
              ? <Message negative><p>{this.state.errorMsg}</p></Message>
              : null
            }
            {this.state.loading
              ? <Loader active/> 
              : null }
            <Message id="loginMessage">
              New to us? <Link to='/auth/signup'>Sign Up</Link>
            </Message>
          </Grid.Column>
        </Grid>
    </div>
    )
  }
}
