import React, { Component } from "react";
import { Button, Form, Grid, Header, Image, Item, Menu, Message, Segment, Loader, Modal, Divider } from 'semantic-ui-react';
import { DatePicker, TimePicker } from "@blueprintjs/datetime";
import './../../../../node_modules/@blueprintjs/core/lib/css/blueprint.css';
// import './../../../../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import './../../../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css';
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
          <Segment piled>
            {new Date(this.props.date).toDateString()}: {this.props.start} to {this.props.end}, {this.renderHours()}
            <Button id='redButton' size='tiny' onClick={this.edit}>Edit</Button>
            <Button id='redButton' size='tiny' onClick={this.delete}>Delete</Button>
          </Segment>
        </div>
      )
    }

  }

  class AddTime extends Component {
    state = {
      date: this.props.date ? new Date(this.props.date) : moment().add(1,'hours').toDate(),
      start: this.props.start
      ? moment(this.props.start, "HH:mm").toDate()
      : moment().add(1, 'hours').toDate(),
      end: this.props.end
      ? moment(this.props.end, "HH:mm").toDate()
      : moment().add(1, 'hours').add(30,'minutes').toDate(),
      duration: 30,
      confirm: this.props.date ? true: false,
    }

    done = e => {
      e.preventDefault()
      console.log('availableId', this.props.availableId);
      const timeObj = {
        date: this.state.date,
        start: moment(this.state.start).format("HH:mm"),
        end: moment(this.state.end).format("HH:mm"),
        availableId: this.props.availableId,
      }
      this.props.save(this.props.ind, timeObj);
      this.setState({
        date: "",
        start: "",
        end: ""
      })
    }

    cancel = e => {
      e.preventDefault();
      this.setState({
        date: null,
        start: null,
        end: null
      });
      this.props.cancel();
    }

    handleDateChange = (date) => {
      this.setState({ date })
    }

    handleStartChange = (start) => {
      this.setState({ start })
    }

    handleEndChange = (end) => {
      this.setState({ end })
    }

    render(){
      return(
        <Modal trigger={<Button id='redButton' size='mini'>Add Time Slot</Button>} size='small' closeIcon>
          <Modal.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column width={7}>
                  <div style={{width: "230px"}}>
                    <DatePicker
                      // value={this.state.date}
                      showActionsBar={true}
                      minDate={new Date()}
                      maxDate={moment().add(14, 'days').toDate()}
                      onChange={this.handleDateChange}/>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Item>
                      <label>Start time</label>
                      <TimePicker
                        // value={this.state.start}
                        showArrowButtons useAmPm
                        onChange={this.handleStartChange}/>
                        <label>End time</label>
                        <TimePicker
                          // value={this.state.end}
                          showArrowButtons useAmPm
                          minTime={moment(this.state.start).add(30,'minutes').toDate()}
                          onChange={this.handleEndChange}/>
                          <Button id='redButton' size='tiny' onClick={this.done}>
                            {this.props.date ? "Save" : "Add"}
                          </Button>
                        </Item>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Modal.Content>
              </Modal>
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
              this.setState({ available })
            })
          }

          addTime = () => {
            this.setState({ add: !this.state.add })
          }

          cancel = () => {
            this.setState({ add: false })
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

          edit = async (date, start, end, ind, availableId) => {
            await this.setState({ date, start, end, ind, availableId })
            this.setState({ add: true })
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
            })
          }

          render() {
            const meal = this.props.meal;
            return(
              <div>
                {this.props.loading
                  ? <Loader active inline='centered'>Be happy with hearth!</Loader>
                  : <div>
                    <Header as='h2'
                      style={{marginBottom: '4px', backgroundColor: '#D6D4D4', paddingBottom: '10px', paddingTop: '10px'}}>
                      Set customer pickup times for {meal.title}
                    </Header>
                    <Header as='h4' style={{marginBottom: '8px', marginTop: '3px'}}>When are you offering this meal?</Header>
                    <AddTime date={this.state.date} start={this.state.start}
                     end={this.state.end}
                     availableId={this.state.availableId}
                     mealId={meal._id} chefId={meal.chef._id}
                     ind={this.state.ind} cancel={this.cancel} save={this.save}
                    />
                      <Divider/>
                      <Header as='h2' style={{marginBottom: '4px', backgroundColor: '#D6D4D4', paddingBottom: '10px', paddingTop: '10px'}}>
                        Time Slots
                      </Header>
                      {this.state.available
                        .sort((a,b)=>new Date(a.date)-new Date(b.date))
                        .map((obj, ind) =>
                        <TimeSlot key={ind} ind={ind} date={obj.date} start={obj.start}
                          end={obj.end} availableId={obj._id}
                          edit={this.edit} delete={this.delete}/>)}
                          <Button id='redButton' size='tiny' onClick={this.commit}>Save</Button>
                        </div>
                      }
                    </div>
                  )
                }
              }
