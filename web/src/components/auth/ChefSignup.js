import React from "react";

class ChefApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: 'Describe your experience cooking and why you would like to cook for Hearth'
    }
  }
  handleChange = e => {
    this.setState({value: e.target.value})
  }
  render() {
    return(
      <div>
        <h1> Apply to be a chef with us! </h1>
        <form>
          <label>Name:
            <input type="text" name="name" />
          </label>
          <label>Phone Number:
            <input type="number" name="phone" />
          </label>
          <label>Age:
            <input type="number" name="age" />
          </label>
          <label>Experience:
            <textarea value={this.state.value} onChange={this.handleChange}/>
          </label>
          <label>Picture of favorite meal to cook:
            <input type="file" />
          </label>
          <label>Picture of driver's license:
            <input type="file" />
          </label>
        </form>
      </div>
    )
  }
}
export default ChefApp;
