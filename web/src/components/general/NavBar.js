import React, { Component } from "react";
import { Link } from 'react-router-dom';
import ConsumerLanding from './../consumer/ConsumerLanding';
import ChefLanding from './../chef/ChefLanding';
import GeneralLanding from './GeneralLanding';
import { Menu, Container } from 'semantic-ui-react';
import './../../../public/index.css'
export default class NavBar extends Component {
  state = {
    activeItem: 'messages',
  }

  handleItemClick = (e, { name }) => this.setState({activeItem: name});

  nav = (role, id) => {
    const { activeItem } = this.state
    if (role === "consumer") {
      return (
        <div style={{ marginLeft: '1em'}}>
          <Container text className="navBar">
            <Link to="/request" >
              <Menu.Item name='Request' active={ activeItem === 'request'} />
            </Link>
            <Link to="/messages">
              <Menu.Item name='Messages' active={ activeItem === 'messages'} />
            </Link>
            <Link to={`/user/${id}`}>
              <Menu.Item name='Profile' active={ activeItem === 'profile'} />
            </Link>
          </Container>
        </div>
      )
    } else if (role === "chef") {
      return (
        <div>
          <Container text className="navBar">
            <Link to='/'>
              <Menu.Item name='Messages' active={ activeItem === 'messages'} />
            </Link>
            <Link to={`/chef/${id}`}>
              <Menu.Item name='Profile' active={ activeItem === 'profile'} />
            </Link>
            <Link to='/'>
              <Menu.Item name='Consumer Mode' active={ activeItem === 'consumer'} />
            </Link>
          </Container>
        </div>
      )
    } else {
      return (
        <div>
          <Container text inverted className="navBar">
            <Link to='/'>
              <Menu.Item name='About' active={ activeItem === 'about'} />
            </Link>
            <Link to='/'>
              <Menu.Item name='Become a Chef' active={ activeItem === 'becomeChef'} />
            </Link>
            <Link to='/auth/signup'>
              <Menu.Item name='Sign up' active={ activeItem === 'signup'} />
            </Link>
            <Link to='/auth/login'>
              <Menu.Item name='Log In' active={ activeItem === 'logIn'} />
            </Link>
          </Container>
        </div>
      )
    }
  }
  render(){
    const { fixed } = this.state
    return (
      <div className="flex-container">
        <Menu
          fixed={fixed ? 'top' : null}
          inverted={!fixed}
          pointing={!fixed}
          secondary={!fixed}
          size='large'>
          {this.nav(this.state.role, this.state.id)}
        </Menu>
      </div>
    )
  }
}
