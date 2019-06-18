import React from "react";
import { Header, Icon, Segment } from "semantic-ui-react";

const SearchPlaceholder = (props) => (
  <Segment placeholder>
    <Header icon>
      <Icon name="search" />
      {props.error ? `No ${props.resultName || "routes"} found with your search settings.` : "To get started, make a search on the left sidebar!" }
    </Header>
  </Segment>
);

export default SearchPlaceholder;