import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from "../../history";
import { verifyToken, verifyInactiveToken,routes } from "../../utils";
import { refreshToken } from "../../actions";

// HOC to prevent access of component unless authenticated

export default ChildComponent => {
  class ComposedComponent extends Component {
    // Our component just got rendered
    componentDidMount() {
      this.shouldNavigateAway();
    }
    // Our component just got updated
    componentDidUpdate() {
      this.shouldNavigateAway();
    }
    async shouldNavigateAway() {
      if (!this.props.auth) { // not logged in at all
        console.log("requireAuth: Not logged in, redirecting.");
        history.push(routes.HOME);
      } else {
        const prevToken = localStorage.getItem("token");
        if (!verifyToken(prevToken)) { // token expired
          if (!verifyInactiveToken(prevToken)) { // check if token can be renewed
            console.log("requireAuth: Token cannot be refreshed, logging out.");
            history.push(routes.SIGNOUT);
            return;
          }
          await this.props.refreshToken(); 
        }
      }  
    }
    render() {
      return <ChildComponent {...this.props} />;
    }
  }
  function mapStateToProps(state) {
    return { auth: state.auth.authenticated };
  }
  return connect(mapStateToProps, { refreshToken })(ComposedComponent);
};