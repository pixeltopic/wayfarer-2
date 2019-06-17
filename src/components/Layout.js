import React, { Component } from "react";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div style={{ marginTop: "2em" }}>
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;