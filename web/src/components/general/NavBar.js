import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Dropdown, Header, Menu, Segment, Image, Icon, Transition } from 'semantic-ui-react';
import './../../../public/index.css'

function NotifCondense(item){
  return(
    <Dropdown.Item>{item.content}<span style={{color:'gray'}}>{new Date(item.time).toString}</span></Dropdown.Item>
  )
}

export default class NavBar extends Component {
  state = {
    activeItem: 'Dashboard',
  }

  logout = () => {
    this.props.logout();
  }

  nav = (role, id, stateNotifs) => {
    const { activeItem } = this.state
    const notifications = stateNotifs ? stateNotifs.filter(item=>!item.seen) : []
    const notifs = notifications.length;
    const user = this.props.user;
    const notifIcon = notifs > 0 ? "bell" : "bell outline";
    const notifWiggle = notifs > 0 ? true : false;
    if (role === "consumer") {
      return (
        <div>
          <Menu text>
          <h2>hearth-EAT</h2>
          <Menu.Menu text="true" id='navBar' position='right'>
                <Menu.Item name='Dashboard' href='/dashboard' active={ activeItem === 'Dashboard'}  onClick={()=>{this.setState({activeItem: 'Dashboard'})}}/>
                <Menu.Item name='Orders' href='/dashboard/orders' active={ activeItem === 'Orders'}  onClick={()=>{this.setState({activeItem: 'Orders'})}}/>
                <Menu.Item icon={notifIcon} href='/dashboard/notifications' active={ activeItem === 'Notificaitons'}  onClick={()=>{this.setState({activeItem: 'Notifications'})}}/>
                {/* <Transition animation="jiggle" duration="1000" visible={notifWiggle}>
                </Transition> */}
                {/* <Dropdown icon={notifIcon} floating className='icon' direction='right'>
                  <Dropdown.Menu>
                    <Dropdown.Header content='Unseen notifications' />
                    {notifications.map(NotifCondense)}
                    <Dropdown.Item>Discussion</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> */}
                {/* <Menu.Item name='Messages' href='/messages' active={ activeItem === 'Messages'}  onClick={()=>{this.setState({activeItem: 'Messages'})}}/> */}
                <Menu.Item>
                <Dropdown icon={'user'}>
                  <Dropdown.Menu>
                    <Dropdown.Item disabled>Hello, {user.firstName}</Dropdown.Item>
                    <Dropdown.Item href={`/user/${id}`}>Profile</Dropdown.Item>
                    <Dropdown.Item href={`/user/${id}/pay`}>Payment</Dropdown.Item>
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
                <Menu.Item name='Dashboard' href='/dashboard' active={ activeItem === 'Dashboard'}  onClick={()=>{this.setState({activeItem: 'Dashboard'})}}/>
                <Menu.Item name='Menu' href='/dashboard/menu' active={ activeItem === 'Consumer'}  onClick={()=>{this.setState({activeItem: 'Consumer'})}}/>
                <Menu.Item name='History' href='/dashboard/history' active={ activeItem === 'History'}  onClick={()=>{this.setState({activeItem: 'History'})}}/>
                <Menu.Item icon={notifIcon} href='/dashboard/notifications' active={ activeItem === 'Notificaitons'}  onClick={()=>{this.setState({activeItem: 'Notifications'})}}/>
                <Menu.Item>
              <Dropdown icon='user' floating className='icon'>
                <Dropdown.Menu>
                  <Dropdown.Item href={`/user/${id}`}><Icon name='user'/> Profile</Dropdown.Item>
                  <Dropdown.Item href={`/user/${id}/paycheck`}><Icon name='dollar sign'/> Paycheck</Dropdown.Item>
                  <Dropdown.Item href='/auth/logout'><Icon name='sign out'/> Logout</Dropdown.Item>
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
                <Menu.Item name='About' href='/' active={ activeItem === 'About'}  onClick={()=>{this.setState({activeItem: 'About'})}}/>
                <Menu.Item name='Become a Chef' href='/' active={ activeItem === 'BecomeChef'}  onClick={()=>{this.setState({activeItem: 'BecomeChef'})}}/>
                <Menu.Item name='Sign up' href='/auth/signup' active={ activeItem === 'Signup'}  onClick={()=>{this.setState({activeItem: 'Signup'})}}/>
                <Menu.Item name='Log In' href='/auth/login' active={ activeItem === 'LogIn'}  onClick={()=>{this.setState({activeItem: 'Login'})}}/>
              </Menu.Menu>
          </Menu>
        </div>
      )
    }
  }
  render(){
    // console.log(this.state.activeItem);
    return (
      <div className="flex-container">
          {this.props.user === null
            ? this.nav(null, null, this.props.notifications)
            : this.nav(this.props.user.role, this.props.user._id, this.props.notifications)}
      </div>
    )
  }
}
