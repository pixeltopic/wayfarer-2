import React, { Component } from "react";
import requireAuth from "../../components/hocs/requireAuth";

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