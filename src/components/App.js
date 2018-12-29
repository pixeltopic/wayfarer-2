import React, { Component } from "react";
import Navbar from "./common/Navbar";

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        {this.props.children}
      </div>
    );
  }
}

export default App;