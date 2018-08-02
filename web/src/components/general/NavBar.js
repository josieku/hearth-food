import React, { Component } from "react";
import { Link } from 'react-router-dom';
import ConsumerLanding from './../consumer/ConsumerLanding';
import ChefLanding from './../chef/ChefLanding';
import GeneralLanding from './GeneralLanding';
<<<<<<< HEAD

function nav(role, id){
  if (role === "consumer") {
    return (
      <div>
        <Link to="/request" >Request</Link>
        <Link to="/messages">Messages</Link>
        <Link to={`/user/${id}`}>Profile</Link>
      </div>
    )
  } else if (role === "chef") {
    return (
      <div>
        <Link to="/messages">Messages</Link>
        <Link to={`/chef/${id}`}>Profile</Link>
        <Link to='/'>Consumer Mode</Link>
      </div>
    )
  } else {
    return (
      <div>
        <Link to='/'>About</Link>
        <Link to='/'>Become a Chef</Link>
        <Link to='/auth/signup'>Sign up</Link>
        <Link to='/auth/login'>Log in</Link>
      </div>
    )
  }
}

export default class NavBar extends Component{
  render(){
    return (
      <div>{nav(this.props.user.role, this.props.user._id)}</div>
=======
import { Menu } from 'semantic-ui-react';
import './../../../public/index.css'
export default class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeItem: 'messages',
    }
  }
  handleItemClick = (e, { name }) => this.setState({activeItem: name});

  nav = (role, id) => {
    const { activeItem } = this.state
    if (role === "consumer") {
      return (
        <div>
          <Menu text className="navBar">
            <Link to="/request" >
              <Menu.Item name='Request' active={ activeItem === 'request'} />
            </Link>
            <Link to="/messages">
              <Menu.Item name='Messages' active={ activeItem === 'messages'} />
            </Link>
            <Link to={`/user/${id}`}>
              <Menu.Item name='Profile' active={ activeItem === 'profile'} />
            </Link>
          </Menu>
        </div>
      )
    } else if (role === "chef") {
      return (
        <div>
          <Menu text className="navBar">
            <Link to='/'>
              <Menu.Item name='Messages' active={ activeItem === 'messages'} />
            </Link>
            <Link to='/'>
              <Menu.Item name='Profile' active={ activeItem === 'profile'} />
            </Link>
            <Link to='/'>
              <Menu.Item name='Consumer Mode' active={ activeItem === 'consumer'} />
            </Link>
          </Menu>
        </div>
      )
    } else {
      return (
        <div>
          <Menu className="navBar">
            <Link to='/'>
              <Menu.Item name='About' active={ activeItem === 'about'} />
            </Link>
            <Link to='/'>
              <Menu.Item name='Become a Chef' active={ activeItem === 'becomeChef'} />
            </Link>
            <Link to='/signup'>
              <Menu.Item name='Sign up' active={ activeItem === 'signup'} />
            </Link>
            <Link to='/'>
              <Menu.Item name='Log In' active={ activeItem === 'logIn'} />
            </Link>
          </Menu>
        </div>
      )
    }
  }
  render(){

    return (
      <div className="flex-container">{this.nav(this.state.role, this.state.id)}</div>
>>>>>>> caad4676a40f23f4d113ce856e5e31b24302d21d
    )
  }
}
