import React from "react";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

class CustomerSignup extends React.Component {
  state = {
    title: "",
    description: "",
    ingredients: "",
    price: 0,
    cuisine: "",
    picture: null,
  }

  // componentDidMount(){ this.props.notLand() }

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

  signup = (event) => {
    event.preventDefault()
    console.log(this.state.file)
    fetch('/:id/menu/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        title: this.state.title,
        description: this.state.description,
        ingredients: this.state.ingredients,
        cuisine: this.state.cuisine,
        price: this.state.price,
        picture: this.state.picture
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
      title: '',
      description: '',
      ingredients: '',
      cuisine: '',
      price: '',
      picture: '',
    })
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
              <Image src={this.state.file} />
               Register to get your meals from one of our chefs!

            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input fluid type="name" icon='window maximize' iconPosition='left' placeholder='Title' onChange={(e)=>this.setState({ title: e.target.value })}/>
                <Form.Input fluid type="textarea" icon='align justify' iconPosition='left' placeholder='Description' onChange={(e)=>this.setState({ description: e.target.value })}/>
                <Form.Input fluid type="number" icon='dollar sign' iconPosition='left' placeholder='Price' onChange={(e)=>this.setState({ price: e.target.value })}/>
                <Form.Input fluid type="textarea" icon='list alternate' iconPosition='left' placeholder='Ingredients' onChange={(e)=>this.setState({ ingredients: e.target.value })}/>
                <Form.Input fluid type="name" icon='key' iconPosition='left' placeholder='Cuisine' onChange={(e)=>this.setState({ cuisine: e.target.value })}/>
                <Form.Input fluid type="password" icon='key' iconPosition='left' placeholder='Confirm Password' onChange={(e)=>this.setState({ repeat: e.target.value })} />
                <Form.Input fluid type="file" icon='camera retro' iconPosition='left' placeholder='Picture' onChange={(e)=>{this.handleFile(e)}}/>
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
