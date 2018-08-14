import React from "react";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

export default class Add extends React.Component {
  state = {
    title: "",
    description: "",
    ingredients: "",
    price: 0,
    cuisine: "",
    picture: null,
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

  save = e => {
    // console.log('saving', this.state);
    this.props.save(this.state.title,
      this.state.description,
      this.state.ingredients,
      parseInt(this.state.price),
      this.state.cuisine);
      this.setState({
        title: "",
        description: "",
        ingredients: "",
        price:0,
        cuisine: ""
      })
    }

    cancel = e =>{
      console.log('cancelling');
      this.setState({
        title: "",
        description: "",
        ingredients: "",
        price:0,
        cuisine: ""
      })
      this.props.history.push('/dashboard/menu')
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
                  Add a dish
                </Header>
                <Form size='large'>
                  <Segment raised textAlign='left'>
                    <Form.Input label="Dish Title" icon='window maximize' iconPosition='left' placeholder='Title' onChange={(e)=>this.setState({ title: e.target.value })} required/>
                    <Form.TextArea label="Description" placeholder='Write a description of the dish ...' onChange={(e)=>this.setState({ description: e.target.value })} required/>
                    <Form.Input fluid label="Price per dish" type="number" icon='dollar sign' iconPosition='left' placeholder='Price' onChange={(e)=>this.setState({ price: e.target.value })} required/>
                    <Form.TextArea label="Ingredients" placeholder='List out the ingredients in the dish ...' onChange={(e)=>this.setState({ ingredients: e.target.value })} required/>
                    <Form.Input fluid label="Cuisine" type="name" icon='key' iconPosition='left' placeholder='Cuisine' onChange={(e)=>this.setState({ cuisine: e.target.value })} required/>
                    {/* <Form.Input fluid type="password" icon='key' iconPosition='left' placeholder='Confirm Password' onChange={(e)=>this.setState({ repeat: e.target.value })}  required/> */}
                    <Form.Input fluid label="Dish Picture" type="file" icon='camera retro' iconPosition='left' placeholder='Picture' onChange={(e)=>{this.handleFile(e)}} required/>
                    <Image src={this.state.file}  required/>
                    <div id="addDishButtons">
                      <Button id="loginButton" size='large' onClick={this.save}> Save </Button>
                      <Button id="loginButton" size='large' style={{backgroundColor: '#d6d4d4'}} onClick={this.cancel}> Cancel </Button>
                    </div>
                  </Segment>
                </Form>
              </Grid.Column>
            </Grid>
          </div>
        )
      }
    }
