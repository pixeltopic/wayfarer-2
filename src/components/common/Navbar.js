import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Menu, Icon, Dropdown } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";

import history from "../../history";
import { routes } from "../../utils";

class Navbar extends Component {

  renderLinks() {
    if (this.props.authenticated) {
      return (
        <Fragment>
          <Menu.Item> <Link to={routes.DISCOVER}>Discover</Link></Menu.Item>
          <Menu.Item> <Link to={routes.DASHBOARD}>Dashboard</Link></Menu.Item>
          <Menu.Item position="right">       
            <Icon name="user circle" color="teal" />
            <Menu.Menu position="right">
              <Dropdown text="You" pointing>
                <Dropdown.Menu>
                  <Dropdown.Item text="Profile" onClick={() => history.push(routes.HOME)} />
                  <Dropdown.Item text="Sign Out" onClick={() => history.push(routes.SIGNOUT)} />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Menu.Item>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Menu.Item> <Link to={routes.DISCOVER}>Discover</Link></Menu.Item>
        <Menu.Item position="right">       
          <Icon name="sign in" color="teal" />
          <Menu.Menu position="right">
            <Dropdown text="Sign in or Sign up" pointing>
              <Dropdown.Menu>
                <Dropdown.Item text="Sign In" onClick={() => history.push(routes.SIGNIN)} />
                <Dropdown.Item text="Sign Up" onClick={() => history.push(routes.SIGNUP)} />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu.Item>
      </Fragment>
    );
  }

  render() {
    return (
      <Menu borderless stackable style={{ marginBottom: "0px", borderRadius: "0px" }}>
        
          <Menu.Item header>
            <Link to={routes.HOME} >Wayfarer 2</Link>
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