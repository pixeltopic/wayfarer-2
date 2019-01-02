import React, { Component } from "react";
import requireAuth from "../helpers/hocs/requireAuth";

class Dashboard extends Component {
  render() {
    return (
      <div>
        Dashboard Component (Protected by authentication!)
      </div>
    );
  }
}

export default requireAuth(Dashboard);