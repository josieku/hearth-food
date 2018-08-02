import React from "react";
import { Input, Button } from 'semantic-ui-react'

class CustomerSignup extends React.Component {
  state = {
    first: '',
    last: '',
    phone: '',
    password: '',
    email: '',
    repeat: '',
  };

  signup = (event) => {
    event.preventDefault()
    console.log('about to fetch')
    fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // <- this is mandatory to deal with cookies
      body: JSON.stringify({
        first: this.state.first,
        last: this.state.last,
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
  }

  handleChange = (name, event) => {
    this.setState({ name });
  }

  render() {
    return(
      <div>
        <h1>Register to get your meals cooked from one of our chefs!</h1>
        <form onSubmit={(event) => this.signup(event)}>
          <label>First Name:
              <Input type="text" name="first" placeholder="Please enter your full name" onChange={e => this.setState({first: e.target.value})}/>
          </label>
          <label>Last Name:
              <Input type="text" name="last" placeholder="Please enter your full name" onChange={e => this.setState({last: e.target.value})}/>
          </label>
          <label>Phone Number:
              <Input type="number" name="phone" placeholder="Phone Number" onChange={e => this.setState({phone: e.target.value})}/>
          </label>
          <label>Email:
              <Input type="email" name="email" placeholder="Email" onChange={e => this.setState({email: e.target.value})}/>
          </label>
          <label>Password:
              <Input type="text" name="password" placeholder="Password" onChange={e => this.setState({password: e.target.value})}/>
          </label>
          <label>Repeat your password:
              <Input type="text" name="repeat" placeholder="Run it back" onChange={e => this.setState({repeat: e.target.value})}/>
          </label>
          <label>Picture of driver's license:
            <input type="file" />
          </label>
          <Button onClick={this.signup} type="submit" value="Submit" content='Submit'/>
        </form>
      </div>
    )
  }
}
export default CustomerSignup;
