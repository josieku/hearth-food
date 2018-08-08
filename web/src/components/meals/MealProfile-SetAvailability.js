import React, { Component } from "react";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

class TimeSlot extends Component {
  edit = () => {
    this.props.edit(this.props.date, this.props.start,
                    this.props.end, this.props.availableId);
  }

  renderHours = () => {
    const start = this.props.start.split(":");
    const end = this.props.end.split(":");
    const startDate = new Date(0, 0, 0, start[0], start[1], 0);
    const endDate = new Date(0, 0, 0, end[0], end[1], 0);
    let diff = endDate.getTime() - startDate.getTime();
    let hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / 1000 / 60);
    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0) {hours = hours + 24;}
    return ("Serving duration: " + hours + " hours and " + (minutes <= 9 ? "0" : "") + minutes + " minutes");
  }

  render(){
    const today = new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()
    return(
      <div>
        <div>
          {new Date(this.props.date).toDateString()}: {this.props.start} to {this.props.end}, {this.renderHours()}
          <button onClick={this.edit}>Edit</button>
        </div>
      </div>
    )
  }

}

class AddTime extends Component {
  state = {
    date: this.props.date ? this.props.date.slice(0,10) : "",
    start: this.props.start ? this.props.start : "",
    end: this.props.end ? this.props.end : "",
    duration: 30,
    confirm: this.props.date ? true: false,
  }

  handleStart(start){
    const time = start.split(":");
    const startDate = new Date(0, 0, 0, time[0], time[1], 0);
    const endTime = startDate.getTime() + (parseInt(this.state.duration) * 60 * 1000);
    const end = new Date(endTime).toString().slice(16, 21);
    this.setState({ start, end })
  }

  done = () => {
    if (!this.props.id){
      fetch(`/meal/${this.props.id}/setavailable`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'same-origin',
              body: JSON.stringify({
                mealId: this.props.mealId,
                chefId: this.props.chefId,
                date: this.state.date,
                start: this.state.start,
                end: this.state.end,
              }),
            })
      .then(resp => resp.json())
      .then(available => this.props.save(this.props.ind, available))
    } else {
      fetch(`/meal/${this.props.id}/setavailable`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'same-origin',
              body: JSON.stringify({
                availableId: this.props.id,
                date: this.state.date,
                start: this.state.start,
                end: this.state.end,
              }),
            })
      .then(resp => resp.json())
      .then(available => this.props.save(this.props.ind, available))
    }
  }

  durationChange = (duration) => {
    this.setState( duration );
    this.handleStart( this.state.start )
  }

  cancel = () => {
    this.setState({
      date: null,
      start: null,
      end: null
    });
    this.props.cancel();
  }

  render(){
    const today = new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()
    return(
      <div>
        <form>
            <input type="date" value={this.state.date} min={today}
              onChange={(e)=>this.setState({ date: e.target.value })}/>
            <label>Start time</label>
            <input type="time" name="start" value={this.state.start}
              onChange={(e)=>this.handleStart(e.target.value)}/>
            <label>End time</label>
            <input type="time" name="end" value={this.state.end}
              onChange={(e)=>this.setState({ end: e.target.value })}/>
            <label>Duration</label>
            <input type="text" name="duration" value={this.state.duration}
              onChange={(e)=> this.durationChange(e.target.value) }/>
            <button onClick={this.done}>Done</button>
            <button onClick={this.cancel}>Cancel</button>
          </form>
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
  }

  componentDidMount = () => {
    fetch(`/meal/${this.props.mealId}/available`)
      .then(resp => resp.json())
      .then(available => {
        console.log('available', available);
        this.setState({ available })
      })
  }

  save = (ind, timeObj) => {
    const available = this.state.available.slice();
    available.splice(ind, 1, timeObj);
    this.setState({
      available,
      date: null,
      start: null,
      end: null,
      availableId: null,
      ind: null,
      add: true,
    })
  }

  addTime = () => {
    this.setState({ add: !this.state.add })
  }

  commit = () => {
    this.props.set(this.state.available);
    this.props.history.push(`/meal/${this.props.meal._id}`);
  }

  edit = async (date, start, end, availableId) => {
    await this.setState({ date, start, end, availableId})
    this.setState({ add: true })
  }

  cancel = () => {
    this.setState({ add: false })
  }

  render() {
    const meal = this.props.meal;
    return(
      <div>
        <h4>Set customer pickup times for {meal.title}</h4>
        <p>When are you offering this meal?</p>
        <button onClick={this.addTime}>Add time slots</button>
        {this.state.add
          ? <AddTime date={this.state.date} start={this.state.start}
                     end={this.state.end} availableId={this.state.availableId}
                     mealId={meal._id} chefId={meal.chef._id}
                     ind={this.state.ind} cancel={this.cancel} save={this.save}
                   />
          : null }
        {this.state.available.map((obj, ind) =>
          <TimeSlot key={ind} ind={ind} date={obj.date} start={obj.start}
            end={obj.end} edit={this.edit}/>)}
        <button onClick={this.commit}>Save</button>
      </div>
    )
  }
}
