import React, { Component } from "react";
// import Modal from 'react-modal';
import { Button, Header, Image, Modal } from 'semantic-ui-react'



export default class Add extends Component{
  state = {
    title: "",
    description: "",
    ingredients: "",
    price: 0,
  }

  componentDidMount() {
    // Modal.setAppElement('#root');
  }

  save = e => {
    console.log('saving');
    this.props.save(this.state.title, this.state.description, this.state.ingredients, parseInt(this.state.price));
    this.setState({
      title: "",
      description: "",
      ingredients: "",
      price:0,
    })
  }

  afterOpenModal= ()=> {
    // references are now sync'd and can be accessed.
  }

  closeModal = () => {
    this.setState({open: false});
  }

  render() {



    // const customStyles = {
    //   content : {
    //     top                   : '50%',
    //     left                  : '50%',
    //     right                 : 'auto',
    //     bottom                : 'auto',
    //     marginRight           : '-50%',
    //     transform             : 'translate(-50%, -50%)'
    //   }
    // };

    return (
      <div>
        <div>Add a Dish</div>
        <form>
          <input placeholder="Title" onChange={e => this.setState({title: e.target.value})}/>
          <input placeholder="Description" onChange={e => this.setState({description: e.target.value})}/>
          <input placeholder="Ingredients" onChange={e => this.setState({ingredients: e.target.value})}/>
          <input placeholder="price" onChange={e => this.setState({price: e.target.value})}/>
        </form>
        <button onClick={this.save}>Add to menu</button>
        {/* <button onClick={() => this.setState({ open: true })}>Add a Dish</button>
        <button>X</button>
        <Modal isOpen={this.state.open} onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal} ariaHideApp={false} style={null}>
          <button onClick={() => this.setState({ open: false })}>CLOSE</button>
          <div>Add a Dish</div>
          <form>
            <input placeholder="Title" onChange={e => this.setState({title: e.target.value})}/>
            <input placeholder="Description" onChange={e => this.setState({description: e.target.value})}/>
            <input placeholder="Ingredients" onChange={e => this.setState({ingredients: e.target.value})}/>
            <input placeholder="price" onChange={e => this.setState({price: e.target.value})}/>
          </form>
          <button onClick={this.save}>Add to menu</button>
        </Modal> */}
      </div>
    );
  }
};
