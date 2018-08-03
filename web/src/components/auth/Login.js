import React from "react";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Link } from "react-router-dom"

export default class Login extends React.Component {
  state = {
    password: '',
    email: '',
  };
  componentDidMount(){
    this.props.notLand();
  };
  login = (event) => {
    event.preventDefault()
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
        console.log("passed!")
        const user = await Promise.resolve(resp.json());
        this.props.login(user);
        this.props.history.push('/')
      }
      else{
        throw "Login failed, please try again."
      }
    })
    this.setState({
      password: '',
      email: '',
    })
  }


  render() {
    return(
      <div className='login-form'>
  {/*
    Heads up! The styles below are necessary for the correct render of this example.
    You can do same with CSS, the main idea is that all the elements up to the `Grid`
    below must have a height of 100%.
  */}
  <style>{`
    body > div,
    body > div > div,
    body > div > div > div.login-form {
      height: 100%;
    }
  `}</style>
  <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' id="loginHeader" textAlign='center'>
        Log in to hearth{/* <Image src='/logo.png' /> Log-in to your account */}
      </Header>
      <Form size='large' id="loginForm">
        <Segment stacked>
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
          <Button onClick={this.login} id="loginButton" fluid size='large'>
            Login
          </Button>
        </Segment>
      </Form>
      <Message id="loginMessage">
        New to us? <Link to='/auth/signup'>Sign Up</Link>
      </Message>
    </Grid.Column>
  </Grid>
      {/* <div>
        <Container id="loginContainer">
          <h1 style={{textAlign: 'center'}}>Login to find meals near you!</h1>
          <Segment style={{marginLeft:'20%', marginRight: '20%', borderRadius: '15px', backgroundColor:'#FA8334'}}>
            <Form onSubmit={(event) => this.signup(event)}>
              <label style={{ padding: '10px'}}>Email:</label>
                  <Input type="email" name="email" placeholder="Email" onChange={e => this.setState({email: e.target.value})}/>
                  <br/>
              <label style={{padding: '10px'}}>Password:</label>
                  <Input type="text" name="password" placeholder="Password" onChange={e => this.setState({password: e.target.value})}/>
                <br/>
              <Button onClick={this.login} type="submit" value="Submit" content='Submit' style={{margin: '10px'}}/>
            </Form>
          </Segment>
        </Container>
      </div> */}
    </div>
    )
  }
}
