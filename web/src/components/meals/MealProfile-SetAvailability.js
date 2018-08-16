import React, { Component } from "react";
import { Button, Form, Grid, Header, Image, Item, Menu, Message, Segment, Loader, Modal, Divider, Input } from 'semantic-ui-react';
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
      open: false,
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
        date: moment().add(1,'hours').toDate(),
        start: moment().add(1, 'hours').toDate(),
        end: moment().add(1, 'hours').add(30,'minutes').toDate(),
        open: false,
      })
    }

    cancel = e => {
      e.preventDefault();
      this.setState({
        date: moment().add(1,'hours').toDate(),
        start: moment().add(1, 'hours').toDate(),
        end: moment().add(1, 'hours').add(30,'minutes').toDate(),
        open: false
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

    renderHours = () => {
      const start = moment(this.state.start, "HH:mm");
      const end = moment(this.state.end, "HH:mm");
      const minutes = end.diff(start, 'minutes');
      return ("Serving duration: " + minutes + " minutes");
    }

    renderPreview = (date, start, end) => {
      return (
        <div>
          <p>{date.toDateString()}</p>
          <p>{moment(start).format("hh:mm A")} - {moment(end).format("hh:mm A")}</p>
          <p>{this.renderHours()}</p>
        </div>)
    }

    render(){
      return(
        <div>
          <Button onClick={()=>this.setState({open: true})}>Add Time Slot</Button>
          <Modal open={this.state.open} size='small'>
            <Modal.Content>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={6}>
                    <div style={{width: "230px"}}>
                      <Header as="h4">Date</Header>
                      <DatePicker
                        value={this.state.date}
                        showActionsBar={true}
                        minDate={new Date()}
                        maxDate={moment().add(14, 'days').toDate()}
                        onChange={this.handleDateChange}/>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <Item>
                        <Header as="h4">Start time</Header>
                        <TimePicker
                          value={this.state.start}
                          showArrowButtons useAmPm
                          onChange={this.handleStartChange}/>
                        <Header as="h4">End time</Header>
                        <TimePicker
                          value={this.state.end}
                          showArrowButtons useAmPm
                          minTime={moment(this.state.start).add(30,'minutes').toDate()}
                          onChange={this.handleEndChange}/>
                      </Item>
                    </Grid.Column>
                    <Grid.Column width={5}>
                      <Header as="h4">Preview</Header>
                        {this.renderPreview(this.state.date, this.state.start, this.state.end)}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Modal.Content>
              <Modal.Actions>
                <Button id='redButton' onClick={this.done}>
                  {this.props.date ? "Save" : "Add"}
                </Button>
                <Button id='redButton' onClick={this.cancel}>
                  Cancel
                </Button>
              </Modal.Actions>
            </Modal>
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
            .then(list => {
              const available = list.filter(item => item.time > Date.now())
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
                        <AddTime date={this.state.date} start={this.state.start}
                         end={this.state.end}
                         availableId={this.state.availableId}
                         mealId={meal._id} chefId={meal.chef._id}
                         ind={this.state.ind} cancel={this.cancel} save={this.save}
                        />
                      </Menu.Menu>
                    </Menu>

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
