import React, { Component } from "react";
import { Grid, Menu, Container } from "semantic-ui-react";

import SearchRouteForm from "./SearchRouteForm";
import DirectionSteps from "./DirectionSteps";

class Discover extends Component {
  render() {
    return (
      <Container>
        <Menu>
          <Menu.Item position="right" >
            Routes
          </Menu.Item>
        </Menu>
        <Grid stackable doubling>
          <Grid.Column width={4}>
            <SearchRouteForm />
          </Grid.Column>
          <Grid.Column stretched width={12} >
            <DirectionSteps />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default Discover;