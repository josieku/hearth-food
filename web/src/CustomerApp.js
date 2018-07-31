import React from "react";

class CustomerApp extends React.Component {
  render() {
    return(
      <div>
        <h1>Register to get your meals cooked from one of our chefs!</h1>
        <form>
          <label>Name:
            <input type="text" name="name" placeholder="Please enter your full name"/>
          </label>
          <label>Phone Number:
            <input type="number" name="phone" placeholder="Phone Number"/>
          </label>
          <label>Favorite Dishes:
            <input type="text" name="favDishes" placeholder="Please enter your favorite dish"/>
            <input type="text" name="favDishes" placeholder="Please enter your favorite dish"/>
            <input type="text" name="favDishes" placeholder="Please enter your favorite dish"/>
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
