import React, { Component } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

class Layout extends Component {
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

export default Layout;