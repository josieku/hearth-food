import React from "react";
import { Input, Button } from 'semantic-ui-react'

export default class Login extends React.Component {
  state = {
    password: '',
    email: '',
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
      <div>
        <h1>Login!</h1>
        <form onSubmit={(event) => this.signup(event)}>
          <label>Email:
              <Input type="email" name="email" placeholder="Email" onChange={e => this.setState({email: e.target.value})}/>
          </label>
          <label>Password:
              <Input type="text" name="password" placeholder="Password" onChange={e => this.setState({password: e.target.value})}/>
          </label>
          <Button onClick={this.login} type="submit" value="Submit" content='Submit'/>
        </form>
      </div>
    )
  }
}
