import React, { Component } from "react";
import { Button, Form, Grid, Header, Image, Item, Menu, Message, Segment, Loader, Modal, Divider, Input } from 'semantic-ui-react';
import { DatePicker, TimePicker } from "@blueprintjs/datetime";
import AddTime from './MealProfile-AddTime';
import moment from 'moment';

class TimeSlot extends Component {
  edit = e => {
    e.preventDefault();
    this.props.edit(this.props.date, this.props.start, this.props.end,
      this.props.ind, this.props.availableId);
    }

    delete = e => {
      e.preventDefault();
      this.props.delete(this.props.ind, this.props.availableId)
    }

    renderHours = () => {
      const start = moment(this.props.start, "HH:mm");
      const end = moment(this.props.end, "HH:mm");
      const minutes = end.diff(start, 'minutes');
      return ("Serving duration: " + minutes + " minutes");
    }

    render(){
      const today = new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()
      return(
        <div>
          <Segment piled>
            {new Date(this.props.date).toDateString()}: {this.props.start} to {this.props.end}, {this.renderHours()}
            <Button id='redButton' size='tiny' onClick={this.edit}>Edit</Button>
            <Button id='redButton' size='tiny' onClick={this.delete}>Delete</Button>
          </Segment>
        </div>
      )
    }

  }

export default class SetAvailability extends Component {
  state = {
    available: [],
    date: null,
    start: null,
    end: null,
    availableId: null,
    ind: null,
    add: false,
    openAdd: false,
  }

  componentDidMount = () => {
    fetch(`/meal/${this.props.mealId}/available`)
    .then(resp => resp.json())
    .then(list => {
      const available = list.filter(item => item.time > Date.now())
      this.setState({ available })
    })
  }

  addTime = () => {
    this.setState({ add: !this.state.add })
  }

  cancel = () => {
    this.setState({ openAdd: false })
  }

  commit = () => {
    console.log(this.state.available);
    this.props.set(this.state.available);
    this.props.history.push(`/meal/${this.props.meal._id}`);
  }

  delete = (ind, availableId) => {
    fetch(`/meal/${this.props.mealId}/setavailable`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ availableId })
    })
    .then(e => {
      const available = this.state.available.slice();
      available.splice(ind, 1);
      this.setState({ available });
    })
  }

  edit = (date, start, end, ind, availableId) => {
    console.log('edit', date, start, end, ind, availableId)
    this.setState({ date, start, end, ind, availableId, openAdd: true })
  }

  save = (ind, timeObj) => {
    const available = this.state.available.slice();
    if (ind !== null){
      available.splice(ind, 1, timeObj);
    } else{
      available.push(timeObj);
    }
    this.setState({
      available,
      date: null,
      start: null,
      end: null,
      availableId: null,
      ind: null,
      add: false,
      openAdd: false,
    })
  }

  render() {
    const meal = this.props.meal;

    const headerStyle = {
      marginBottom: '4px',
      backgroundColor: '#D6D4D4',
      padding: '10px',
      borderRadius: '5px'
    }

    return(
      <div>
        {this.props.loading
          ? <Loader active inline='centered'>Be happy with hearth!</Loader>
          : <div>
            <Menu text id="header">
              <Menu.Item header>Set pickup times for {meal.title}</Menu.Item>
              <Menu.Menu position='right' style={{padding: '3px', marginLeft: '5px'}}>
                {/* <Input id='searchInHeader' icon='search' placeholder='Search...' onChange={(e)=>this.props.search(e.target.value)}/> */}
                <Button onClick={()=>this.setState({openAdd: true})}>Add Time Slot</Button>
              </Menu.Menu>
            </Menu>

            <AddTime date={this.state.date} start={this.state.start}
              end={this.state.end} open={this.state.openAdd}
              availableId={this.state.availableId}
              mealId={meal._id} chefId={meal.chef._id}
              ind={this.state.ind} cancel={this.cancel} save={this.save}
            />

            <Header as='h4' style={{marginBottom: '8px', marginTop: '3px'}}>
              Time Slots  </Header>
              <Divider/>
              {this.state.available.length > 0
                ? this.state.available
                .sort((a,b)=>new Date(a.date)-new Date(b.date))
                .map((obj, ind) =>
                <TimeSlot key={ind} ind={ind} date={obj.date} start={obj.start}
                  end={obj.end} availableId={obj._id}
                  edit={this.edit} delete={this.delete}/>)
                  : <p>No time slots, click 'Add Time Slot' to offer your meal!</p>
                }
                <Button id='redButton' style={{marginTop:"10px"}} onClick={this.commit}>
                  Finish
                </Button>
              </div>
            }
          </div>
        )
      }
    }
