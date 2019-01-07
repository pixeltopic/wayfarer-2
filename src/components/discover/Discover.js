import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Menu, Container } from "semantic-ui-react";

import SearchRouteForm from "./SearchRouteForm";
import DirectionSteps from "./DirectionSteps";
import Incidents from "./Incidents";

class Discover extends Component {

  state = { activeItem: "directions" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  renderBody() {
    switch(this.state.activeItem) {
      case "directions":
        return <DirectionSteps />;
      case "incidents":
        return <Incidents />;
      default:
        return null;
    }
  }

  render() {
    return (
      <Container>
        <Menu>
          <Menu.Item 
            name="directions"
            active={this.state.activeItem === "directions"}
            disabled={!this.props.routes}
            onClick={this.handleItemClick}
          >
            Directions
          </Menu.Item>
          <Menu.Item 
            name="incidents"
            active={this.state.activeItem === "incidents"}
            disabled={!this.props.routes}
            onClick={this.handleItemClick}
          >
            Incidents
          </Menu.Item>
          <Menu.Item 
            name="places"
            active={this.state.activeItem === "places"}
            disabled={!this.props.routes}
            onClick={this.handleItemClick}
          >
            Places
          </Menu.Item>
        </Menu>
        <Grid stackable doubling>
          <Grid.Column width={4}>
            <SearchRouteForm />
          </Grid.Column>
          <Grid.Column stretched width={12} >
            {this.renderBody()}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return { routes: state.maps.routes };
}

export default connect(mapStateToProps)(Discover);