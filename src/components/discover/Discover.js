import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Menu, Container } from "semantic-ui-react";

import { updateActiveDiscover } from "../../actions";
import SearchRouteForm from "./SearchRouteForm";
import SearchPlaceForm from "./SearchPlaceForm";
import DirectionSteps from "./DirectionSteps";
import Incidents from "./Incidents";
import PlacesResults from "./PlacesResults";
import PlaceDetails from "./PlaceDetails";
import SearchPlaceholder from "./SearchPlaceholder";
import Legend from "./Legend";

const legendData = [
  { name: "home", color: "grey", text: "Origin" },
  { name: "flag checkered", color: "grey", text: "Destination" },
  { name: "cog", color: "grey", text: "Construction" }, 
  { name: "map pin", color: "grey", text: "Event" },
  { name: "clock", color: "grey", text: "Congestion" },
  { name: "exclamation circle", color: "grey", text: "Incident or Traffic" },
  { color: "green", text: "Very Low Significance" },
  { color: "olive", text: "Low" },
  { color: "yellow", text: "Moderate" },
  { color: "orange", text: "High" },
  { color: "red", text: "Very High Significance" }
];

class Discover extends Component {

  handleItemClick = (e, { name }) => this.props.updateActiveDiscover(name);

  renderBody() {
    switch(this.props.activeItem) {
      case "directions":
        if (this.props.routes === undefined) {
          return <SearchPlaceholder />;
        } else if (this.props.routes.length === 0) {
          return <SearchPlaceholder error />;
        } else {
          return <DirectionSteps />;
        }  
      case "incidents":
        if (this.props.routes === undefined) {
          return <SearchPlaceholder />;
        } else if (this.props.routes.length === 0) {
          return <SearchPlaceholder error />;
        } else {
          return <Incidents />;
        }  
      case "places":
        if (this.props.places.length === 0) {
          return <SearchPlaceholder />;
        } else if (this.props.places.length === 0) {
          return <SearchPlaceholder error resultName="places" />;
        } else {
          return <PlacesResults />;
        }
      case "placeDetails":
        return <PlaceDetails />;
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
            active={this.props.activeItem === "directions"}
            // disabled={!this.props.routes}
            onClick={this.handleItemClick}
          >
            Directions
          </Menu.Item>
          <Menu.Item 
            name="incidents"
            active={this.props.activeItem === "incidents"}
            disabled={!this.props.routes}
            onClick={this.handleItemClick}
          >
            Incidents
          </Menu.Item>
          <Menu.Item 
            name="places"
            active={this.props.activeItem === "places" || this.props.activeItem === "placeDetails"}
            // disabled={!this.props.routes}
            onClick={this.handleItemClick}
          >
            Places
          </Menu.Item>
          <Menu.Item position="right">
            <Legend rowData={legendData} />
          </Menu.Item>
        </Menu>
        <Grid stackable doubling>
          <Grid.Column width={4}>
            {this.props.activeItem === "places" || this.props.activeItem === "placeDetails" ? <SearchPlaceForm /> : <SearchRouteForm />}
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
  return { 
    routes: state.maps.routes, 
    places: state.places.results, 
    activeItem: state.discover.activeItem 
  };
}

export default connect(mapStateToProps, { updateActiveDiscover })(Discover);