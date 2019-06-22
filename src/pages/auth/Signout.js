import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Segment, Transition, Header, Icon } from "semantic-ui-react";

import { signout } from "../../actions";

class Signout extends Component {

  _isMounted = false;

  state = { visible: false };

  componentDidMount() {
    this._isMounted = true;
    
    this.props.signout();
    setTimeout(() =>  this._isMounted && this.setState({ visible: true }), 500);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Container>
        <Segment padded="very" style={{ minHeight: "80vh" }}>
          <Transition visible={this.state.visible} animation="fade down" duration={1000}>
            <Header icon textAlign="center" as="h2" style={{ padding: "20vh" }}>
              <Icon name="power off" color="red" size="large" circular/>
              You've been signed out.
            </Header>
          </Transition>
        </Segment>
      </Container>
    );
  }
}

export default connect(null, { signout })(Signout);