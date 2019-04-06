import React, { Component } from "react";
import {
  Container,
  Divider,
  Grid,
  Header,
  Image,
  List,
  Segment
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <Segment
        inverted
        vertical
        style={
          this.props.location.pathname !== "/"
            ? { margin: "5em 0em 0em", padding: "5em 0em" }
            : { padding: "5em 0em" }
        }
      >
        <Container textAlign="center">
          <Grid divided inverted stackable>
            <Grid.Column width={8}>
              <Header inverted as="h4" content="Used APIs" />
              <List link inverted>
                <List.Item as="a">Google Maps</List.Item>
                <List.Item as="a">MapQuest</List.Item>
                <List.Item as="a">Wit.ai</List.Item>
              </List>
            </Grid.Column>

            <Grid.Column width={8}>
              <Header inverted as="h4" content="About" />
              <p>Site created by pixeltopic.</p>
            </Grid.Column>
          </Grid>

          <Divider inverted section />
          <Image
            centered
            size="mini"
            src="https://avatars1.githubusercontent.com/u/32804347?s=400&v=4"
          />
          <List horizontal inverted divided link size="small">
            <List.Item as="a" href="https://github.com/pixeltopic">
              Github
            </List.Item>
            <List.Item as="a" href="https://github.com/pixeltopic">
              Contact
            </List.Item>
          </List>
        </Container>
      </Segment>
    );
  }
}

export default withRouter(Footer);
