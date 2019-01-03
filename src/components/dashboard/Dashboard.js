import React, { Component } from "react";
import requireAuth from "../helpers/hocs/requireAuth";

import history from "../../history";
import { verifyToken, routes } from "../../utils";

class Dashboard extends Component {
  componentDidMount() {
    if (!verifyToken(localStorage.getItem("token"))) {
      history.push(routes.SIGNOUT);
    }
  }

  render() {
    return (
      <div>
        Dashboard Component (Protected by authentication!)
      </div>
    );
  }
}

export default requireAuth(Dashboard);