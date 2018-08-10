import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Container, Dropdown, Menu } from 'semantic-ui-react';
import './../../../public/index.css'

export default class NavBar extends Component {
  state = {
    activeItem: 'Dashboard',
  }

  logout = () => {
    this.props.logout();
  }

  nav = (role, id) => {
    const { activeItem } = this.state
    if (role === "consumer") {
      return (
        <div>
          <Menu text>
          <h2>hearth-EAT</h2>
          <Menu.Menu text id='navBar' position='right'>
                <Menu.Item name='Dashboard' href='/dashboard' active={ activeItem === 'Dashboard'}  onClick={()=>{this.setState({activeItem: 'Dashboard'})}}/>
                <Menu.Item name='Orders' href='/dashboard/orders' active={ activeItem === 'Orders'}  onClick={()=>{this.setState({activeItem: 'Orders'})}}/>
                <Menu.Item name='Messages' href='/messages' active={ activeItem === 'Messages'}  onClick={()=>{this.setState({activeItem: 'Messages'})}}/>
                <Menu.Item>
              <Dropdown icon={'user'}>
                <Dropdown.Menu>
                  <Dropdown.Item><Link to={`/user/${id}`}>Profile</Link></Dropdown.Item>
                <Dropdown.Item><Link to='/auth/logout'>Logout</Link></Dropdown.Item>
                <Dropdown.Item></Dropdown.Item>
              </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu.Menu>
          </Menu>
        </div>
      )
    } else if (role === "chef") {
      return (
        <div>
          <Menu text>
            <h2> hearth-EAT </h2>
          <Menu.Menu  id='navBar' position='right'>
                <Menu.Item name='Dashboard' href='/dashboard' active={ activeItem === 'dashboard'}  onClick={this.handleClick}/>
                <Menu.Item name='Menu' href='/dashboard/menu' active={ activeItem === 'consumer'}  onClick={this.handleClick}/>
                <Menu.Item name='History' href='/dashboard/history' active={ activeItem === 'history'}  onClick={this.handleClick}/>
                <Menu.Item>
              <Dropdown icon={'user'}>
                <Dropdown.Menu>
                <Dropdown.Item><Link to={`/user/${id}`}>Profile</Link></Dropdown.Item>
                <Dropdown.Item><Link to='/auth/logout'>Logout</Link></Dropdown.Item>
                <Dropdown.Item></Dropdown.Item>
              </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu.Menu>
          </Menu>
        </div>
      )
    } else {
      return (
        <div>
          <Menu text id='navBar'>
            <Container>
              <Link to='/'>
                <Menu.Item name='About' active={ activeItem === 'about'}  onClick={this.handleClick}/>
              </Link>
              <Link to='/'>
                <Menu.Item name='Become a Chef' active={ activeItem === 'becomeChef'}  onClick={this.handleClick}/>
              </Link>
              <Link to='/auth/signup'>
                <Menu.Item name='Sign up' active={ activeItem === 'signup'}  onClick={this.handleClick}/>
              </Link>
              <Link to='/auth/login'>
                <Menu.Item name='Log In' active={ activeItem === 'logIn'}  onClick={this.handleClick}/>
              </Link>
            </Container>
          </Menu>
        </div>
      )
    }
  }
  render(){
    console.log(this.state.activeItem);
    return (
      <div className="flex-container">
          {this.props.user === null ? this.nav(null, null) : this.nav(this.props.user.role, this.props.user._id)}
      </div>
    )
  }
}
