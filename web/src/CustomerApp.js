import React from "react";

class CustomerApp extends React.Component {
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
        <h1>Register to get your meals cooked from one of our chefs!</h1>
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
          <label>Favorite Dishes:
            <input type="text" name="favDishes" />
            <input type="text" name="favDishes" />
            <input type="text" name="favDishes" />
          </label>
          <label>Picture of driver's license:
            <input type="file" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}
export default CustomerApp;
