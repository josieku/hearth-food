import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Divider, Dropdown, Header, Menu, Segment, Image, Icon, Transition } from 'semantic-ui-react';
import { pulse } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import './../../../public/index.css'

const styles = {
  pulse: {
    animation: '20s',
    animationName: Radium.keyframes(pulse, 'pulse')
  }
}

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

  notifAnimation = () => {
    console.log("animation")
    return setInterval(this.wiggle, 10000);
  }

  wiggle = () => {
    return (
      <Transition animation="jiggle" duration="5000">
         <Menu.Item icon="bell" href='/dashboard/notifications' onClick={()=>{this.setState({activeItem: 'Notifications'})}}/>
      </Transition>
    )
  }

  notifIcon = (stateNotifs) => {
    const notifications = stateNotifs ? stateNotifs.filter(item=>!item.seen) : []
    const notifs = notifications.length;
    const notifIcon = notifs > 0 ? "bell" : "bell outline";
    const notifWiggle = notifs > 0 ? true : false;
    if (notifWiggle) return (
      <Transition animation="jiggle" duration="5000">
       <Menu.Item icon="bell" href='/dashboard/notifications' onClick={()=>{this.setState({activeItem: 'Notifications'})}}/>
      </Transition>)
    else return (
      <Menu.Item icon={notifIcon} href='/dashboard/notifications'
      onClick={()=>{this.setState({activeItem: 'Notifications'})}}/>
    )
  }

  nav = (role, id, stateNotifs) => {
    const { activeItem } = this.state
    const user = this.props.user;
    const notifications = stateNotifs ? stateNotifs.filter(item=>!item.seen) : []
    const notifs = notifications.length;
    const notifWiggle = notifs > 0 ? true : false;
    if (role === "consumer") {
      return (
        <div>
          <Menu text style={{marginTop: '0px', paddingTop: '10px'}}>
            <Menu.Menu id="navBar" position="left">
              <Menu.Header as='h2'>hearth-EAT</Menu.Header>
            </Menu.Menu>
            <Menu.Menu text="true" id='navBar' position='right'>
                  <Menu.Item style={{padding: ''}} name='Dashboard' href='/dashboard' active={ activeItem === 'Dashboard'}  onClick={()=>{this.setState({activeItem: 'Dashboard'})}}/>
                  <Menu.Item name='Orders' href='/dashboard/orders' active={ activeItem === 'Orders'}  onClick={()=>{this.setState({activeItem: 'Orders'})}}/>
                  {notifWiggle
                    ? <Transition animation="jiggle" duration="3000" visible={notifWiggle}>
                        <Menu.Item icon="bell" href='/dashboard/notifications' active={ activeItem === 'Notificaitons'}  onClick={()=>{this.setState({activeItem: 'Notifications'})}}/>
                      </Transition>
                    : <Menu.Item icon="bell outline" href='/dashboard/notifications' active={ activeItem === 'Notificaitons'}  onClick={()=>{this.setState({activeItem: 'Notifications'})}}/>
                  }
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
          <Menu text style={{marginTop: '0px', paddingTop: '10px'}}>
            <Menu.Menu id="navBar" position="left">
              <Menu.Header as='h2'>hearth-COOK</Menu.Header>
            </Menu.Menu>
          <Menu.Menu  id='navBar' position='right'>
                <Menu.Item name='Dashboard' href='/dashboard' active={ activeItem === 'Dashboard'}  onClick={()=>{this.setState({activeItem: 'Dashboard'})}}/>
                <Menu.Item name='Menu' href='/dashboard/menu' active={ activeItem === 'Consumer'}  onClick={()=>{this.setState({activeItem: 'Consumer'})}}/>
                <Menu.Item name='History' href='/dashboard/history' active={ activeItem === 'History'}  onClick={()=>{this.setState({activeItem: 'History'})}}/>
                {notifWiggle
                  ? <Transition animation="jiggle" duration="3000" visible={notifWiggle}>
                      <Menu.Item icon="bell" href='/dashboard/notifications' active={ activeItem === 'Notificaitons'}  onClick={()=>{this.setState({activeItem: 'Notifications'})}}/>
                    </Transition>
                  : <Menu.Item icon="bell outline" href='/dashboard/notifications' active={ activeItem === 'Notificaitons'}  onClick={()=>{this.setState({activeItem: 'Notifications'})}}/>
                }
                <Menu.Item>
              <Dropdown icon='user' floating className='icon'>
                <Dropdown.Menu>
                  <Dropdown.Item disabled>Hello, {user.firstName}</Dropdown.Item>
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
          <Menu text style={{marginTop: '0px', paddingTop: '10px'}}>
          <Menu.Menu id="navBar" position="left">
            <Menu.Header as='h2'>hearth</Menu.Header>
          </Menu.Menu>
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
