import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import requireAuth from "../../components/hocs/requireAuth";
import server from "../../api/server";

class Dashboard extends Component {

  render() {
    return (
      <div>
        <p>Dashboard Component (Protected by authentication!)</p>
        
        <Button onClick={() => server.get("/api/checkauth", {
          headers: {
            authorization: this.props.isLoggedIn
          }
        })}>Test Interceptor</Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.authenticated
  }
}

export default connect(mapStateToProps)(requireAuth(Dashboard));