import React, { Component } from "react";
import { Link } from 'react-router-dom';
// import ConsumerLanding from './../consumer/ConsumerLanding';
// import ChefLanding from './../chef/ChefLanding';
// import GeneralLanding from './GeneralLanding';
import { Menu, Container } from 'semantic-ui-react';
import './../../../public/index.css'
export default class NavBar extends Component {
  state = {
    activeItem: 'messages',
  }

  handleItemClick = (e, { name }) => this.setState({activeItem: name});

  logout = () => {
    this.props.logout();
  }

  nav = (role, id) => {
    const { activeItem } = this.state
    if (role === "consumer") {
      return (
        <div style={{ marginLeft: '1em'}}>
          <Menu text id='navBar'>
            <Container>
              <Link to="/request" >
                <Menu.Item name='Request' active={ activeItem === 'request'} />
              </Link>
              <Link to="/messages">
                <Menu.Item name='Messages' active={ activeItem === 'messages'} />
              </Link>
              <Link to={`/user/${id}`}>
                <Menu.Item name='Profile' active={ activeItem === 'profile'} />
              </Link>
              <Link to='/auth/logout' innerRef={this.logout}>
                <Menu.Item name='Logout' active={ activeItem === 'logout'}/>
              </Link>
            </Container>
          </Menu>
        </div>
      )
    } else if (role === "chef") {
      return (
        <div>
          <Menu text id='navBar'>
            <Container>
              <Link to='/dashboard'>
                <Menu.Item name='Messages' active={ activeItem === 'messages'} />
              </Link>
              <Link to={`/dashboard/${id}`}>
                <Menu.Item name='Profile' active={ activeItem === 'profile'} />
              </Link>
              <Link to='/dashboard/menu'>
                <Menu.Item name='Menu' active={ activeItem === 'consumer'} />
              </Link>
              <Link to='/auth/logout' innerRef={this.logout}>
                <Menu.Item name='Logout'/>
              </Link>
            </Container>
          </Menu>
        </div>
      )
    } else {
      return (
        <div>
          <Menu text id='navBar'>
            <Container>
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
          </Menu>
        </div>
      )
    }
  }
  render(){
    return (
      <div className="flex-container">
          {this.props.user === null ? null : this.nav(this.props.user.role, this.props.user._id)}
      </div>
    )
  }
}
