import React, { Component } from "react";

class App extends Component {
  render() {
    return (
      <div>Hello World App.js
        {this.props.children}
      </div>
    );
  }
}

export default App;