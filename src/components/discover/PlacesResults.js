import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Card, Divider, Button, Icon } from "semantic-ui-react";

import { fetchPlaceDetails, updateActiveDiscover, fetchDirections, formCache } from "../../actions";
import BasicMap from "../common/GoogleMap/BasicMap";
import Marker from "../common/GoogleMap/Marker";

class PlacesResults extends Component {

  state = { highlighted: "", disablePlaceButton: false };

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
      radius: null,
      avoidTolls: false, 
      avoidHighways: false, 
      avoidFerries: false, 
      avoidIndoor: false 
    }
    this.props.formCache("SearchRouteForm", searchProps);
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

    const cards = this.props.places.map((place, key) => {
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
              {this.placeDetailsButton(place.id)}
              <Button disabled={place.id === this.state.highlighted} onClick={() => this.setState({ highlighted: place.id })} basic color="orange">Highlight</Button>
            </Button.Group>
            
          </Card.Content>
        </Card>
      );
    });

    return cards;
  }

  placesAsMarkers = () => {
    const markers = this.props.places.map((place, key) => {
      const { lat, lng } = place.geometry.location;
      return <Marker key={key} popup type="place" iconColor={this.state.highlighted === place.id ? "orange" : null} iconName="map marker alternate" lat={lat} lng={lng} placeData={place} />
    });
    markers.push(<Marker key={-1} iconName="home" iconColor="teal" lat={this.props.center.lat} lng={this.props.center.lng}/>);
    return markers;
  }


  render() {
    return (
      <Segment>
        <BasicMap center={this.props.center}>
          
          { this.props.center && this.placesAsMarkers()}
          
        </BasicMap>
        <Divider hidden />
        <Card.Group centered doubling itemsPerRow={2}>
            {this.renderPlacesAsCards()}
        </Card.Group>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    places: state.places.results, 
    center: state.places.center,
    placeFormData: state.form["SearchPlaceForm"] || {}
  };
}

export default connect(mapStateToProps, { fetchDirections, fetchPlaceDetails, updateActiveDiscover, formCache })(PlacesResults);