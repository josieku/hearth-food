import React, { Component } from "react";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

class TimeSlot extends Component {
  state = {
    date: this.props.date ? this.props.date.slice(0,10) : "",
    start: this.props.start ? this.props.start : "",
    end: this.props.end ? this.props.end : "",
    confirm: this.props.date ? true: false,
  }

  handleStart(start){
    const time = start.split(":");
    const startDate = new Date(0, 0, 0, time[0], time[1], 0);
    const endTime = startDate.getTime() + (30 * 60 * 1000);
    const end = new Date(endTime).toString().slice(16, 21);
    this.setState({ start, end })
  }

  done = (e) => {
    e.preventDefault();
    if (this.state.date && this.state.start && this.state.end){
      fetch(`/meal/${this.props.id}/setavailable`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'same-origin',
              body: JSON.stringify({
                mealId: this.props.id,
                chefId: this.state.chefId,
                date: this.state.date,
                start: this.state.start,
                end: this.state.end,
              }),
            })
      .then(resp => resp.json())
      .then(available => this.props.save(available))
      //
      // this.setState({ confirm: true });
      // const obj = {
      //   date: this.state.date,
      //   start: this.state.start,
      //   end: this.state.end
      // }
      // this.props.save(this.props.ind, obj);
    }
  }

  edit = () => {
    this.setState({ confirm: false })
  }

  renderHours = () => {
    const start = this.state.start.split(":");
    const end = this.state.end.split(":");
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
        {this.state.confirm
          ? <div>
              {new Date(this.state.date).toDateString()}: {this.state.start} to {this.state.end}, {this.renderHours()}
              <button onClick={this.edit}>Edit</button>
            </div>
          : <form>
              <input type="date" value={this.state.date} min={today}
                onChange={(e)=>this.setState({ date: e.target.value })}/>
              <label>Start time</label>
              <input type="time" name="start" value={this.state.start}
                onChange={(e)=>this.handleStart(e.target.value)}/>
              <label>End time</label>
              <input type="time" name="end" value={this.state.end}
                onChange={(e)=>this.setState({ end: e.target.value })}/>
              <button type="submit" onClick={this.done}>Done</button>
            </form>}
      </div>
    )
  }

}

class AddTime extends Component {
  state = {
    date: this.props.date ? this.props.date.slice(0,10) : "",
    start: this.props.start ? this.props.start : "",
    end: this.props.end ? this.props.end : "",
    confirm: this.props.date ? true: false,
  }

  handleStart(start){
    const time = start.split(":");
    const startDate = new Date(0, 0, 0, time[0], time[1], 0);
    const endTime = startDate.getTime() + (30 * 60 * 1000);
    const end = new Date(endTime).toString().slice(16, 21);
    this.setState({ start, end })
  }

  done = (e) => {
    e.preventDefault();
    this.props.save()
    if (this.state.date && this.state.start && this.state.end){
      fetch(`/meal/${this.props.id}/setavailable`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'same-origin',
              body: JSON.stringify({
                mealId: this.props.id,
                chefId: this.state.chefId,
                date: this.state.date,
                start: this.state.start,
                end: this.state.end,
              }),
            })
      .then(resp => resp.json())
      .then(available => this.props.save(available))
      //
      // this.setState({ confirm: true });
      // const obj = {
      //   date: this.state.date,
      //   start: this.state.start,
      //   end: this.state.end
      // }
      // this.props.save(this.props.ind, obj);
    }
  }

  edit = () => {
    this.setState({ confirm: false })
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
            <button type="submit" onClick={this.done}>Done</button>
          </form>
      </div>
    )
  }
}

export default class SetAvailability extends Component {
  state = {
    available: []
  }

  componentDidMount = () => {
    console.log('mounting');
    fetch(`/meal/${this.props.mealId}/available`)
      .then(resp => resp.json)
      .then(available => {
        console.log('available', available);
        this.setState({ available })
      })
  }

  save = (ind, timeObj) => {
    const available = this.state.available.slice();
    available.splice(ind, 1, timeObj);
    this.setState({ available })
  }

  addTime = () => {
    const available = this.state.available.slice();
    available.push({});
    this.setState({ available })
  }

  commit = () => {
    this.props.set(this.state.available);
    this.props.history.push(`/meal/${this.props.meal._id}`);
  }

  render() {
    const meal = this.props.meal;
    return(
      <div>
        <h4>Set customer pickup times for {meal.title}</h4>
        <p>When are you offering this meal?</p>
        <button onClick={this.props.addTime}>Add time slots</button>
        {this.props.times.map((obj, ind) =>
          <TimeSlot key={ind} ind={ind} date={obj.date} start={obj.start}
            end={obj.end} save={this.props.save}/>)}
        <button onClick={this.commit}>Save</button>
      </div>
    )
  }
}
