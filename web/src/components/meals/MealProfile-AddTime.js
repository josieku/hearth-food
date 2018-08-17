import React, { Component } from "react";
import { Button, Form, Grid, Header, Image, Item, Menu, Message, Segment, Loader, Modal, Divider, Input } from 'semantic-ui-react';
import { DatePicker, TimePicker } from "@blueprintjs/datetime";
import './../../../../node_modules/@blueprintjs/core/lib/css/blueprint.css';
// import './../../../../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import './../../../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import moment from 'moment';

export default class AddTime extends Component {
  state = {
    date: moment().add(1,'hours').toDate(),
    start: moment().add(1, 'hours').toDate(),
    end: moment().add(1, 'hours').add(30,'minutes').toDate(),
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.date !== null){
      return {
        date: new Date(props.date),
        start: moment(props.start, "HH:mm").toDate(),
        end: moment(props.end, "HH:mm").toDate()
      }
    }
    return null
  }

  done = e => {
    e.preventDefault()
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
    console.log(this.state.start, start)
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
      console.log('!!!props!!!', this.props)
      console.log('***state***', this.state)
      return(
        <div>
          {/* <Button onClick={()=>this.setState({open: true})}>Add Time Slot</Button> */}
          <Modal open={this.props.open} size='small'>
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
