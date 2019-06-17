import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Card, Divider, Button, Icon } from "semantic-ui-react";
import { getDistance } from "geolib";
import _ from "lodash";

import { fetchPlaceDetails, updateActiveDiscover, fetchDirections, formCache, fetchMorePlaces } from "../../actions";
import BasicMap from "../common/GoogleMap/BasicMap";
import Marker from "../common/GoogleMap/Marker";
import PlacesResultsFilter from "./PlacesResultsFilter";
import { formNames } from "../../utils";

class PlacesResults extends Component {

  state = { highlighted: "", disablePlaceButton: false, activePage: 0, maxPages: this.props.places.length, disableNextButton: false };

  componentDidUpdate() {
    if (this.state.maxPages !== this.props.places.length) {
      this.setState({ 
        maxPages: this.props.places.length, 
        activePage: this.state.activePage < this.props.places.length ? this.state.activePage : 0 
      });
    }
  }

  filterCurrentPage = () => {
    // filters by ascending order if distance, descending order if place rating. name does not reorder.
    if (_.isEmpty(this.props.filterFormProps) || (!this.props.filterFormProps.keyword && !this.props.filterFormProps.attribute)) {
      return this.props.places[this.state.activePage];
    }

    const { keyword, attribute } = this.props.filterFormProps;
    const center =  this.props.center;
    let filteredArr;
    
    if (keyword && keyword.toString().replace(/ /g,"").length !== 0) {
      filteredArr = this.props.places[this.state.activePage].filter(place => place.name.toString().toLowerCase().includes(keyword.toString().toLowerCase()));
    } else {
      filteredArr = [...this.props.places[this.state.activePage]]
    }

    if (attribute === "distance") {
      return filteredArr.sort(
        (placeA, placeB) => {
          let distanceAwayA = getDistance(center, { lat: placeA.geometry.location.lat, lng: placeA.geometry.location.lng });
          let distanceAwayB = getDistance(center, { lat: placeB.geometry.location.lat, lng: placeB.geometry.location.lng });
          return distanceAwayA - distanceAwayB;
        }
      );
    } else if (attribute === "rating") {
      return filteredArr.sort((placeA, placeB) => (placeB.rating ? placeB.rating : 0) - (placeA.rating ? placeA.rating : 0));
    } else {
      return filteredArr;
    }
  }

  onClickPlaceDetails = place_id => {
    console.log("Place_id:",place_id);
    this.setState(
      { disablePlaceButton: true },
      () => this.props.fetchPlaceDetails(place_id, () => this.props.updateActiveDiscover("placeDetails"))
    );
  }

  placeDetailsButton = place_id => {
    // given a place_id from a place found from Google maps, fetches details from google related to the location.
    // will also update the active component to show the details. (A callback will be passed intro marker from PlaceResults)
    
    return (
      <Button 
        basic color='green' 
        disabled={this.state.disablePlaceButton} 
        loading={this.state.disablePlaceButton} 
        onClick={() => this.onClickPlaceDetails(place_id)}
      >
        Details
      </Button>
    );
  }

  onClickPlaceDirections = (place) => {
    const searchProps = { 
      origin: this.props.placeFormData.address || "", 
      destination: place.vicinity || "", 
      mode: "driving", 
      altRoutes: false, 
      units: "imperial",
      avoidTolls: false, 
      avoidHighways: false, 
      avoidFerries: false, 
      avoidIndoor: false 
    }
    this.props.formCache(formNames.SEARCH_ROUTE_FORM, searchProps);
    this.setState(
      { disablePlaceButton: true }, 
      () => this.props.fetchDirections(searchProps, () => this.props.updateActiveDiscover("directions"))
    );
  }

  placeDirectionsButton = (place) => {
    
    return (
      <Button 
        basic color='blue' 
        disabled={this.state.disablePlaceButton || !this.props.placeFormData.address || !place.vicinity} 
        loading={this.state.disablePlaceButton} 
        onClick={() => this.onClickPlaceDirections(place)}
      >
        Directions
      </Button>
    );
  }

  renderPlacesAsCards = () => {

    const cards = this.filterCurrentPage().map((place, key) => {
      return (
        <Card key={key}>
          <Card.Content>
            <Card.Header>{place.name}</Card.Header>
            <Card.Meta>Rating: {place.rating}/5 based on {place.user_ratings_total} user ratings.</Card.Meta>
            <Card.Description>
              <p>
                <Icon name="calendar outline" color="olive" />
                {place.opening_hours ? (place.opening_hours.open_now ? "Open Now" : "Closed") : "No opening hour data found" }
              </p>
              <p>
                <Icon name="map marker" color="red" />{place.vicinity}
              </p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button.Group size="small" fluid compact>
              {this.placeDirectionsButton(place)}
              {this.placeDetailsButton(place.place_id)}
              <Button disabled={place.id === this.state.highlighted} onClick={() => this.setState({ highlighted: place.id })} basic color="orange">Highlight</Button>
            </Button.Group>
            
          </Card.Content>
        </Card>
      );
    });

    return cards;
  }

  placesAsMarkers = () => {
    const markers = this.filterCurrentPage().map((place, key) => {
      const { lat, lng } = place.geometry.location;
      return <Marker key={key} popup type="place" iconColor={this.state.highlighted === place.id ? "orange" : null} iconName="map marker alternate" lat={lat} lng={lng} placeData={place} />
    });
    markers.push(<Marker key={-1} iconName="home" iconColor="teal" popup={this.props.address} header={this.props.address} lat={this.props.center.lat} lng={this.props.center.lng}/>);
    return markers;
  }


  render() {
    return (
      <Card fluid>
        <BasicMap center={this.props.center}>      
          {this.props.center && this.props.places.length >= 1 && this.props.places.length > this.state.activePage && this.placesAsMarkers()}
        </BasicMap>
        <Card.Content>
          <Divider horizontal>
            <Header as="h4">
              <Icon name="filter" />
              Filter
            </Header>
          </Divider>
          <PlacesResultsFilter />
        </Card.Content>
        <Card.Content style={{ borderTop: "none", paddingTop: 0 }}>
          <Divider horizontal>
            <Header as="h4" name="results" id="results">
              <Icon name="search" />
              Place Results
            </Header>
          </Divider>
          <Card.Group centered doubling itemsPerRow={2}> 
              {this.props.places.length >= 1 && this.props.places.length > this.state.activePage && this.renderPlacesAsCards()}
          </Card.Group>
        </Card.Content>
        <Card.Content extra>
          <Button disabled={this.state.activePage === 0} onClick={() => {
              this.setState({ activePage: this.state.activePage - 1 });
              window.location = "#results";
            }}
          >
            Previous
          </Button>
          <Button 
            floated="right" 
            disabled={(!this.props.nextPageToken && this.state.maxPages-1 === this.state.activePage) || this.state.disableNextButton}
            loading={this.state.disableNextButton}
            onClick={() => this.setState(
              { disableNextButton: true }, 
              () => this.props.fetchMorePlaces(() => this.setState({ disableNextButton: false, activePage: this.state.activePage + 1 }, () => window.location = "#results")))}
          >
            Next
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    places: state.places.results,
    nextPageToken: state.places.nextPageToken,
    center: state.places.center,
    address: state.places.address,
    placeFormData: state.form[formNames.SEARCH_PLACE_FORM] || {},
    filterFormProps: state.form[formNames.PLACES_RESULTS_FILTER] || {}
  };
}

export default connect(mapStateToProps, { fetchDirections, fetchPlaceDetails, updateActiveDiscover, formCache, fetchMorePlaces })(PlacesResults);