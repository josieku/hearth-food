import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Dropdown, Header, Menu } from 'semantic-ui-react';
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
                  <Dropdown.Item href={`/user/${id}`}>Profile</Dropdown.Item>
                  <Dropdown.Item href='/auth/logout'>Logout</Dropdown.Item>
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
            <h2> hearth-COOK </h2>
          <Menu.Menu  id='navBar' position='right'>
                <Menu.Item name='Dashboard' href='/dashboard' active={ activeItem === 'dashboard'}  onClick={this.handleClick}/>
                <Menu.Item name='Menu' href='/dashboard/menu' active={ activeItem === 'consumer'}  onClick={this.handleClick}/>
                <Menu.Item name='History' href='/dashboard/history' active={ activeItem === 'history'}  onClick={this.handleClick}/>
                <Menu.Item>
              <Dropdown icon='user' floating className='icon'>
                <Dropdown.Menu>
                <Dropdown.Item href={`/user/${id}`}>Profile</Dropdown.Item>
                <Dropdown.Item href='/auth/logout'>Logout</Dropdown.Item>
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
          <Menu text>
            <Header as='h2'>hearth</Header>
          <Menu.Menu id='navBar' position='right'>
                <Menu.Item name='About' href='/' active={ activeItem === 'about'}  onClick={this.handleClick}/>
                <Menu.Item name='Become a Chef' href='/' active={ activeItem === 'becomeChef'}  onClick={this.handleClick}/>
                <Menu.Item name='Sign up' href='/auth/signup' active={ activeItem === 'signup'}  onClick={this.handleClick}/>
                <Menu.Item name='Log In' href='/auth/login' active={ activeItem === 'logIn'}  onClick={this.handleClick}/>
              </Menu.Menu>
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
