import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Menu, Icon, Dropdown } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";

import history from "../history";
import { routes } from "../utils";

class Navbar extends Component {

  state = { onHome: false };

  componentDidMount() {
    if (this.props.location.pathname ==="/") {
      this.setState({ onHome: true });
    }
    this.props.history.listen((location, action) => {
      if (location.pathname === "/") {
        this.setState({ onHome: true });
      } else {
        this.setState({ onHome: false });
      }
    });
  }

  renderLinks() {
    if (this.props.authenticated) {
      return (
        <Fragment>
 

          <Menu.Item><Icon name="search" inverted /><Link to={routes.DISCOVER}>Discover</Link></Menu.Item>
          <Menu.Item><Icon name="dashboard" inverted /><Link to={routes.DASHBOARD}>Dashboard</Link></Menu.Item>
          
          
          <Menu.Menu position="right">       
            <Menu.Item position="right">
              <Icon name="user circle" color="teal"/>
              <Dropdown text="You" pointing>
                <Dropdown.Menu>
                  <Dropdown.Item text="Profile" onClick={() => history.push(routes.HOME)} />
                  <Dropdown.Item text="Sign Out" onClick={() => history.push(routes.SIGNOUT)} />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu.Menu>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Menu.Item>
          <Icon name="search" inverted /><Link to={routes.DISCOVER}>Discover</Link>
        </Menu.Item>
        <Menu.Menu position="right">       
          <Menu.Item position="right">
            <Icon name="sign in" color="teal"/>
            <Dropdown text="Sign in or Sign up" pointing>
              <Dropdown.Menu>
                <Dropdown.Item text="Sign In" onClick={() => history.push(routes.SIGNIN)} />
                <Dropdown.Item text="Sign Up" onClick={() => history.push(routes.SIGNUP)} />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu.Menu>
      </Fragment>
    );
  }

  render() {
    return (
      <Menu fixed={this.state.onHome ? "top" : null} inverted borderless stackable style={{ marginBottom: "0px", borderRadius: "0px" }}>
        
          <Menu.Item header>
            <Icon name="home" inverted /><Link to={routes.HOME} >The Wayfarer</Link>
          </Menu.Item>
          {this.renderLinks()}
        
      </Menu>
    );
  }
}

const mapStateToProps = state => {
  return { authenticated: state.auth.authenticated }
}

export default connect(mapStateToProps)(withRouter(Navbar));